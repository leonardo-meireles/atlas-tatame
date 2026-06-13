"""
grapple_rig_anat.py  -  ANATOMICAL capsule rig for "O Mapa do Jiu-Jitsu" stills.

Upgrade of grapple_rig.py. The original figures were uniform capsule mannequins:
joints and limbs read as one smooth tube, so the ELBOWS / KNEES / WRISTS / ANKLES
(the joints and pressure points that matter in jiu-jitsu) were not legible.

This version keeps the same skeleton (named joints) and the same locked house
style (EEVEE flat emission fill + scene-wide Grease Pencil Line Art outline,
transparent background, two tones: CLAY top / INK bottom), but makes the body
ANATOMICAL enough to read joints:

  - distinct, prominent joint spheres (sockets) at neck/shoulder/elbow/wrist/
    hip/knee/ankle, larger than the limb radius so they bulge as a knuckle;
  - TAPERED limbs (cone, wide near the body, narrow toward the extremity);
  - a torso SHELL (ribcage->waist taper) and a PELVIS block volume so the
    trunk reads as a body, not a stick;
  - simple block HANDS and FEET so grips and posts read.

Usage (inside Blender, via BlenderMCP):
    exec(open('/.../stills/grapple_rig_anat.py').read())
    build_scene(POSE_GUARDA_FECHADA)
    render_still('/.../public/stills/guarda-fechada-anat.png', 1400, 1050)

Coordinate convention: +Z up, body lies/sits in the X(left-right)/Y(north-south)
plane. Bottom player's head at -Y; figures meet near origin; top player rises in
+Z around Y~0.3. (Same convention as grapple_rig.py.)
"""
import bpy, bmesh, math
from mathutils import Vector

# ---- joint sphere radii (meters). Bigger than limb r so the joint BULGES. ----
JOINT_R = {
    'Head': 0.115, 'Neck': 0.060, 'Core': 0.085, 'Pelvis': 0.090,
    'LeftShoulder': 0.075, 'RightShoulder': 0.075,
    'LeftElbow': 0.060, 'RightElbow': 0.060,
    'LeftWrist': 0.045, 'RightWrist': 0.045,
    'LeftHand': 0.0, 'RightHand': 0.0,   # hands are blocks, not spheres
    'LeftHip': 0.085, 'RightHip': 0.085,
    'LeftKnee': 0.080, 'RightKnee': 0.080,
    'LeftAnkle': 0.055, 'RightAnkle': 0.055,
    'LeftToe': 0.0, 'RightToe': 0.0,     # feet are blocks
}

# ---- limb capsules: (jointA, jointB, rA, rB).  rA = radius at A, rB at B.
# Tapered: thick near the trunk, thin toward the extremity, so the form reads
# as an arm/leg rather than a pipe.  A torso shell + pelvis are added separately.
LIMBS = [
    ('Head', 'Neck', 0.052, 0.052),
    # upper arms thick at shoulder, taper to elbow; forearms taper to wrist
    ('LeftShoulder', 'LeftElbow', 0.062, 0.046),
    ('LeftElbow', 'LeftWrist', 0.046, 0.034),
    ('RightShoulder', 'RightElbow', 0.062, 0.046),
    ('RightElbow', 'RightWrist', 0.046, 0.034),
    # thighs thick at hip taper to knee; shins taper to ankle
    ('LeftHip', 'LeftKnee', 0.095, 0.066),
    ('LeftKnee', 'LeftAnkle', 0.066, 0.044),
    ('RightHip', 'RightKnee', 0.095, 0.066),
    ('RightKnee', 'RightAnkle', 0.066, 0.044),
]

# Hands/feet drawn as oriented blocks pointing from the parent joint.
HANDS = [('LeftWrist', 'LeftHand'), ('RightWrist', 'RightHand')]
FEET = [('LeftAnkle', 'LeftToe'), ('RightAnkle', 'RightToe')]


def _orient(obj, p1, p2):
    """Orient object's local +Z along (p2-p1) and place at midpoint."""
    p1 = Vector(p1); p2 = Vector(p2)
    axis = p2 - p1
    obj.location = (p1 + p2) * 0.5
    q = Vector((0, 0, 1)).rotation_difference(axis.normalized())
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = q
    return obj


def _make_tapered(p1, p2, r1, r2, segments=16):
    p1 = Vector(p1); p2 = Vector(p2)
    length = max((p2 - p1).length, 1e-5)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segments,
                          radius1=r1, radius2=r2, depth=length)
    me = bpy.data.meshes.new("limb"); bm.to_mesh(me); bm.free()
    obj = bpy.data.objects.new("limb", me)
    bpy.context.collection.objects.link(obj)
    return _orient(obj, p1, p2)


