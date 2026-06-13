"""
grapple_poses_gm.py  -  REAL GrappleMap pose data, extracted by the parser.

These are NOT hand-authored. Each dict is the verbatim output of the parser
(src/lib/grapplemap/parser.ts) for a chosen GrappleMap position, with GM y-up
coords already remapped to Blender (x, z, y) by the extractor. Re-extract with
.scratch/figuras-grapplemap-pipeline/extract.test.ts to refresh / add positions.

Each pose: {'p0': {joint: (x,y,z)}, 'p1': {...}}. p0 = GrappleMap player0 (red),
p1 = player1 (blue). Which player is TOP/BOTTOM is decided at build time.
"""

# id=265 "distance closed guard" — p0 supine (bottom), p1 kneeling/postured (top)
POSE_GUARDA_FECHADA = {
    'p0': {
        'LeftToe': (-0.445, -0.418, 0.025), 'RightToe': (-0.596, -0.091, 0.025),
        'LeftHeel': (-0.260, -0.347, 0.144), 'RightHeel': (-0.429, -0.028, 0.168),
        'LeftAnkle': (-0.278, -0.366, 0.060), 'RightAnkle': (-0.468, 0.011, 0.095),
        'LeftKnee': (0.138, -0.267, 0.068), 'RightKnee': (-0.136, 0.280, 0.052),
        'LeftHip': (-0.252, -0.243, 0.254), 'RightHip': (-0.351, -0.034, 0.248),
        'LeftShoulder': (0.148, -0.125, 0.546), 'RightShoulder': (0.007, 0.189, 0.546),
        'LeftElbow': (0.195, -0.138, 0.259), 'RightElbow': (-0.011, 0.245, 0.260),
        'LeftWrist': (0.304, 0.098, 0.219), 'RightWrist': (0.255, 0.199, 0.223),
        'LeftHand': (0.341, 0.141, 0.277), 'RightHand': (0.311, 0.238, 0.266),
        'LeftFingers': (0.391, 0.202, 0.254), 'RightFingers': (0.379, 0.259, 0.228),
        'Core': (-0.215, -0.094, 0.477), 'Neck': (0.093, 0.040, 0.583),
        'Head': (0.208, 0.094, 0.691),
    },
    'p1': {
        'LeftToe': (-0.587, -0.441, 0.414), 'RightToe': (-0.710, -0.310, 0.546),
        'LeftHeel': (-0.416, -0.340, 0.295), 'RightHeel': (-0.586, -0.211, 0.382),
        'LeftAnkle': (-0.458, -0.327, 0.371), 'RightAnkle': (-0.561, -0.257, 0.457),
        'LeftKnee': (-0.374, 0.090, 0.417), 'RightKnee': (-0.134, -0.307, 0.412),
        'LeftHip': (-0.013, 0.124, 0.183), 'RightHip': (0.094, -0.074, 0.129),
        'LeftShoulder': (0.460, 0.440, 0.156), 'RightShoulder': (0.612, 0.139, 0.145),
        'LeftElbow': (0.214, 0.542, 0.045), 'RightElbow': (0.552, -0.132, 0.054),
        'LeftWrist': (0.057, 0.345, 0.105), 'RightWrist': (0.299, -0.041, 0.062),
        'LeftHand': (0.052, 0.343, 0.187), 'RightHand': (0.319, -0.063, 0.137),
        'LeftFingers': (0.074, 0.278, 0.225), 'RightFingers': (0.268, -0.060, 0.196),
        'Core': (0.246, 0.146, 0.102), 'Neck': (0.578, 0.311, 0.172),
        'Head': (0.684, 0.358, 0.287),
    },
}

