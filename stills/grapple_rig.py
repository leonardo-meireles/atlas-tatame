"""
grapple_rig.py  -  Reusable capsule-humanoid rig for "O Mapa do Jiu-Jitsu" stills.

Style inspired by GrappleMap (github project): each figure is a skeleton of
sphere JOINTS connected by capsule LIMBS, posed in 3D, rendered flat/toon to a
clean 2D technical plate on a transparent background.

Usage (inside Blender, via BlenderMCP):
    exec(open('/.../stills/grapple_rig.py').read())
    build_scene(POSE_GUARDA_FECHADA)
    render_still('/.../public/stills/guarda-fechada.png')

Re-pose for other positions by copying a POSE_* dict and editing joint coords.
Coordinate convention: +Z up, body lies/sits in the X(left-right)/Y(north-south) plane.
"""
import bpy, bmesh, math
from mathutils import Vector

# ---- joint sphere radii (meters) ----
JOINT_R = {
    'Head': 0.10, 'Neck': 0.055, 'Core': 0.11,
    'LeftShoulder': 0.065, 'RightShoulder': 0.065,
    'LeftElbow': 0.05, 'RightElbow': 0.05,
    'LeftWrist': 0.04, 'RightWrist': 0.04,
    'LeftHand': 0.05, 'RightHand': 0.05,
    'LeftHip': 0.08, 'RightHip': 0.08,
    'LeftKnee': 0.075, 'RightKnee': 0.075,
    'LeftAnkle': 0.055, 'RightAnkle': 0.055,
    'LeftToe': 0.045, 'RightToe': 0.045,
}

# ---- limb capsules: (jointA, jointB, radius) ----
LIMBS = [
    ('Head', 'Neck', 0.05),
    ('Neck', 'Core', 0.085),
    ('Neck', 'LeftShoulder', 0.05), ('Neck', 'RightShoulder', 0.05),
    ('LeftShoulder', 'LeftElbow', 0.052), ('LeftElbow', 'LeftWrist', 0.038), ('LeftWrist', 'LeftHand', 0.036),
    ('RightShoulder', 'RightElbow', 0.052), ('RightElbow', 'RightWrist', 0.038), ('RightWrist', 'RightHand', 0.036),
    ('LeftShoulder', 'Core', 0.07), ('RightShoulder', 'Core', 0.07),
    ('Core', 'LeftHip', 0.085), ('Core', 'RightHip', 0.085),
    ('LeftHip', 'RightHip', 0.09),
    ('LeftHip', 'LeftKnee', 0.085), ('LeftKnee', 'LeftAnkle', 0.062), ('LeftAnkle', 'LeftToe', 0.045),
    ('RightHip', 'RightKnee', 0.085), ('RightKnee', 'RightAnkle', 0.062), ('RightAnkle', 'RightToe', 0.045),
]


def _make_capsule(p1, p2, r, segments=14):
    p1 = Vector(p1); p2 = Vector(p2)
    axis = p2 - p1
    length = max(axis.length, 1e-5)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segments,
                          radius1=r, radius2=r, depth=length)
    me = bpy.data.meshes.new("capseg")
    bm.to_mesh(me); bm.free()
    obj = bpy.data.objects.new("capseg", me)
    bpy.context.collection.objects.link(obj)
    obj.location = (p1 + p2) * 0.5
    z = Vector((0, 0, 1))
    q = z.rotation_difference(axis.normalized())
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = q
    return obj


def _make_sphere(p, r):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=18, v_segments=12, radius=r)
    me = bpy.data.meshes.new("joint")
    bm.to_mesh(me); bm.free()
    obj = bpy.data.objects.new("joint", me)
    bpy.context.collection.objects.link(obj)
    obj.location = Vector(p)
    return obj


def _make_material(name, color):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = 1.0
    if 'Specular IOR Level' in bsdf.inputs:
        bsdf.inputs['Specular IOR Level'].default_value = 0.0
    if 'Metallic' in bsdf.inputs:
        bsdf.inputs['Metallic'].default_value = 0.0
    return mat


def build_figure(name, joints, color):
    parts = []
    for jn, p in joints.items():
        parts.append(_make_sphere(p, JOINT_R.get(jn, 0.05)))
    for a, b, r in LIMBS:
        if a in joints and b in joints:
            parts.append(_make_capsule(joints[a], joints[b], r))
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:
        o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    fig = bpy.context.active_object
    fig.name = name
    # remesh-free smooth + auto smooth so silhouette stays clean
    bpy.ops.object.shade_smooth()
    fig.data.materials.append(_make_material(name + "_mat", color))
    # Workbench "MATERIAL" color mode reads material.diffuse_color (viewport),
    # not the Principled base color, so set it explicitly.
    fig.data.materials[0].diffuse_color = (*color, 1.0)
    return fig


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for c in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for b in list(c):
            c.remove(b)


# ---- muted distinct tones ----
INK = (0.12, 0.13, 0.16)     # dark blue-grey ink figure
CLAY = (0.78, 0.46, 0.33)    # terracotta clay figure


