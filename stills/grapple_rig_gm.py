"""
grapple_rig_gm.py  -  DATA-DRIVEN capsule-humanoid rig for "O Mapa do Jiu-Jitsu".

Unlike grapple_rig.py / grapple_rig_anat.py (hand-posed), this rig is fed REAL
GrappleMap joint coordinates (23 joints x 2 players) extracted by the parser at
src/lib/grapplemap/parser.ts. Poses are NOT authored here — they are pasted from
the parser output (see .scratch/figuras-grapplemap-pipeline/extracted.txt).

Coordinate mapping (done in the extractor): GrappleMap is x/z ground-plane with
y up. The extractor already emits Blender coords as (x, z, y) so here +Z is up
and the body lies/sits in the X(left-right)/Y(north-south) plane — same as the
other rigs, so the camera intuition carries over.

Style = locked house "C" (two-tone clay/ink, line-art outline) but tuned for
LEGIBILITY over decoration: thin clean black outline, strong two-tone fills,
OPTIONAL light halftone. The muddy hand-posed anat plate failed because a heavy
outline + coarse halftone fused the two interlocked bodies; here we keep the
fills flat and high-contrast and let a per-pose camera separate the bodies.

Usage (inside Blender via BlenderMCP):
    exec(open('/.../stills/grapple_rig_gm.py').read())
    build_scene(POSE_GUARDA_FECHADA, top='p1')   # which player is the TOP (clay)
    set_camera(*CAM_GUARDA)
    render_still('/.../public/stills/guarda-fechada-v2.png', 1200, 900)
"""
import bpy, bmesh, math
from mathutils import Vector

# ---- joint sphere radii (meters), full GrappleMap 23-joint set ----
JOINT_R = {
    'Head': 0.105, 'Neck': 0.055, 'Core': 0.115,
    'LeftShoulder': 0.07, 'RightShoulder': 0.07,
    'LeftElbow': 0.052, 'RightElbow': 0.052,
    'LeftWrist': 0.042, 'RightWrist': 0.042,
    'LeftHand': 0.05, 'RightHand': 0.05,
    'LeftFingers': 0.035, 'RightFingers': 0.035,
    'LeftHip': 0.085, 'RightHip': 0.085,
    'LeftKnee': 0.08, 'RightKnee': 0.08,
    'LeftAnkle': 0.058, 'RightAnkle': 0.058,
    'LeftHeel': 0.045, 'RightHeel': 0.045,
    'LeftToe': 0.04, 'RightToe': 0.04,
}

# ---- limb capsules: (jointA, jointB, radius). Faithful to GrappleMap limbs() ----
LIMBS = [
    ('Head', 'Neck', 0.05),
    ('Neck', 'Core', 0.085),
    ('Neck', 'LeftShoulder', 0.055), ('Neck', 'RightShoulder', 0.055),
    ('LeftShoulder', 'LeftElbow', 0.052), ('LeftElbow', 'LeftWrist', 0.04),
    ('LeftWrist', 'LeftHand', 0.038), ('LeftHand', 'LeftFingers', 0.03),
    ('RightShoulder', 'RightElbow', 0.052), ('RightElbow', 'RightWrist', 0.04),
    ('RightWrist', 'RightHand', 0.038), ('RightHand', 'RightFingers', 0.03),
    ('Core', 'LeftHip', 0.085), ('Core', 'RightHip', 0.085),
    ('LeftHip', 'RightHip', 0.09),
    ('LeftShoulder', 'RightShoulder', 0.06),
    ('LeftHip', 'LeftKnee', 0.085), ('LeftKnee', 'LeftAnkle', 0.062),
    ('LeftAnkle', 'LeftHeel', 0.045), ('LeftAnkle', 'LeftToe', 0.045),
    ('RightHip', 'RightKnee', 0.085), ('RightKnee', 'RightAnkle', 0.062),
    ('RightAnkle', 'RightHeel', 0.045), ('RightAnkle', 'RightToe', 0.045),
]