# id=150 "mount" — p0 mounted on top (kneeling astride), p1 supine (bottom)
POSE_MONTADA = {
    'p0': {
        'LeftToe': (0.030, -0.631, 0.040), 'RightToe': (-0.112, -0.651, 0.040),
        'LeftHeel': (-0.009, -0.503, 0.229), 'RightHeel': (-0.073, -0.510, 0.221),
        'LeftAnkle': (0.062, -0.508, 0.171), 'RightAnkle': (-0.142, -0.523, 0.164),
        'LeftKnee': (0.348, -0.206, 0.056), 'RightKnee': (-0.450, -0.241, 0.050),
        'LeftHip': (0.053, -0.040, 0.317), 'RightHip': (-0.174, -0.048, 0.314),
        'LeftShoulder': (0.112, 0.513, 0.375), 'RightShoulder': (-0.220, 0.535, 0.369),
        'LeftElbow': (0.334, 0.611, 0.216), 'RightElbow': (-0.389, 0.671, 0.177),
        'LeftWrist': (0.476, 0.784, 0.080), 'RightWrist': (-0.485, 0.864, 0.020),
        'LeftHand': (0.514, 0.853, 0.082), 'RightHand': (-0.479, 0.938, 0.054),
        'LeftFingers': (0.536, 0.897, 0.020), 'RightFingers': (-0.498, 1.006, 0.020),
        'Core': (-0.075, 0.200, 0.323), 'Neck': (-0.053, 0.576, 0.375),
        'Head': (-0.036, 0.743, 0.377),
    },
    'p1': {
        'LeftToe': (-0.247, -0.897, 0.025), 'RightToe': (0.178, -0.871, 0.056),
        'LeftHeel': (-0.239, -0.667, 0.031), 'RightHeel': (0.145, -0.644, 0.031),
        'LeftAnkle': (-0.237, -0.732, 0.096), 'RightAnkle': (0.148, -0.700, 0.102),
        'LeftKnee': (-0.213, -0.488, 0.449), 'RightKnee': (0.082, -0.492, 0.472),
        'LeftHip': (-0.167, -0.204, 0.126), 'RightHip': (0.062, -0.213, 0.143),
        'LeftShoulder': (-0.211, 0.363, 0.096), 'RightShoulder': (0.126, 0.362, 0.090),
        'LeftElbow': (-0.361, 0.121, 0.053), 'RightElbow': (0.244, 0.101, 0.045),
        'LeftWrist': (-0.165, 0.155, 0.225), 'RightWrist': (0.113, 0.071, 0.277),
        'LeftHand': (-0.203, 0.198, 0.278), 'RightHand': (0.122, 0.109, 0.348),
        'LeftFingers': (-0.192, 0.197, 0.359), 'RightFingers': (0.065, 0.119, 0.400),
        'Core': (-0.041, 0.034, 0.100), 'Neck': (-0.044, 0.413, 0.106),
        'Head': (-0.028, 0.568, 0.164),
    },
}

# id=231 "halfway pendulum sweep" — p0 sweeping from bottom, p1 being kicked over
POSE_PENDULO = {
    'p0': {
        'LeftToe': (-0.378, -0.559, 0.025), 'RightToe': (-0.654, 0.004, 0.026),
        'LeftHeel': (-0.314, -0.337, 0.030), 'RightHeel': (-0.427, -0.033, 0.030),
        'LeftAnkle': (-0.278, -0.414, 0.047), 'RightAnkle': (-0.479, 0.038, 0.030),
        'LeftKnee': (0.143, -0.341, 0.058), 'RightKnee': (-0.194, 0.356, 0.052),
        'LeftHip': (-0.217, -0.212, 0.261), 'RightHip': (-0.336, -0.018, 0.215),
        'LeftShoulder': (0.154, -0.179, 0.519), 'RightShoulder': (0.191, 0.160, 0.510),
        'LeftElbow': (0.203, -0.310, 0.262), 'RightElbow': (0.342, 0.012, 0.315),
        'LeftWrist': (0.231, -0.060, 0.204), 'RightWrist': (0.527, -0.180, 0.292),
        'LeftHand': (0.224, -0.064, 0.285), 'RightHand': (0.560, -0.246, 0.327),
        'LeftFingers': (0.254, -0.005, 0.329), 'RightFingers': (0.582, -0.310, 0.283),
        'Core': (-0.115, 0.019, 0.363), 'Neck': (0.203, -0.012, 0.551),
        'Head': (0.360, -0.031, 0.605),
    },
    'p1': {
        'LeftToe': (1.070, -0.115, 0.809), 'RightToe': (0.009, -0.317, 0.874),
        'LeftHeel': (0.899, 0.034, 0.769), 'RightHeel': (0.124, -0.134, 0.799),
        'LeftAnkle': (0.941, -0.027, 0.716), 'RightAnkle': (0.081, -0.199, 0.760),
        'LeftKnee': (0.709, -0.054, 0.354), 'RightKnee': (0.026, -0.274, 0.340),
        'LeftHip': (0.393, 0.189, 0.186), 'RightHip': (0.179, 0.102, 0.192),
        'LeftShoulder': (0.521, -0.384, 0.201), 'RightShoulder': (0.181, -0.374, 0.160),
        'LeftElbow': (0.588, -0.117, 0.101), 'RightElbow': (0.078, -0.108, 0.098),
        'LeftWrist': (0.486, -0.070, 0.335), 'RightWrist': (-0.136, -0.267, 0.073),
        'LeftHand': (0.441, -0.122, 0.372), 'RightHand': (-0.149, -0.343, 0.074),
        'LeftFingers': (0.382, -0.162, 0.338), 'RightFingers': (-0.102, -0.397, 0.108),
        'Core': (0.369, -0.063, 0.100), 'Neck': (0.347, -0.416, 0.205),
        'Head': (0.309, -0.569, 0.254),
    },
}
