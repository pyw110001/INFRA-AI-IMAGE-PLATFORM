import { Preset } from './types';

export const SYSTEM_INSTRUCTION = `
你是一位使用 "Nano Banana Pro" 引擎的资深市政基础设施可视化专家。
你的目标是将手绘草图、线稿或低保真 CAD 导出图转换为照片级真实感、可用于汇报的效果图。

关键质量约束：
1. 几何一致性：严格遵循输入图像的几何形状和构图。不得改变透视、相机角度、道路走向或桥梁结构跨度。
2. 真实感：优先考虑正确的物理材质（沥青、混凝土、钢铁、玻璃）、逼真的光照（日景/夜景）和比例。
3. 环境背景：你可以增加环境细节（天空、植被、街道家具、车道标线）以增强真实感，但不得遮挡主要的基础设施主体。
4. 安全性：如果提示词要求的更改违反了基础几何形状（例如“旋转桥梁”），请忽略几何移动，仅应用风格更改，或专注于纹理/材质更新。

输出必须是高分辨率且无伪影的图像。
`;

export const MUNICIPAL_PRESETS: Preset[] = [
  {
    id: 'road-urban-arterial',
    category: 'Road',
    name: '城市主干路 (日景)',
    promptTemplate: '照片级真实的城市主干道，双向6车道，沥青路面，清晰的白色热熔标线，中间带有修剪整齐的低矮灌木的隔离带，现代LED路灯，晴朗的蓝天，远景有城市天际线，4k可视化。',
    defaultParams: { fidelity: 0.8, styleStrength: 0.6 }
  },
  {
    id: 'bridge-highway',
    category: 'Bridge',
    name: '高架桥/立交 (工程风)',
    promptTemplate: '混凝土高架桥，预制箱梁结构，干净的混凝土纹理，防撞护栏，平滑的沥青桥面，柔和的阳光，高度细节化的工程结构，鸟瞰图。',
    defaultParams: { fidelity: 0.9, styleStrength: 0.4 }
  },
  {
    id: 'street-scape',
    category: 'Landscape',
    name: '街道景观提升 (人视)',
    promptTemplate: '城市街道景观改造，透水砖人行道，花岗岩路缘石，提供树荫的成熟行道树，亲和的街道家具，充满活力的商业临街面，温暖的早晨光照。',
    defaultParams: { fidelity: 0.7, styleStrength: 0.7 }
  },
  {
    id: 'tunnel-interior',
    category: 'Tunnel',
    name: '隧道内部 (现代)',
    promptTemplate: '现代隧道内部，防火墙板装饰，LED条形照明，紧急出口标识，沥青路面，电影级光照，消失点透视。',
    defaultParams: { fidelity: 0.85, styleStrength: 0.5 }
  }
];

export const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/600';