def _make_sphere(p, r, squash=1.0):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=14, radius=r)
    me = bpy.data.meshes.new("joint"); bm.to_mesh(me); bm.free()
    obj = bpy.data.objects.new("joint", me)
    bpy.context.collection.objects.link(obj)
    obj.location = Vector(p)
    obj.scale = (1, 1, squash)
    return obj


def _make_box(p1, p2, w, h):
    """A flattened block from p1 toward p2, used for hands and feet."""
    p1 = Vector(p1); p2 = Vector(p2)
    length = max((p2 - p1).length, 1e-5)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(w, h, length), verts=bm.verts)
    me = bpy.data.meshes.new("block"); bm.to_mesh(me); bm.free()
    obj = bpy.data.objects.new("block", me)
    bpy.context.collection.objects.link(obj)
    return _orient(obj, p1, p2)


def _make_torso(neck, core, lsh, rsh, lhip, rhip, pelvis):
    """A trunk volume: ribcage (shoulders->core) + belly/pelvis (core->pelvis).
    Built as two stacked tapered tubes so the chest is broad and the waist nips
    in, then the pelvis flares. Reads as a torso, not a stick."""
    neck = Vector(neck); core = Vector(core); pelvis = Vector(pelvis)
    sh_mid = (Vector(lsh) + Vector(rsh)) * 0.5
    hip_mid = (Vector(lhip) + Vector(rhip)) * 0.5
    # clamp trunk widths so the chest reads as a ribcage, not a flat cape
    sh_w = min((Vector(lsh) - Vector(rsh)).length * 0.5, 0.16)
    hip_w = min((Vector(lhip) - Vector(rhip)).length * 0.5 + 0.02, 0.13)
    parts = []
    # chest: ribcage, moderately broad at shoulders, nips in at core (waist)
    parts.append(_make_tapered(sh_mid, core, max(sh_w, 0.115), 0.085))
    # belly/pelvis: narrow at waist, flares to hips
    parts.append(_make_tapered(core, hip_mid, 0.085, max(hip_w, 0.10)))
    # shoulder yoke (collarbone bar) so shoulders connect across the chest
    parts.append(_make_tapered(lsh, rsh, 0.052, 0.052))
    return parts


def _darken(color, f=0.62):
    return tuple(c * f for c in color)