# Qualidade de malha por tipo de segmento.
# Cabeça e tronco precisam de mais segmentos pra silhueta limpa;
# dedos e tornozelos podem ser mais simples sem custo visual.
_CAPSULE_SEGS_HIGH = 16   # tronco, coxa
_CAPSULE_SEGS_MED  = 12   # braço, perna inferior
_CAPSULE_SEGS_LOW  = 8    # mãos, dedos, toes, tornozelo

# Mapeamento limb → nível de qualidade.
_LIMB_QUALITY = {
    # tronco e coxa = alta
    ('Neck', 'Core'): _CAPSULE_SEGS_HIGH,
    ('Core', 'LeftHip'): _CAPSULE_SEGS_HIGH,
    ('Core', 'RightHip'): _CAPSULE_SEGS_HIGH,
    ('LeftHip', 'RightHip'): _CAPSULE_SEGS_HIGH,
    ('LeftShoulder', 'RightShoulder'): _CAPSULE_SEGS_HIGH,
    ('LeftHip', 'LeftKnee'): _CAPSULE_SEGS_HIGH,
    ('RightHip', 'RightKnee'): _CAPSULE_SEGS_HIGH,
    # braço e perna inferior = médio
    ('LeftShoulder', 'LeftElbow'): _CAPSULE_SEGS_MED,
    ('RightShoulder', 'RightElbow'): _CAPSULE_SEGS_MED,
    ('LeftElbow', 'LeftWrist'): _CAPSULE_SEGS_MED,
    ('RightElbow', 'RightWrist'): _CAPSULE_SEGS_MED,
    ('LeftKnee', 'LeftAnkle'): _CAPSULE_SEGS_MED,
    ('RightKnee', 'RightAnkle'): _CAPSULE_SEGS_MED,
    ('Neck', 'LeftShoulder'): _CAPSULE_SEGS_MED,
    ('Neck', 'RightShoulder'): _CAPSULE_SEGS_MED,
}

def _capsule_segs(a, b):
    """Retorna o nº de segmentos adequado pra cada limb (alta/média/baixa qualidade)."""
    return _LIMB_QUALITY.get((a, b), _CAPSULE_SEGS_LOW)


def _make_capsule(p1, p2, r, segments=None, joint_a=None, joint_b=None):
    """Cápsula entre dois pontos. Se joint_a/joint_b forem dados, escolhe qualidade automaticamente."""
    if segments is None:
        segments = _capsule_segs(joint_a, joint_b) if (joint_a and joint_b) else _CAPSULE_SEGS_MED
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
    if axis.length > 1e-6:
        q = z.rotation_difference(axis.normalized())
        obj.rotation_mode = 'QUATERNION'
        obj.rotation_quaternion = q
    return obj


def _make_sphere(p, r, quality='high'):
    """Esfera de junta. quality='high' pra cabeça/core, 'low' pra dedos/toes."""
    if quality == 'high':
        u, v = 24, 16
    elif quality == 'med':
        u, v = 16, 12
    else:
        u, v = 10, 8
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=u, v_segments=v, radius=r)
    me = bpy.data.meshes.new("joint")
    bm.to_mesh(me); bm.free()
    obj = bpy.data.objects.new("joint", me)
    bpy.context.collection.objects.link(obj)
    obj.location = Vector(p)
    return obj


# Qualidade de esfera por junta: cabeça e core = alta, extremidades = baixa.
_JOINT_QUALITY = {
    'Head': 'high', 'Neck': 'high', 'Core': 'high',
    'LeftShoulder': 'med', 'RightShoulder': 'med',
    'LeftHip': 'med', 'RightHip': 'med',
    'LeftKnee': 'med', 'RightKnee': 'med',
    'LeftElbow': 'med', 'RightElbow': 'med',
}