def setup_camera_and_light():
    # 3/4 view camera looking down at the action
    cam_data = bpy.data.cameras.new("Cam")
    cam = bpy.data.objects.new("Cam", cam_data)
    bpy.context.collection.objects.link(cam)
    # Aimed via an empty at the action center for reliable framing.
    target = bpy.data.objects.new("CamTarget", None)
    bpy.context.collection.objects.link(target)
    target.location = (0.0, -0.25, 0.45)
    cam.location = (3.4, -3.3, 2.3)
    tc = cam.constraints.new('TRACK_TO')
    tc.target = target
    tc.track_axis = 'TRACK_NEGATIVE_Z'
    tc.up_axis = 'UP_Y'
    cam_data.lens = 58
    bpy.context.scene.camera = cam

    # Soft sun for gentle flat-ish toon shading
    sun_data = bpy.data.lights.new("Sun", 'SUN')
    sun_data.energy = 3.0
    sun_data.angle = math.radians(15)
    sun = bpy.data.objects.new("Sun", sun_data)
    bpy.context.collection.objects.link(sun)
    sun.rotation_euler = (math.radians(40), math.radians(18), math.radians(30))
    return cam


def setup_world_transparent():
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_WORKBENCH'
    scene.render.film_transparent = True
    # Workbench flat/toon-ish settings
    sh = scene.display.shading
    sh.light = 'STUDIO'
    sh.studio_light = 'Default'
    sh.show_shadows = False
    sh.show_cavity = True
    sh.cavity_type = 'BOTH'
    sh.curvature_ridge_factor = 0.8
    sh.curvature_valley_factor = 1.0
    sh.show_object_outline = True
    sh.object_outline_color = (0.08, 0.08, 0.1)
    sh.color_type = 'MATERIAL'


def build_scene(pose):
    clear_scene()
    build_figure("BottomPlayer", pose['bottom'], INK)
    build_figure("TopPlayer", pose['top'], CLAY)
    setup_camera_and_light()
    setup_world_transparent()


def render_still(path, res_x=1200, res_y=900):
    scene = bpy.context.scene
    scene.render.resolution_x = res_x
    scene.render.resolution_y = res_y
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    return path


# =====================  POSES  =====================
zb = 0.14
POSE_GUARDA_FECHADA = {
    'bottom': {
        'Head':         (0.0, -1.50, zb + 0.02),
        'Neck':         (0.0, -1.28, zb + 0.03),
        'Core':         (0.0, -0.72, zb),
        'LeftShoulder': (0.24, -1.16, zb + 0.02),
        'RightShoulder': (-0.24, -1.16, zb + 0.02),
        # Bottom player's arms reach up to grip the top player's arms/sleeves.
        'LeftElbow':    (0.34, -0.86, zb + 0.16),
        'RightElbow':   (-0.34, -0.86, zb + 0.16),
        'LeftWrist':    (0.34, -0.46, 0.40),
        'RightWrist':   (-0.34, -0.46, 0.40),
        'LeftHand':     (0.38, -0.22, 0.58),
        'RightHand':    (-0.38, -0.22, 0.58),
        'LeftHip':      (0.17, -0.30, zb + 0.06),
        'RightHip':     (-0.17, -0.30, zb + 0.06),
        # Thighs rise and clamp the TOP player's sides at waist height (Y~0.3).
        'LeftKnee':     (0.40, 0.30, 0.60),
        'RightKnee':    (-0.40, 0.30, 0.60),
        # Shins pass around the waist and ANKLES CROSS behind the top's back (Y>0.45).
        'LeftAnkle':    (-0.14, 0.58, 0.66),
        'RightAnkle':   (0.14, 0.56, 0.74),
        'LeftToe':      (-0.30, 0.66, 0.60),
        'RightToe':     (0.30, 0.62, 0.70),
    },
    'top': {
        'Head':         (0.0, 0.30, 1.40),
        'Neck':         (0.0, 0.30, 1.14),
        'Core':         (0.0, 0.34, 0.74),
        'LeftShoulder': (0.28, 0.28, 1.05),
        'RightShoulder': (-0.28, 0.28, 1.05),
        # Arms post forward and down onto the mat beside the bottom player.
        'LeftElbow':    (0.40, -0.10, 0.70),
        'RightElbow':   (-0.40, -0.10, 0.70),
        'LeftWrist':    (0.42, -0.55, 0.30),
        'RightWrist':   (-0.42, -0.55, 0.30),
        'LeftHand':     (0.44, -0.78, 0.16),
        'RightHand':    (-0.44, -0.78, 0.16),
        'LeftHip':      (0.18, 0.46, 0.54),
        'RightHip':     (-0.18, 0.46, 0.54),
        'LeftKnee':     (0.19, 0.10, 0.11),
        'RightKnee':    (-0.19, 0.10, 0.11),
        'LeftAnkle':    (0.19, 0.74, 0.11),
        'RightAnkle':   (-0.19, 0.74, 0.11),
        'LeftToe':      (0.19, 0.96, 0.06),
        'RightToe':     (-0.19, 0.96, 0.06),
    },
}