def _make_material(name, color, halftone=True, dot_scale=190.0):
    """House-style fill (locked): flat emission, no shading realism — the GP line
    art supplies all linework. A screen-space HALFTONE dot pattern is mixed into
    the tone (silkscreen/atlas-plate look) for the C-lineart-halftone style.

    Halftone is built in screen space (Window coords) so the dots stay a constant
    size on the plate regardless of depth, like a printed screen. Set
    halftone=False for a pure flat fill."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    emi = nt.nodes.new("ShaderNodeEmission")
    emi.inputs['Strength'].default_value = 1.0

    if halftone:
        # screen-space coords -> two sine waves -> product -> dot lattice
        texco = nt.nodes.new("ShaderNodeTexCoord")
        sep = nt.nodes.new("ShaderNodeSeparateXYZ")
        nt.links.new(texco.outputs['Window'], sep.inputs['Vector'])

        def wave(in_socket):
            w = nt.nodes.new("ShaderNodeMath"); w.operation = 'MULTIPLY'
            w.inputs[1].default_value = dot_scale
            nt.links.new(in_socket, w.inputs[0])
            s = nt.nodes.new("ShaderNodeMath"); s.operation = 'SINE'
            nt.links.new(w.outputs[0], s.inputs[0])
            return s.outputs[0]

        wx = wave(sep.outputs['X'])
        wy = wave(sep.outputs['Y'])
        mul = nt.nodes.new("ShaderNodeMath"); mul.operation = 'MULTIPLY'
        nt.links.new(wx, mul.inputs[0]); nt.links.new(wy, mul.inputs[1])
        # threshold -> crisp dots
        gt = nt.nodes.new("ShaderNodeMath"); gt.operation = 'GREATER_THAN'
        gt.inputs[1].default_value = 0.25
        nt.links.new(mul.outputs[0], gt.inputs[0])
        # mix base tone (dots) with a darker tone (gaps) for the screen texture
        mix = nt.nodes.new("ShaderNodeMixRGB")
        mix.inputs['Color1'].default_value = (*_darken(color), 1.0)  # gap
        mix.inputs['Color2'].default_value = (*color, 1.0)           # dot
        nt.links.new(gt.outputs[0], mix.inputs['Fac'])
        nt.links.new(mix.outputs['Color'], emi.inputs['Color'])
    else:
        emi.inputs['Color'].default_value = (*color, 1.0)

    nt.links.new(emi.outputs['Emission'], out.inputs['Surface'])
    mat.diffuse_color = (*color, 1.0)
    return mat


def build_figure(name, joints, color, dot_scale=190.0):
    parts = []
    # joint spheres (sockets) -- skip zero-radius (hands/feet handled as blocks)
    for jn, p in joints.items():
        r = JOINT_R.get(jn, 0.05)
        if r <= 0.0:
            continue
        # slightly squash the head so it's not a perfect ball
        parts.append(_make_sphere(p, r, squash=0.92 if jn == 'Head' else 1.0))
    # tapered limbs
    for a, b, r1, r2 in LIMBS:
        if a in joints and b in joints:
            parts.append(_make_tapered(joints[a], joints[b], r1, r2))
    # torso shell + pelvis
    if all(k in joints for k in ('Neck', 'Core', 'LeftShoulder', 'RightShoulder',
                                 'LeftHip', 'RightHip', 'Pelvis')):
        parts += _make_torso(joints['Neck'], joints['Core'],
                             joints['LeftShoulder'], joints['RightShoulder'],
                             joints['LeftHip'], joints['RightHip'], joints['Pelvis'])
    # hands as flattened blocks pointing from wrist toward hand target
    for w, h in HANDS:
        if w in joints and h in joints:
            parts.append(_make_box(joints[w], joints[h], 0.075, 0.045))
    # feet as flattened blocks
    for a, t in FEET:
        if a in joints and t in joints:
            parts.append(_make_box(joints[a], joints[t], 0.06, 0.05))

    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:
        o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    fig = bpy.context.active_object
    fig.name = name
    bpy.ops.object.shade_smooth()
    fig.data.materials.append(_make_material(name + "_mat", color, dot_scale=dot_scale))
    return fig


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for c in (bpy.data.meshes, bpy.data.materials, bpy.data.lights,
              bpy.data.cameras, bpy.data.grease_pencils_v3
              if hasattr(bpy.data, 'grease_pencils_v3') else bpy.data.grease_pencils):
        for b in list(c):
            try:
                c.remove(b)
            except Exception:
                pass


# ---- two distinct house tones ----
INK = (0.11, 0.12, 0.15)     # dark ink   -> BOTTOM player (on his back)
CLAY = (0.80, 0.47, 0.34)    # terracotta -> TOP player (kneeling, in the guard)


def setup_camera_and_light():
    """Reuse the framing that reads well: high 3/4 lower-lateral so the leg wrap
    and the depth (lying vs kneeling) read. Matches the live reference scene."""
    cam_data = bpy.data.cameras.new("Cam")
    cam = bpy.data.objects.new("Cam", cam_data)
    bpy.context.collection.objects.link(cam)
    target = bpy.data.objects.new("CamTarget", None)
    bpy.context.collection.objects.link(target)
    target.location = (0.0, -0.30, 0.55)
    cam.location = (4.6, -2.8, 1.85)
    tc = cam.constraints.new('TRACK_TO')
    tc.target = target
    tc.track_axis = 'TRACK_NEGATIVE_Z'
    tc.up_axis = 'UP_Y'
    cam_data.lens = 68
    bpy.context.scene.camera = cam
    return cam


def setup_lineart():
    """Scene-wide Grease Pencil Line Art -> black outline, the house silkscreen
    look. One GP object, one Line Art modifier sourcing the whole scene."""
    bpy.ops.object.grease_pencil_add(type='EMPTY')
    gp = bpy.context.active_object
    gp.name = "LineArt"
    # black GP material (stroke only)
    mat = bpy.data.materials.new("Black")
    bpy.data.materials.create_gpencil_data(mat)
    mat.grease_pencil.color = (0.05, 0.05, 0.07, 1.0)
    mat.grease_pencil.show_stroke = True
    mat.grease_pencil.show_fill = False
    gp.data.materials.append(mat)
    # ensure a target layer
    if not gp.data.layers:
        gp.data.layers.new("Layer")
    m = None
    for mtype in ('GREASE_PENCIL_LINEART', 'LINEART'):
        try:
            m = gp.modifiers.new("Lineart", mtype)
            break
        except (TypeError, RuntimeError):
            continue
    m.source_type = 'SCENE'
    try:
        m.target_layer = gp.data.layers[0].name
    except (TypeError, RuntimeError):
        m.target_layer = gp.data.layers[0]
    m.target_material = mat
    # interior linework: contour silhouettes + crease edges define the joints
    for attr, val in (('use_contour', True), ('use_crease', True),
                      ('use_intersection', True), ('crease_threshold', 0.5)):
        if hasattr(m, attr):
            setattr(m, attr, val)
    # thickness: this Blender's Line Art modifier has no thickness; use a
    # Grease Pencil Thickness modifier after it to get the bold silkscreen line.
    try:
        m.thickness = 6  # older API
    except Exception:
        pass
    tm = None
    for mtype in ('GREASE_PENCIL_THICKNESS', 'GP_THICK'):
        try:
            tm = gp.modifiers.new("Thick", mtype)
            break
        except (TypeError, RuntimeError):
            continue
    if tm is not None and hasattr(tm, 'thickness_factor'):
        tm.use_uniform_thickness = True
        tm.thickness_factor = 3.0
    return gp


def setup_world_transparent():
    scene = bpy.context.scene
    for eng in ('BLENDER_EEVEE_NEXT', 'BLENDER_EEVEE'):
        try:
            scene.render.engine = eng
            break
        except (TypeError, RuntimeError):
            continue
    scene.render.film_transparent = True
    # flat world so emission fills stay pure
    if scene.world is None:
        scene.world = bpy.data.worlds.new("World")
    scene.world.use_nodes = True


def build_scene(pose):
    clear_scene()
    # different dot scales so the two screens read as distinct fabrics
    build_figure("BottomPlayer", pose['bottom'], INK, dot_scale=150.0)
    build_figure("TopPlayer", pose['top'], CLAY, dot_scale=210.0)
    setup_camera_and_light()
    setup_world_transparent()
    setup_lineart()


def render_still(path, res_x=1400, res_y=1050):
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
# Closed guard (guarda fechada): bottom on back, legs wrap top player's waist,
# ankles cross behind his back; bottom grips top's arms. Coords reuse the
# capsule reference pose framing, with Pelvis added and joints kept plausible.
zb = 0.14
POSE_GUARDA_FECHADA = {
    'bottom': {
        'Head':         (0.0, -1.52, zb + 0.03),
        'Neck':         (0.0, -1.30, zb + 0.04),
        'Core':         (0.0, -0.92, zb + 0.02),
        'Pelvis':       (0.0, -0.40, zb + 0.05),
        'LeftShoulder': (0.26, -1.18, zb + 0.03),
        'RightShoulder': (-0.26, -1.18, zb + 0.03),
        # arms reach up to grip top player's sleeves/arms
        'LeftElbow':    (0.36, -0.86, zb + 0.18),
        'RightElbow':   (-0.36, -0.86, zb + 0.18),
        'LeftWrist':    (0.34, -0.48, 0.42),
        'RightWrist':   (-0.34, -0.48, 0.42),
        'LeftHand':     (0.34, -0.30, 0.56),
        'RightHand':    (-0.34, -0.30, 0.56),
        'LeftHip':      (0.17, -0.30, zb + 0.08),
        'RightHip':     (-0.17, -0.30, zb + 0.08),
        # thighs clamp the top player's sides at waist height
        'LeftKnee':     (0.44, 0.34, 0.66),
        'RightKnee':    (-0.44, 0.34, 0.66),
        # shins wrap; ankles CROSS behind top's back (Y>0.55, near center X)
        'LeftAnkle':    (-0.10, 0.66, 0.70),
        'RightAnkle':   (0.10, 0.62, 0.80),
        'LeftToe':      (-0.26, 0.78, 0.66),
        'RightToe':     (0.28, 0.72, 0.78),
    },
    'top': {
        'Head':         (0.0, 0.30, 1.42),
        'Neck':         (0.0, 0.30, 1.16),
        'Core':         (0.0, 0.33, 0.86),
        'Pelvis':       (0.0, 0.40, 0.56),
        'LeftShoulder': (0.30, 0.28, 1.07),
        'RightShoulder': (-0.30, 0.28, 1.07),
        # arms post forward/down onto the mat beside the bottom player
        'LeftElbow':    (0.42, -0.10, 0.72),
        'RightElbow':   (-0.42, -0.10, 0.72),
        'LeftWrist':    (0.44, -0.55, 0.32),
        'RightWrist':   (-0.44, -0.55, 0.32),
        'LeftHand':     (0.45, -0.76, 0.16),
        'RightHand':    (-0.45, -0.76, 0.16),
        'LeftHip':      (0.18, 0.48, 0.52),
        'RightHip':     (-0.18, 0.48, 0.52),
        'LeftKnee':     (0.20, 0.12, 0.11),
        'RightKnee':    (-0.20, 0.12, 0.11),
        'LeftAnkle':    (0.20, 0.76, 0.11),
        'RightAnkle':   (-0.20, 0.76, 0.11),
        'LeftToe':      (0.20, 0.98, 0.06),
        'RightToe':     (-0.20, 0.98, 0.06),
    },
}