def _make_material(name, color, halftone=False, dot_scale=170.0, dot_angle=0.0):
    """Flat emission fill. Optional light screen-space halftone baked in-shader.

    dot_angle (radianos) roda a grelha de pontos para que os dois jogadores
    fiquem em ângulos diferentes — facilita distingui-los em tamanhos pequenos
    mesmo quando as cores se sobrepõem na silhueta.
    Jogador INK usa ângulo 0° (horizontal), CLAY usa ~25° por padrão.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    emis = nt.nodes.new("ShaderNodeEmission")
    emis.inputs['Strength'].default_value = 1.0
    # Tom de gap: mais escuro que a cor base, mas não preto — evita confundir com o outline.
    dark = tuple(c * 0.65 for c in color)

    if halftone:
        # Coordenadas de janela (screen-space) → rotação → grade de dots
        tex = nt.nodes.new("ShaderNodeTexCoord")
        sep = nt.nodes.new("ShaderNodeSeparateXYZ")
        nt.links.new(tex.outputs['Window'], sep.inputs['Vector'])

        # Rotação da grelha por dot_angle (sin/cos pra x e y separados)
        cos_a = math.cos(dot_angle)
        sin_a = math.sin(dot_angle)

        # x_rot = x*cos - y*sin,  y_rot = x*sin + y*cos
        mx = nt.nodes.new("ShaderNodeMath"); mx.operation = 'MULTIPLY'; mx.inputs[1].default_value = cos_a
        my = nt.nodes.new("ShaderNodeMath"); my.operation = 'MULTIPLY'; my.inputs[1].default_value = sin_a
        nt.links.new(sep.outputs['X'], mx.inputs[0])
        nt.links.new(sep.outputs['X'], my.inputs[0])

        mx2 = nt.nodes.new("ShaderNodeMath"); mx2.operation = 'MULTIPLY'; mx2.inputs[1].default_value = sin_a
        my2 = nt.nodes.new("ShaderNodeMath"); my2.operation = 'MULTIPLY'; my2.inputs[1].default_value = cos_a
        nt.links.new(sep.outputs['Y'], mx2.inputs[0])
        nt.links.new(sep.outputs['Y'], my2.inputs[0])

        sub_x = nt.nodes.new("ShaderNodeMath"); sub_x.operation = 'SUBTRACT'
        nt.links.new(mx.outputs[0], sub_x.inputs[0])
        nt.links.new(mx2.outputs[0], sub_x.inputs[1])

        add_y = nt.nodes.new("ShaderNodeMath"); add_y.operation = 'ADD'
        nt.links.new(my.outputs[0], add_y.inputs[0])
        nt.links.new(my2.outputs[0], add_y.inputs[1])

        sx = nt.nodes.new("ShaderNodeMath"); sx.operation = 'MULTIPLY'; sx.inputs[1].default_value = dot_scale
        sy = nt.nodes.new("ShaderNodeMath"); sy.operation = 'MULTIPLY'; sy.inputs[1].default_value = dot_scale
        nt.links.new(sub_x.outputs[0], sx.inputs[0])
        nt.links.new(add_y.outputs[0], sy.inputs[0])

        sinx = nt.nodes.new("ShaderNodeMath"); sinx.operation = 'SINE'
        siny = nt.nodes.new("ShaderNodeMath"); siny.operation = 'SINE'
        nt.links.new(sx.outputs[0], sinx.inputs[0])
        nt.links.new(sy.outputs[0], siny.inputs[0])

        prod = nt.nodes.new("ShaderNodeMath"); prod.operation = 'MULTIPLY'
        nt.links.new(sinx.outputs[0], prod.inputs[0])
        nt.links.new(siny.outputs[0], prod.inputs[1])

        thr = nt.nodes.new("ShaderNodeMath"); thr.operation = 'GREATER_THAN'
        thr.inputs[1].default_value = 0.30  # limiar um pouco mais baixo → pontos maiores → mais visíveis em thumbnails
        nt.links.new(prod.outputs[0], thr.inputs[0])

        mix = nt.nodes.new("ShaderNodeMixRGB")
        mix.inputs['Color1'].default_value = (*dark, 1)
        mix.inputs['Color2'].default_value = (*color, 1)
        nt.links.new(thr.outputs[0], mix.inputs['Fac'])
        nt.links.new(mix.outputs['Color'], emis.inputs['Color'])
    else:
        emis.inputs['Color'].default_value = (*color, 1)

    nt.links.new(emis.outputs['Emission'], out.inputs['Surface'])
    mat.diffuse_color = (*color, 1.0)
    return mat


def build_figure(name, joints, color, halftone=False, dot_scale=170.0, dot_angle=0.0):
    """Monta o boneco a partir dos joints do GrappleMap.

    dot_angle rotaciona a grelha de halftone pra diferenciar os dois jogadores
    mesmo quando as cores têm contraste reduzido em thumbnails pequenos.
    """
    parts = []
    for jn, p in joints.items():
        quality = _JOINT_QUALITY.get(jn, 'low')
        parts.append(_make_sphere(p, JOINT_R.get(jn, 0.05), quality=quality))
    for a, b, r in LIMBS:
        if a in joints and b in joints:
            parts.append(_make_capsule(joints[a], joints[b], r, joint_a=a, joint_b=b))
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts:
        o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    fig = bpy.context.active_object
    fig.name = name
    bpy.ops.object.shade_smooth()
    fig.data.materials.append(_make_material(name + "_mat", color, halftone, dot_scale, dot_angle))
    return fig


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for c in (bpy.data.meshes, bpy.data.materials, bpy.data.lights,
              bpy.data.cameras, bpy.data.grease_pencils_v3 if hasattr(bpy.data, 'grease_pencils_v3') else []):
        for b in list(c):
            try: c.remove(b)
            except Exception: pass


# ---- two distinct tones (locked house style) ----
# Higher contrast than the anat attempt: clay is brighter/warmer, ink is near-black.
INK = (0.10, 0.11, 0.14)     # near-black blue ink = BOTTOM player
CLAY = (0.82, 0.45, 0.30)    # warm terracotta = TOP player


def setup_camera_and_light(cam_loc, target_loc, lens=62):
    cam_data = bpy.data.cameras.new("Cam")
    cam = bpy.data.objects.new("Cam", cam_data)
    bpy.context.collection.objects.link(cam)
    target = bpy.data.objects.new("CamTarget", None)
    bpy.context.collection.objects.link(target)
    target.location = target_loc
    cam.location = cam_loc
    tc = cam.constraints.new('TRACK_TO')
    tc.target = target
    tc.track_axis = 'TRACK_NEGATIVE_Z'
    tc.up_axis = 'UP_Y'
    cam_data.lens = lens
    bpy.context.scene.camera = cam
    return cam


def setup_lineart(thickness=2.2, crease_deg=75, use_intersection=False,
                  intersection_thickness=0.6, intersection_opacity=0.5):
    """Scene-wide Grease Pencil Line Art: thin, clean black contour + crease.

    Parâmetros de legibilidade:
    - thickness: espessura do outline de contorno (2.2 = limpo sem parecer pesado).
    - crease_deg: ângulo mínimo de dobra que produz uma crease-line interna.
      75° = só dobras nítidas → menos poluição interna, silhueta dominante.
    - use_intersection + intersection_thickness/opacity: quando dois corpos se
      interpenetram (limbs entrelaçados), uma linha de interseção FINA E SEMITRANSPARENTE
      ajuda o olho a separar qual limb está na frente sem o peso do outline principal.
      Padrão OFF pra máxima clareza; ativar se poses enroscadas ficarem ilegíveis.
    """
    bpy.ops.object.grease_pencil_add(type='EMPTY')
    gp = bpy.context.active_object
    gp.name = "LineArt"

    # Material de contorno: preto sólido
    gmat = bpy.data.materials.new("GP_Black")
    bpy.data.materials.create_gpencil_data(gmat)
    gmat.grease_pencil.color = (0, 0, 0, 1)
    gmat.grease_pencil.show_fill = False
    gmat.grease_pencil.show_stroke = True
    gp.data.materials.append(gmat)

    # ensure a layer exists to target
    if len(gp.data.layers) == 0:
        gp.data.layers.new("Lines")
    layer_name = gp.data.layers[0].name

    m = gp.modifiers.new("LineArt", 'LINEART')
    m.source_type = 'SCENE'
    m.use_contour = True
    m.use_crease = True
    m.use_intersection = False  # contorno + crease apenas (sem linhas de intersecção no main pass)
    m.use_material = False
    if hasattr(m, 'crease_threshold'):
        m.crease_threshold = math.radians(crease_deg)
    m.target_material = gmat
    m.target_layer = layer_name

    tm = gp.modifiers.new("Thick", 'GREASE_PENCIL_THICKNESS')
    tm.use_uniform_thickness = True
    tm.thickness_factor = thickness

    # Segundo pass de intersecção: linha muito mais fina e semitransparente,
    # só se pedido. Ajuda a ler limbs entrelaçados sem poluir a silhueta.
    if use_intersection:
        gmat_isect = bpy.data.materials.new("GP_Isect")
        bpy.data.materials.create_gpencil_data(gmat_isect)
        gmat_isect.grease_pencil.color = (0, 0, 0, intersection_opacity)
        gmat_isect.grease_pencil.show_fill = False
        gmat_isect.grease_pencil.show_stroke = True
        gp.data.materials.append(gmat_isect)

        layer_isect = gp.data.layers.new("Intersection")
        m2 = gp.modifiers.new("LineArtIsect", 'LINEART')
        m2.source_type = 'SCENE'
        m2.use_contour = False
        m2.use_crease = False
        m2.use_intersection = True
        m2.use_material = False
        m2.target_material = gmat_isect
        m2.target_layer = layer_isect.name

        tm2 = gp.modifiers.new("ThickIsect", 'GREASE_PENCIL_THICKNESS')
        tm2.use_uniform_thickness = True
        tm2.thickness_factor = intersection_thickness

    return gp


def setup_world_transparent():
    scene = bpy.context.scene
    try:
        scene.render.engine = 'BLENDER_EEVEE_NEXT'
    except Exception:
        scene.render.engine = 'BLENDER_EEVEE'
    scene.render.film_transparent = True
    if hasattr(scene, 'view_settings'):
        scene.view_settings.view_transform = 'Standard'  # no filmic desat -> punchy flat tones


def build_scene(pose, top='p1', halftone=False):
    """top = which player key ('p0'/'p1') is the TOP fighter (clay).
    The other is the BOTTOM (ink).

    Diferenciação visual aprimorada:
    - INK (bottom): dot_scale=150, dot_angle=0° (grelha horizontal)
    - CLAY (top):   dot_scale=190, dot_angle=25° (grelha inclinada)
    Mesmo em thumbnails de 200×150 px os dois jogadores ficam distinguíveis
    pela direção dos pontos, não só pela cor.
    """
    clear_scene()
    bot = 'p0' if top == 'p1' else 'p1'
    # Ângulo ~25° (0.436 rad) diferencia a textura de halftone do CLAY sem parecer aleatório.
    build_figure("BottomPlayer", pose[bot], INK,  halftone, dot_scale=150.0, dot_angle=0.0)
    build_figure("TopPlayer",   pose[top], CLAY, halftone, dot_scale=190.0, dot_angle=math.radians(25))
    setup_world_transparent()


def set_camera(cam_loc, target_loc, lens=62):
    setup_camera_and_light(cam_loc, target_loc, lens)


def add_lineart(thickness=2.2, crease_deg=75, use_intersection=False):
    setup_lineart(thickness, crease_deg, use_intersection)


def render_still(path, res_x=1200, res_y=900, supersample=2):
    """Renderiza o still e salva em path.

    supersample=2: renderiza em 2× a resolução e deixa o Blender fazer o
    downscale automático via Percentage — produz anti-aliasing muito mais limpo
    nas bordas do line-art sem custo extra de shading. O PNG final sai em
    res_x × res_y mas com suavidade de render 2× maior.

    Para debug rápido (preview sem AA fino): supersample=1.
    Para produção máxima: supersample=2 (padrão).
    """
    scene = bpy.context.scene
    ss = max(1, int(supersample))
    scene.render.resolution_x = res_x * ss
    scene.render.resolution_y = res_y * ss
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    # PNG compression 9 (máximo) — sem perda, mas menor em disco.
    scene.render.image_settings.compression = 9
    scene.render.filepath = path

    bpy.ops.render.render(write_still=True)

    if ss > 1:
        # Downscale pós-render (sem compositor — Blender 5.1 não tem scene.node_tree):
        # renderiza em 2× e reduz a imagem salva → anti-aliasing limpo no line-art.
        img = bpy.data.images.load(path)
        img.scale(res_x, res_y)
        img.filepath_raw = path
        img.file_format = 'PNG'
        img.save()
        bpy.data.images.remove(img)
    return path
