import React, { useState, useEffect, useCallback, useRef } from 'react';

// Icon Components
const IconGear = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8.06,8.06,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8.06,8.06,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"/>
  </svg>
);

const IconPackage = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"/>
  </svg>
);

// Phosphor-style icon components
const IconServer = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M24,72H232a8,8,0,0,0,0-16H24a8,8,0,0,0,0,16Zm208,32H24a8,8,0,0,0-8,8v48a8,8,0,0,0,8,8H232a8,8,0,0,0,8-8V112A8,8,0,0,0,232,104Zm-8,48H32V120H224ZM232,184H24a8,8,0,0,0-8,8v24a8,8,0,0,0,8,8H232a8,8,0,0,0,8-8V192A8,8,0,0,0,232,184Zm-8,24H32V200H224Zm-28-72a12,12,0,1,1,12,12A12,12,0,0,1,196,136Zm0,80a12,12,0,1,1,12,12A12,12,0,0,1,196,216Z" />
  </svg>
);

const IconCube = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z"/>
  </svg>
);

const IconSparkle = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M197.58,129.06l-51.61-19-19-51.65a15.92,15.92,0,0,0-29.88,0L78.07,110l-51.65,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0l19-51.61,51.65-19a15.92,15.92,0,0,0,0-29.88ZM140.39,163a15.87,15.87,0,0,0-9.43,9.43l-19,51.46L93,172.39A15.87,15.87,0,0,0,83.61,163h0L32.15,144l51.46-19A15.87,15.87,0,0,0,93,115.61l19-51.46,19,51.46a15.87,15.87,0,0,0,9.43,9.43l51.46,19ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"/>
  </svg>
);

const IconImage = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"/>
  </svg>
);

const IconTerminal = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM80,136V120a8,8,0,0,1,16,0v16a8,8,0,0,1-16,0Zm48,0V120a8,8,0,0,1,16,0v16a8,8,0,0,1-16,0Zm48,0V120a8,8,0,0,1,16,0v16a8,8,0,0,1-16,0Z"/>
  </svg>
);

const IconPlay = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"/>
  </svg>
);

const IconStop = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M200,32H56A24,24,0,0,0,32,56V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V56A24,24,0,0,0,200,32Zm8,168a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8Z"/>
  </svg>
);

const IconFolder = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM40,56H92.69l16,16H40ZM216,200H40V88H216Z"/>
  </svg>
);

const IconTrash = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
  </svg>
);

const IconMagicWand = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M248,152a8,8,0,0,1-8,8H224v16a8,8,0,0,1-16,0V160H192a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,248,152ZM56,72H72V88a8,8,0,0,0,16,0V72h16a8,8,0,0,0,0-16H88V40a8,8,0,0,0-16,0V56H56a8,8,0,0,0,0,16Zm88,144a8,8,0,0,0-8,8v16H120a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V256h16a8,8,0,0,0,0-16H152V224A8,8,0,0,0,144,216Zm90.73-52.22-42.12-42.13,46.47-46.46a24,24,0,0,0-33.94-33.95L158.68,87.7,116.55,45.58a24,24,0,1,0-33.94,33.94l42.12,42.13L78.27,168.1a24,24,0,1,0,33.94,33.94l46.47-46.46,42.12,42.13a24,24,0,1,0,33.94-33.95ZM100.87,190.7a8,8,0,1,1-11.32-11.31l46.47-46.46,11.31,11.31Zm116.28-.05a8,8,0,0,1-11.32,0l-42.12-42.13,11.31-11.31,42.13,42.12A8,8,0,0,1,217.15,190.65ZM205.09,62.85a8,8,0,0,1,0,11.32L158.63,120.6l-11.31-11.31,46.46-46.47A8,8,0,0,1,205.09,62.85ZM100.87,90.91,89.56,79.6,132,37.16a8,8,0,0,1,11.32,11.31Z"/>
  </svg>
);

const IconInfo = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/>
  </svg>
);

const IconShield = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M128,16a8,8,0,0,0-3.2.67l-88,40A8,8,0,0,0,32,64v56c0,72.22,50.28,104.31,94.66,120.43a8,8,0,0,0,2.68.47,8.22,8.22,0,0,0,2.66-.46C173.55,224.33,224,192.19,224,120V64a8,8,0,0,0-4.8-7.33l-88-40A8,8,0,0,0,128,16Zm80,104c0,59.6-40.56,87.18-80,101.09C88.61,207.2,48,179.54,48,120V69.2l80-36.36L208,69.2Z"/>
  </svg>
);

const IconX = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 256 256">
    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
  </svg>
);

interface VramStats {
  total: number;
  free: number;
  allocated: number;
  used: number;
}

interface ServerStatus {
  model_ready: boolean;
  model_loading: boolean;
  loading_progress: number;
  model_id: string;
  cuda_available: boolean;
  vram: VramStats | null;
  error: string | null;
  generating: boolean;
  generation_progress: number;
  current_scene: number;
  total_scenes: number;
  generation_status: string;
  has_storyboards: boolean;
  num_storyboards: number;
}

interface SceneImage {
  scene_number: number;
  description: string;
  title?: string;
  caption?: string;
  base64: string;
  mime_type: string;
  seed: number;
  path: string;
  generation_time: number;
  width: number;
  height: number;
}

interface CompositeImage {
  base64: string;
  mime_type: string;
  path?: string;
}

interface ModelOption {
  id: string;
  name: string;
  type: string;
  vram_gb?: number;
  notes?: string;
}

interface GuardrailModel {
  id: string;
  name: string;
  params?: string;
  installed: boolean;
  notes?: string;
}

const PRESETS = [
  { label: 'Product Launch', style: 'hero shot, product centered, clean background, soft studio lighting, modern presentation' },
  { label: 'Feature Showcase', style: 'medium shot, product in use, natural lighting, simple environment, clear focus on interaction' },
  { label: 'Lifestyle', style: 'natural lighting, everyday environment, candid moment, lifestyle photography, emotional context' },
  { label: 'Tech Product', style: 'close-up product detail, soft rim lighting, minimal background, modern tech aesthetic' },
  { label: 'Corporate', style: 'clean composition, flat lighting, minimal emotion, professional environment' },
];

export const StoryboardCreatorWindow: React.FC = () => {
  // Server connection
  const [serverPort, setServerPort] = useState(8767);
  const [allowNetworkAccess, setAllowNetworkAccess] = useState(false);
  const [serverRunning, setServerRunning] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [availableVenvs, setAvailableVenvs] = useState<string[]>([]);
  const [selectedVenv, setSelectedVenv] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);

  // Model state
  const [selectedModel, setSelectedModel] = useState('stabilityai/stable-diffusion-xl-base-1.0');
  const [useCpuOffload, setUseCpuOffload] = useState(true);
  const [useFp16, setUseFp16] = useState(true);
  const [enableAttentionSlicing, setEnableAttentionSlicing] = useState(true);
  const [enableVaeTiling, setEnableVaeTiling] = useState(true);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Guardrail models
  const [guardrailModels, setGuardrailModels] = useState<GuardrailModel[]>([]);
  const [selectedGuardrailModel, setSelectedGuardrailModel] = useState('llama3.1');
  const [installingGuardrailId, setInstallingGuardrailId] = useState<string | null>(null);
  const [guardrailError, setGuardrailError] = useState<string | null>(null);
  const [guardrailCheckStatus, setGuardrailCheckStatus] = useState<'idle' | 'checking' | 'passed' | 'failed'>('idle');

  const DEFAULT_MODELS: ModelOption[] = [
    { id: 'stabilityai/stable-diffusion-xl-base-1.0', name: 'SDXL Base 1.0', type: 'huggingface', vram_gb: 6.5, notes: 'Highest quality results. Best for detailed product visuals.' },
    { id: 'SG161222/RealVisXL_V5.0', name: 'RealVisXL V5.0', type: 'huggingface', vram_gb: 7.0, notes: 'Photorealistic style. Excellent for realistic product shots.' },
    { id: 'runwayml/stable-diffusion-v1-5', name: 'SD v1.5', type: 'huggingface', vram_gb: 3.5, notes: 'Fast and reliable. Good for most product storyboards.' },
  ];

  const DEFAULT_GUARDRAIL_MODELS: GuardrailModel[] = [
    { id: 'llama3.1', name: 'Llama 3.1', params: '8B', installed: false, notes: 'Strong all-round instruction following.' },
    { id: 'qwen2.5', name: 'Qwen 2.5', params: '7B', installed: false, notes: 'Good multilingual coverage and precision.' },
  ];

  // Storyboard parameters
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [scenesList, setScenesList] = useState<string[]>(['']);
  const [overallStyle, setOverallStyle] = useState('professional product presentation');
  const [sceneInputMode, setSceneInputMode] = useState<'manual' | 'auto'>('manual');
  const [autoIdea, setAutoIdea] = useState('');
  const [autoSceneCount, setAutoSceneCount] = useState(6);
  const [autoScenesGenerating, setAutoScenesGenerating] = useState(false);
  const [autoScenesReady, setAutoScenesReady] = useState(false);
  const [steps, setSteps] = useState(12);
  const [cfgScale, setCfgScale] = useState(5.0);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [seed, setSeed] = useState(-1);
  const [negativePrompt, setNegativePrompt] = useState('watermark, text, low quality, blurry, inconsistent style, distorted composition');
  const [scheduler, setScheduler] = useState('Euler');
  const [outputFormat, setOutputFormat] = useState('png');
  const [jpgQuality, setJpgQuality] = useState(95);
  const [autoSave, setAutoSave] = useState(true);
  const [saveMetadata, setSaveMetadata] = useState(true);

  // Generated storyboards
  const [generatedScenes, setGeneratedScenes] = useState<SceneImage[]>([]);
  const [compositeImage, setCompositeImage] = useState<CompositeImage | null>(null);
  const [selectedSceneIdx, setSelectedSceneIdx] = useState(-1);
  const [storyboardViewMode, setStoryboardViewMode] = useState<'detail' | 'sequence'>('sequence');

  // Logs
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  // UI state
  const [showServerPanel, setShowServerPanel] = useState(true);
  const [showModelPanel, setShowModelPanel] = useState(false);
  const [showLogsPanel, setShowLogsPanel] = useState(false);

  // Quickstart dependency list and status
  const REQUIRED_PACKAGES = ['fastapi', 'uvicorn', 'diffusers', 'transformers', 'torch', 'safetensors', 'accelerate', 'requests', 'pillow', 'pydantic', 'huggingface-hub', 'llama-cpp-python'];
  const [depsStatus, setDepsStatus] = useState<Record<string, { installed: boolean; version?: string }>>({});
  const missingPackagesCount = REQUIRED_PACKAGES.filter(p => !depsStatus[p]?.installed).length;
  const [checkingDeps, setCheckingDeps] = useState(false);
  const [installingDeps, setInstallingDeps] = useState(false);

  const normalizePackageName = (name: string) => name.toLowerCase().replace(/-/g, '_');

  const parsePackageInfo = (pkgStr: string): { name: string; version?: string } => {
    if (pkgStr.includes(' @ ')) {
      const name = pkgStr.split(' @ ')[0].trim();
      return { name, version: 'local' };
    }
    if (pkgStr.includes('==')) {
      const [name, version] = pkgStr.split('==');
      return { name: name.trim(), version: version?.trim() };
    }
    const trimmed = pkgStr.trim();
    const parts = trimmed.split(/\s+/);
    if (parts.length > 1) {
      return { name: parts[0], version: parts[1] };
    }
    const dashMatch = trimmed.match(/^(.+)-(\d+\.\d+.*)$/);
    if (dashMatch) {
      return { name: dashMatch[1], version: dashMatch[2] };
    }
    return { name: trimmed };
  };

  const findInstalledPackage = (installedPackages: string[], requiredPkg: string): { found: boolean; version?: string } => {
    const requiredName = normalizePackageName(requiredPkg.replace(/[<>=!].*/g, ''));
    for (const pkgStr of installedPackages) {
      const parsed = parsePackageInfo(pkgStr);
      if (normalizePackageName(parsed.name) === requiredName) {
        return { found: true, version: parsed.version };
      }
    }
    return { found: false };
  };

  const ipcRenderer = (window as any).require?.('electron')?.ipcRenderer;

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-100), `[${timestamp}] ${msg}`]);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (!isScrolledUp) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isScrolledUp]);

  const handleLogsScroll = useCallback(() => {
    const container = logsContainerRef.current;
    if (!container) return;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 10;
    setIsScrolledUp(!isAtBottom);
  }, []);

  // Listen for Python process logs
  useEffect(() => {
    if (!ipcRenderer) return;

    const handlePythonLog = (_event: any, log: string) => {
      const trimmed = log.trim();
      const isPollingRequest = trimmed.includes('GET /status') || trimmed.includes('GET /health');
      const isGenericInfo = trimmed.includes('INFO:') && (
        trimmed.includes('Started server') ||
        trimmed.includes('Waiting for application') ||
        trimmed.includes('Application startup') ||
        trimmed.includes('Uvicorn running')
      );

      if (!isPollingRequest && !isGenericInfo) {
        addLog(`[Python] ${trimmed}`);
      }
    };

    ipcRenderer.on('python-log', handlePythonLog);
    ipcRenderer.on('python-error', handlePythonLog);

    return () => {
      ipcRenderer.removeListener('python-log', handlePythonLog);
      ipcRenderer.removeListener('python-error', handlePythonLog);
    };
  }, [ipcRenderer, addLog]);

  // Load venvs on mount
  useEffect(() => {
    const loadVenvs = async () => {
      if (!ipcRenderer) return;
      const result = await ipcRenderer.invoke('python-list-venvs');
      if (result.success && result.venvs.length > 0) {
        const names = result.venvs.map((v: any) => v.name);
        setAvailableVenvs(names);
        if (!selectedVenv) {
          setSelectedVenv(names[0]);
        }
      }
    };
    loadVenvs();
  }, [ipcRenderer, selectedVenv]);

  // Auto-check dependencies when venv changes
  useEffect(() => {
    const autoCheckDeps = async () => {
      if (!selectedVenv || !ipcRenderer) return;

      setCheckingDeps(true);
      try {
        const vres = await ipcRenderer.invoke('python-list-venvs');
        if (vres.success) {
          const v = (vres.venvs || []).find((x: any) => x.name === selectedVenv);
          if (v && Array.isArray(v.packages) && v.packages.length >= 0) {
            const map: Record<string, any> = {};
            for (const pkg of REQUIRED_PACKAGES) {
              const result = findInstalledPackage(v.packages, pkg);
              map[pkg] = { installed: result.found, version: result.version };
            }
            setDepsStatus(map);
          }
        }
      } catch (err) {
        console.error('Error checking dependencies:', err);
      } finally {
        setCheckingDeps(false);
      }
    };

    autoCheckDeps();
  }, [selectedVenv, ipcRenderer]);

  const installMissing = async () => {
    if (!selectedVenv || !ipcRenderer) {
      addLog('ERROR: No venv selected');
      return;
    }

    const missing = REQUIRED_PACKAGES.filter(p => !depsStatus[p]?.installed);
    if (missing.length === 0) {
      addLog('All dependencies already installed');
      return;
    }

    setInstallingDeps(true);
    try {
      const llamaMissing = missing.includes('llama-cpp-python');
      const bulkMissing = missing.filter(p => p !== 'llama-cpp-python');

      if (llamaMissing) {
        const installed = await installLlamaCppPython();
        if (!installed) {
          return;
        }
      }

      if (bulkMissing.length > 0) {
        addLog(`Installing ${bulkMissing.length} missing packages...`);
        const result = await ipcRenderer.invoke('python-install-packages', {
          venvName: selectedVenv,
          packages: bulkMissing,
        });

        if (!result.success) {
          addLog(`ERROR installing packages: ${result.error}`);
          return;
        }
      }

      addLog('Successfully installed missing packages');
      await refreshDepsStatus();
    } catch (e: any) {
      addLog(`ERROR: ${e.message}`);
    } finally {
      setInstallingDeps(false);
    }
  };

  const getServerUrl = () => `http://127.0.0.1:${serverPort}`;

  const checkServerStatus = useCallback(async () => {
    try {
      const res = await fetch(`${getServerUrl()}/status`);
      if (res.ok) {
        const status = await res.json();
        setServerStatus(status);
        setServerRunning(true);

        if (status.generating === false && status.has_storyboards) {
          const genRes = await fetch(`${getServerUrl()}/generation-status`);
          if (genRes.ok) {
            const genStatus = await genRes.json();
            if (genStatus.scenes && genStatus.scenes.length > 0) {
              setGeneratedScenes(genStatus.scenes);
            }
            if (genStatus.composite) {
              setCompositeImage(genStatus.composite);
            }
          }
        }

        return true;
      }
    } catch {
      setServerRunning(false);
      setServerStatus(null);
    }
    return false;
  }, [serverPort]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (serverRunning) {
        checkServerStatus();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [serverRunning, checkServerStatus]);

  // Poll for generation updates
  useEffect(() => {
    if (!serverRunning || !serverStatus?.generating) return;

    const pollImages = async () => {
      try {
        const res = await fetch(`${getServerUrl()}/generation-status`);
        if (res.ok) {
          const data = await res.json();
          if (data.scenes && data.scenes.length > generatedScenes.length) {
            setGeneratedScenes(data.scenes);
            if (selectedSceneIdx < 0 || selectedSceneIdx < data.scenes.length - 1) {
              setSelectedSceneIdx(data.scenes.length - 1);
            }
          }
          if (data.composite) {
            setCompositeImage(data.composite);
          }
        }
      } catch (e) {}
    };

    const pollInterval = setInterval(pollImages, 1000);
    return () => clearInterval(pollInterval);
  }, [serverRunning, serverStatus?.generating, generatedScenes.length, selectedSceneIdx, getServerUrl]);

  const startServer = async () => {
    if (!selectedVenv || !ipcRenderer) return;

    setConnecting(true);
    addLog('Starting server...');
    addLog(`Using venv: ${selectedVenv}`);

    try {
      // First, resolve the script path
      const scriptResult = await ipcRenderer.invoke('resolve-workflow-script', {
        workflowFolder: 'StoryboardCreator',
        scriptName: 'storyboard_server.py'
      });

      if (!scriptResult.success) {
        addLog(`ERROR: Could not find storyboard_server.py: ${scriptResult.error}`);
        setConnecting(false);
        return;
      }

      addLog(`Found server script at: ${scriptResult.path}`);

      // Now start the server with the resolved script path
      const result = await ipcRenderer.invoke('python-start-script-server', {
        venvName: selectedVenv,
        scriptPath: scriptResult.path,
        port: serverPort,
        serverName: 'storyboard',
        extraArgs: allowNetworkAccess ? ['--network'] : [],
      });

      if (result.success) {
        addLog(`Server process started (PID: ${result.pid}), waiting for connection...`);

        let attempts = 0;
        const maxAttempts = 30;
        const pollInterval = setInterval(async () => {
          attempts++;
          const isReady = await checkServerStatus();
          if (isReady) {
            clearInterval(pollInterval);
            addLog('Server connected!');
            setServerRunning(true);
            setConnecting(false);
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            addLog('ERROR: Server connection timeout');
            setConnecting(false);
          }
        }, 500);
      } else {
        addLog(`ERROR: ${result.error}`);
        setConnecting(false);
      }
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
      setConnecting(false);
    }
  };

  const stopServer = async () => {
    if (!ipcRenderer) return;

    try {
      addLog('Stopping server...');
      const result = await ipcRenderer.invoke('python-stop-script-server', 'storyboard');
      
      if (result.success) {
        await new Promise(r => setTimeout(r, 1000));
        setServerRunning(false);
        setServerStatus(null);
        setIsLoadingModel(false);
        setIsGenerating(false);
        addLog('Server stopped');
      } else {
        addLog(`Error stopping server: ${result.error}`);
      }
    } catch (err: any) {
      addLog(`Error stopping server: ${err.message}`);
    }
  };

  const loadModel = async () => {
    setIsLoadingModel(true);
    try {
      if (!serverRunning) {
        addLog('ERROR: Start the server first');
        return;
      }

      if (!selectedGuardrailModel) {
        setGuardrailError('Please select an LLM');
        addLog('ERROR: Select an LLM');
        return;
      }

      await selectGuardrailModel(selectedGuardrailModel);
      addLog(`Installing LLM: ${selectedGuardrailModel}`);
      const installed = await installGuardrailModel(selectedGuardrailModel);
      if (!installed) {
        addLog('ERROR: LLM install failed');
        return;
      }

      const res = await fetch(`${getServerUrl()}/load-model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_id: selectedModel,
          use_cpu_offload: useCpuOffload,
          use_fp16: useFp16,
          enable_attention_slicing: enableAttentionSlicing,
          enable_vae_tiling: enableVaeTiling,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addLog(`Model loaded: ${data.model_id} on ${data.device}`);
      } else {
        addLog(`ERROR: ${data.error}`);
      }
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
    } finally {
      setIsLoadingModel(false);
    }
  };

  const addScene = () => {
    setScenesList([...scenesList, '']);
  };

  const removeScene = (idx: number) => {
    setScenesList(scenesList.filter((_, i) => i !== idx));
  };

  const updateScene = (idx: number, value: string) => {
    const updated = [...scenesList];
    updated[idx] = value;
    setScenesList(updated);
  };

  const refreshDepsStatus = async () => {
    if (!selectedVenv || !ipcRenderer) return;
    const vres = await ipcRenderer.invoke('python-list-venvs');
    if (vres.success) {
      const v = (vres.venvs || []).find((x: any) => x.name === selectedVenv);
      if (v && Array.isArray(v.packages)) {
        const map: Record<string, any> = {};
        for (const pkg of REQUIRED_PACKAGES) {
          const result = findInstalledPackage(v.packages, pkg);
          map[pkg] = { installed: result.found, version: result.version };
        }
        setDepsStatus(map);
      }
    }
  };

  useEffect(() => {
    if (sceneInputMode === 'auto') {
      setAutoScenesReady(false);
    }
  }, [autoIdea, autoSceneCount, selectedGuardrailModel, sceneInputMode]);

  useEffect(() => {
    setGuardrailCheckStatus('idle');
  }, [productName, productDescription, scenesList, selectedGuardrailModel, sceneInputMode]);


  const installLlamaCppPython = async () => {
    if (!selectedVenv || !ipcRenderer) {
      addLog('ERROR: No venv selected');
      return false;
    }

    const cudaCmd = 'llama-cpp-python==0.3.4 --no-cache-dir --force-reinstall --only-binary=:all: --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cu124';
    const cpuCmd = 'llama-cpp-python==0.3.4 --only-binary=:all: --prefer-binary';

    addLog('Installing llama-cpp-python (CUDA wheel)...');
    let result = await ipcRenderer.invoke('python-install-package', {
      venvName: selectedVenv,
      package: cudaCmd,
    });

    if (!result.success) {
      addLog('CUDA wheel failed, trying CPU wheel...');
      result = await ipcRenderer.invoke('python-install-package', {
        venvName: selectedVenv,
        package: cpuCmd,
      });
    }

    if (!result.success) {
      addLog(`ERROR installing llama-cpp-python: ${result.error}`);
      return false;
    }

    addLog('llama-cpp-python installed');
    await refreshDepsStatus();
    return true;
  };

  const activateManualMode = () => {
    setSceneInputMode('manual');
    if (scenesList.length === 0) {
      setScenesList(['']);
    }
  };

  const activateAutoMode = () => {
    setSceneInputMode('auto');
    setScenesList([]);
    setAutoScenesReady(false);
  };

  const fetchGuardrailModels = useCallback(async () => {
    if (!serverRunning) return;
    try {
      const res = await fetch(`${getServerUrl()}/guardrails/models`);
      if (!res.ok) return;
      const data = await res.json();
      const models = Array.isArray(data.models) ? data.models : [];
      setGuardrailModels(models);
      const fallbackId = selectedGuardrailModel || (models[0]?.id ?? 'llama3.1');
      const nextId = data.selected_id || fallbackId;
      setSelectedGuardrailModel(nextId);
      if (!data.selected_id && nextId) {
        await fetch(`${getServerUrl()}/guardrails/models/select`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: nextId }),
        });
      }
    } catch {
      // Ignore guardrail fetch errors for now
    }
  }, [serverRunning, serverPort]);

  useEffect(() => {
    if (serverRunning) {
      fetchGuardrailModels();
    }
  }, [serverRunning, fetchGuardrailModels]);

  const selectGuardrailModel = async (id: string) => {
    setSelectedGuardrailModel(id);
    setGuardrailError(null);
    if (!id) {
      return;
    }
    if (!serverRunning) {
      return;
    }
    try {
      const res = await fetch(`${getServerUrl()}/guardrails/models/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!data.success) {
        addLog(`ERROR: ${data.error || 'Failed to select LLM'}`);
        return;
      }
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
    }
  };

  const installGuardrailModel = async (id: string) => {
    setInstallingGuardrailId(id);
    setGuardrailError(null);
    try {
      const res = await fetch(`${getServerUrl()}/guardrails/models/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        addLog(`LLM installed: ${id}`);
        await fetchGuardrailModels();
        return true;
      } else {
        addLog(`ERROR: ${data.error || 'Failed to install LLM'}`);
        return false;
      }
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
      return false;
    } finally {
      setInstallingGuardrailId(null);
    }
  };

  const runGuardrailCheck = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { allowed: true, reason: 'Allowed' };
    }
    try {
      const res = await fetch(`${getServerUrl()}/guardrails/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) {
        return { allowed: false, reason: 'LLM unavailable' };
      }
      return await res.json();
    } catch {
      return { allowed: false, reason: 'LLM unavailable' };
    }
  };


  const runGuardrailGate = async () => {
    const validScenes = scenesList.filter(s => s.trim());
    if (!productName.trim()) {
      setGuardrailError('Please enter a product name');
      return false;
    }
    if (validScenes.length === 0) {
      setGuardrailError(sceneInputMode === 'auto' ? 'Generate scenes first' : 'Please add at least one scene');
      return false;
    }
    if (!selectedGuardrailModel) {
      setGuardrailError('Select an LLM first');
      return false;
    }

    setGuardrailError(null);
    setGuardrailCheckStatus('checking');

    const guardrailChecks = [productName, productDescription, ...validScenes];
    for (const text of guardrailChecks) {
      const result = await runGuardrailCheck(text);
      if (!result.allowed) {
        setGuardrailError(result.reason || 'Blocked');
        addLog(`Blocked: ${result.reason || 'Blocked'}`);
        setGuardrailCheckStatus('failed');
        return false;
      }
    }

    setGuardrailCheckStatus('passed');
    return true;
  };

  const generateAutoScenes = async () => {
    const idea = autoIdea.trim();
    if (!idea) {
      setGuardrailError('Please enter a storyboard idea');
      return;
    }
    if (!serverRunning) {
      setGuardrailError('Start the server first');
      return;
    }
    if (!selectedGuardrailModel) {
      setGuardrailError('Select an LLM first');
      return;
    }

    setGuardrailError(null);
    setAutoScenesGenerating(true);
    setAutoScenesReady(false);
    setScenesList([]);
    try {
      const res = await fetch(`${getServerUrl()}/auto-scenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, num_scenes: autoSceneCount }),
      });
      const data = await res.json();
      if (data.success) {
        setScenesList(Array.isArray(data.scenes) ? data.scenes : []);
        setAutoScenesReady(true);
      } else {
        setGuardrailError(data.error || 'Failed to generate scenes');
      }
    } catch (err: any) {
      setGuardrailError(err.message || 'Failed to generate scenes');
    } finally {
      setAutoScenesGenerating(false);
    }
  };

  const generateStoryboard = async () => {
    const validScenes = scenesList.filter(s => s.trim());
    if (!productName.trim()) {
      addLog('ERROR: Please enter a product name');
      return;
    }
    if (validScenes.length === 0) {
      addLog(sceneInputMode === 'auto' ? 'ERROR: Generate scenes first' : 'ERROR: Please add at least one scene');
      return;
    }
    if (guardrailCheckStatus !== 'passed') {
      addLog('ERROR: Run Guardrail Check first');
      return;
    }

    setGuardrailError(null);
    setCompositeImage(null);

    setIsGenerating(true);
    try {
      const res = await fetch(`${getServerUrl()}/generate-storyboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productName,
          product_description: productDescription,
          scenes: validScenes,
          overall_style: overallStyle,
          model_id: selectedModel,
          negative_prompt: negativePrompt,
          steps,
          cfg_scale: cfgScale,
          width,
          height,
          seed,
          scheduler,
          output_format: outputFormat,
          jpg_quality: jpgQuality,
          auto_save: autoSave,
          save_metadata: saveMetadata,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedScenes(data.scenes);
        setCompositeImage(data.composite || null);
        setSelectedSceneIdx(0);
        addLog(`Storyboard generated: ${data.storyboard_id}`);
        addLog(`Saved to: ${data.output_path}`);
      } else {
        addLog(`ERROR: ${data.error}`);
      }
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const openOutputFolder = async () => {
    try {
      await fetch(`${getServerUrl()}/open-folder`, { method: 'POST' });
      addLog('Opening output folder...');
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
    }
  };

  const stopGeneration = async () => {
    try {
      await fetch(`${getServerUrl()}/stop-generation`, { method: 'POST' });
      addLog('Stop requested');
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`);
    }
  };

  const panelClass = "rounded-xl p-4 border border-white/5 bg-slate-950/80 backdrop-blur-xl shadow-lg";

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden flex flex-col">
      <style>{`
        .storyboard-creator-workflow select { background: rgba(30, 41, 59, 0.6) !important; background-image: none !important; }
      `}</style>

      {/* Header Bar */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-cyan-400">Storyboard Creator</h1>
            <span className="text-xs text-slate-500">v1.0</span>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-3 text-xs">
            {serverRunning ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-400 font-medium">Running</span>
                </div>
                {serverStatus?.model_ready && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-purple-400">●</span>
                    <span className="text-slate-300">Ready</span>
                  </div>
                )}
                {serverStatus?.vram && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-cyan-400">VRAM:</span>
                    <span className="text-slate-300">{(serverStatus.vram.allocated / 1024 ** 3).toFixed(1)} / {(serverStatus.vram.total / 1024 ** 3).toFixed(0)}GB</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                <span className="text-slate-500">Offline</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - Controls (40%) */}
        <div className="w-[40%] border-r border-white/5 overflow-y-auto p-4 space-y-4 bg-black/40">

          {/* Setup & Dependencies */}
          <div className={panelClass}>
            <button
              onClick={() => setShowServerPanel(!showServerPanel)}
              className="w-full text-left flex items-center justify-between mb-3 group bg-transparent"
            >
              <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                <IconGear className="w-4 h-4" />
                Setup & Dependencies
              </h3>
              <span className={`text-cyan-400 text-xs transition-transform duration-200 ${showServerPanel ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showServerPanel && (
              <div className="space-y-4 text-xs">
                {/* Venv Selection */}
                <div className="flex items-center gap-3">
                  <label className="font-medium text-xs whitespace-nowrap text-slate-300">Virtual Environment</label>
                  <select
                    value={selectedVenv}
                    onChange={e => setSelectedVenv(e.target.value)}
                    className="w-48 text-xs rounded-lg px-3 py-2.5 border border-white/10 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-slate-800 text-slate-200"
                    disabled={serverRunning}
                  >
                    {availableVenvs.length === 0 ? (
                      <option value="">No venvs available</option>
                    ) : (
                      availableVenvs.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))
                    )}
                  </select>
                </div>

                {/* Dependencies Section */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold flex items-center gap-1.5 text-slate-300">
                      <IconPackage className="w-3.5 h-3.5" />
                      Python Packages {checkingDeps && <span className="text-slate-400">(checking...)</span>}
                    </h4>
                    <button
                      onClick={installMissing}
                      disabled={installingDeps || !selectedVenv || missingPackagesCount === 0}
                      className={`px-3 py-2 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all shadow-sm ${
                        (installingDeps || !selectedVenv || missingPackagesCount === 0)
                          ? 'bg-slate-700'
                          : 'bg-cyan-600 hover:bg-cyan-500'
                      }`}
                    >
                      {installingDeps
                        ? 'Installing...'
                        : missingPackagesCount === REQUIRED_PACKAGES.length
                          ? 'Install All'
                          : 'Install Required Packages'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    
                    {REQUIRED_PACKAGES.map(pkg => {
                      const st = depsStatus[pkg];
                      const isInstalled = st?.installed;
                      return (
                        <div
                          key={pkg}
                          className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                            isInstalled
                              ? 'bg-green-500/15 border border-green-500/40'
                              : 'bg-red-500/15 border border-red-500/40'
                          }`}
                        >
                          <span
                            className={`flex-1 truncate font-medium ${isInstalled ? 'text-green-300' : 'text-red-300'}`}
                          >
                            {pkg}
                          </span>
                          {isInstalled ? (
                            <svg className="w-3.5 h-3.5 flex-none text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 flex-none text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Port & Server Control */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-xs whitespace-nowrap text-slate-300">Port</label>
                    <input
                      type="number"
                      value={serverPort}
                      onChange={e => setServerPort(parseInt(e.target.value) || 8767)}
                      className="w-32 text-xs rounded-lg px-3 py-2.5 border border-white/10 focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-50 bg-slate-800 text-slate-200"
                      disabled={serverRunning}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="allowNetworkAccess"
                      checked={allowNetworkAccess}
                      onChange={e => setAllowNetworkAccess(e.target.checked)}
                      disabled={serverRunning}
                      className="rounded"
                    />
                    <label htmlFor="allowNetworkAccess" className="text-xs text-slate-300">
                      Allow network access (0.0.0.0)
                    </label>
                  </div>
                  {!serverRunning ? (
                    <button
                      onClick={startServer}
                      disabled={connecting || !selectedVenv}
                      className={`w-full px-4 py-3 disabled:opacity-60 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-white ${
                        connecting ? 'bg-slate-700' : 'bg-cyan-600 hover:bg-cyan-500'
                      }`}
                    >
                      <IconServer className="w-3.5 h-3.5" />
                      {connecting ? 'Starting...' : 'Start Server'}
                    </button>
                  ) : (
                    <button
                      onClick={stopServer}
                      className="w-full px-4 py-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-white bg-red-600"
                    >
                      <IconServer className="w-3.5 h-3.5" />
                      Stop Server
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Model & Optimization */}
          <div className={panelClass}>
              <button
                onClick={() => setShowServerPanel(!showServerPanel)}
                className="w-full text-left flex items-center justify-between mb-3 group bg-transparent"
              >
                <h3 className="text-sm font-semibold text-purple-400 flex items-center gap-2">
                  <IconCube className="w-4 h-4" />
                  Model & Optimization
                </h3>
                <span className={`text-purple-400 text-xs transition-transform duration-200 ${showServerPanel ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {showServerPanel && (
                <div className="space-y-3 text-xs">
                  {/* Image Model Selection */}
                  <div className="space-y-2">
                    <label className="block text-slate-300 font-medium">Image generation model</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs"
                    >
                      {(availableModels.length > 0 ? availableModels : DEFAULT_MODELS).map(m => (
                        <option key={m.id} value={m.id} title={m.notes}>
                          {m.name} {m.vram_gb ? `(${m.vram_gb}GB)` : ''}
                        </option>
                      ))}
                    </select>
                    {(availableModels.length > 0 ? availableModels : DEFAULT_MODELS).find(m => m.id === selectedModel) && (
                      <p className="text-xs text-slate-400">
                        {(availableModels.length > 0 ? availableModels : DEFAULT_MODELS).find(m => m.id === selectedModel)?.notes}
                      </p>
                    )}
                  </div>

                  {/* LLM Selection */}
                  <div className="space-y-2">
                    <label className="block text-slate-300 font-medium">LLM</label>
                    <select
                      value={selectedGuardrailModel}
                      onChange={(e) => selectGuardrailModel(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs"
                    >
                      {(guardrailModels.length > 0 ? guardrailModels : DEFAULT_GUARDRAIL_MODELS).map(model => (
                        <option key={model.id} value={model.id}>
                          {model.name}{model.params ? ` (${model.params})` : ''}
                        </option>
                      ))}
                    </select>
                    {(guardrailModels.length > 0 ? guardrailModels : DEFAULT_GUARDRAIL_MODELS).find(m => m.id === selectedGuardrailModel) && (
                      <div className="text-xs text-slate-400">
                        {(guardrailModels.length > 0 ? guardrailModels : DEFAULT_GUARDRAIL_MODELS).find(m => m.id === selectedGuardrailModel)?.notes}
                      </div>
                    )}
                  </div>

                  {/* Model Loading Optimizations */}
                  <div className="space-y-2 p-3 rounded-lg bg-slate-800/40 border border-white/10">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useCpuOffload}
                        onChange={(e) => setUseCpuOffload(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-slate-300">CPU Offload</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useFp16}
                        onChange={(e) => setUseFp16(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-slate-300">FP16 Precision</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableAttentionSlicing}
                        onChange={(e) => setEnableAttentionSlicing(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-slate-300">Attention Slicing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableVaeTiling}
                        onChange={(e) => setEnableVaeTiling(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-slate-300">VAE Tiling</span>
                    </label>
                  </div>

                  {/* Generation Settings */}
                  <div className="space-y-2 p-3 rounded-lg bg-slate-800/40 border border-white/10">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Steps <span className="text-slate-500 text-xs">(1-30)</span></label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={steps}
                          onChange={(e) => setSteps(Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-slate-800 border border-white/10 rounded text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">CFG Scale <span className="text-slate-500 text-xs">(1-10)</span></label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          step="0.1"
                          value={cfgScale}
                          onChange={(e) => setCfgScale(Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-slate-800 border border-white/10 rounded text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Scheduler</label>
                      <select
                        value={scheduler}
                        onChange={(e) => setScheduler(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs"
                      >
                        <option value="Euler">Euler</option>
                        <option value="Euler A">Euler A</option>
                        <option value="DPM++ 2M">DPM++ 2M</option>
                        <option value="DDIM">DDIM</option>
                        <option value="PNDM">PNDM</option>
                      </select>
                    </div>
                  </div>

                  {/* Load Model Button */}
                  <button
                    onClick={loadModel}
                    disabled={isLoadingModel || serverStatus?.model_loading || (serverStatus?.model_ready && (guardrailModels.length > 0 ? guardrailModels : DEFAULT_GUARDRAIL_MODELS).find(m => m.id === selectedGuardrailModel)?.installed)}
                    className={`w-full px-4 py-3 disabled:opacity-60 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-white ${
                      isLoadingModel
                        ? 'bg-slate-700'
                        : (serverStatus?.model_ready && (guardrailModels.length > 0 ? guardrailModels : DEFAULT_GUARDRAIL_MODELS).find(m => m.id === selectedGuardrailModel)?.installed)
                          ? 'bg-emerald-600'
                          : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                  >
                    <IconSparkle className="w-3.5 h-3.5" />
                    {isLoadingModel
                      ? 'Loading...'
                      : (serverStatus?.model_ready && (guardrailModels.length > 0 ? guardrailModels : DEFAULT_GUARDRAIL_MODELS).find(m => m.id === selectedGuardrailModel)?.installed)
                        ? 'Models Loaded'
                        : 'Load Models'}
                  </button>
                </div>
              )}
            </div>

          {/* Model & Generation */}
          <div className={panelClass}>
            <button
              onClick={() => setShowModelPanel(!showModelPanel)}
              className="w-full text-left flex items-center justify-between mb-3 group bg-transparent"
            >
              <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                <IconCube className="w-4 h-4" />
                Generate Storyboard
              </h3>
              <span className={`text-blue-400 text-xs transition-transform duration-200 ${showModelPanel ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showModelPanel && (
              <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g., CloudSync Pro"
                      className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Product Description</label>
                    <input
                      type="text"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder="Brief description"
                      className="w-full px-3 py-2.5 bg-slate-800 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Style Presets</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESETS.map(p => (
                        <button
                          key={p.label}
                          onClick={() => setOverallStyle(p.style)}
                          className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            overallStyle === p.style
                              ? 'bg-blue-600 text-white border border-blue-500/50'
                              : 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Custom Style</label>
                    <textarea
                      value={overallStyle}
                      onChange={(e) => setOverallStyle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs h-16 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Negative Prompt</label>
                    <textarea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="Things to avoid in the image..."
                      className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 text-xs h-12 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Scene Input Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={activateManualMode}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          sceneInputMode === 'manual'
                            ? 'bg-blue-600 text-white border border-blue-500/50'
                            : 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700'
                        }`}
                      >
                        Manual
                      </button>
                      <button
                        onClick={activateAutoMode}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          sceneInputMode === 'auto'
                            ? 'bg-emerald-600 text-white border border-emerald-500/50'
                            : 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700'
                        }`}
                      >
                        Auto
                      </button>
                    </div>
                  </div>

                  {sceneInputMode === 'auto' && (
                    <div className="space-y-2 p-3 rounded-lg bg-slate-800/40 border border-white/10">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Storyboard Idea</label>
                        <textarea
                          value={autoIdea}
                          onChange={(e) => setAutoIdea(e.target.value)}
                          placeholder="Single prompt to generate all scenes"
                          className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 text-xs h-16 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-300 font-medium mb-1">Number of Scenes</label>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={autoSceneCount}
                            onChange={(e) => setAutoSceneCount(Number(e.target.value))}
                            className="w-full px-2 py-1.5 bg-slate-800 border border-white/10 rounded text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={generateAutoScenes}
                            disabled={!serverRunning || !selectedGuardrailModel || autoScenesGenerating || autoScenesReady}
                            className={`w-full px-3 py-2 border border-emerald-500/50 rounded-lg text-xs font-semibold text-white transition-all ${
                              autoScenesReady
                                ? 'bg-emerald-600'
                                : serverRunning && selectedGuardrailModel && !autoScenesGenerating
                                  ? 'bg-emerald-600 hover:bg-emerald-500'
                                  : 'bg-slate-700'
                            }`}
                          >
                            {autoScenesGenerating ? 'Generating...' : autoScenesReady ? 'Generated' : 'Generate Scenes'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}


                  {sceneInputMode === 'manual' && (
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Scenes *</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-800/40 rounded-lg border border-white/10">
                        {scenesList.map((scene, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={scene}
                              onChange={(e) => updateScene(idx, e.target.value)}
                              placeholder={`Scene ${idx + 1}`}
                              className="flex-1 px-2 py-1.5 bg-slate-800 border border-white/10 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 text-xs"
                            />
                            {scenesList.length > 1 && (
                              <button onClick={() => removeScene(idx)} className="px-2 py-1.5 bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 rounded text-red-300 transition-all">
                                x
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={addScene}
                        className="w-full mt-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-white/10 rounded-lg text-slate-300 font-medium text-xs transition-all"
                      >
                        + Add Scene
                      </button>
                    </div>
                  )}

                  {sceneInputMode === 'auto' && (
                    <div>
                      <label className="block text-slate-300 font-medium mb-2">Generated Scenes</label>
                      <div className="space-y-1 max-h-48 overflow-y-auto p-2 bg-slate-800/40 rounded-lg border border-white/10 text-xs text-slate-300">
                        {scenesList.length === 0 ? (
                          <div className="text-slate-500">Generate scenes to preview them here.</div>
                        ) : (
                          scenesList.map((scene, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="text-slate-500">Scene {idx + 1}:</span>
                              <span className="text-slate-300">{scene}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Resolution Presets</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => { setWidth(512); setHeight(512); }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          width === 512 && height === 512
                            ? 'bg-emerald-600 text-white border border-emerald-500/50'
                            : 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700'
                        }`}
                      >
                        512×512<br/><span className="text-slate-500 text-xs">Low VRAM</span>
                      </button>
                      <button
                        onClick={() => { setWidth(768); setHeight(768); }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          width === 768 && height === 768
                            ? 'bg-blue-600 text-white border border-blue-500/50'
                            : 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700'
                        }`}
                      >
                        768×768<br/><span className="text-slate-500 text-xs">Balanced</span>
                      </button>
                      <button
                        onClick={() => { setWidth(1024); setHeight(1024); }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          width === 1024 && height === 1024
                            ? 'bg-purple-600 text-white border border-purple-500/50'
                            : 'bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700'
                        }`}
                      >
                        1024×1024<br/><span className="text-slate-500 text-xs">High Quality</span>
                      </button>
                    </div>
                  </div>


                  <button
                    onClick={runGuardrailGate}
                    disabled={!serverRunning || guardrailCheckStatus === 'checking' || guardrailCheckStatus === 'passed'}
                    className={`w-full px-4 py-3 disabled:opacity-60 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-white mt-4 ${
                      guardrailCheckStatus === 'passed'
                        ? 'bg-emerald-600'
                        : guardrailCheckStatus === 'failed'
                          ? 'bg-red-600'
                          : 'bg-cyan-600 hover:bg-cyan-500'
                    }`}
                  >
                    <IconShield className="w-3.5 h-3.5" />
                    {guardrailCheckStatus === 'checking'
                      ? 'Checking...'
                      : guardrailCheckStatus === 'passed'
                        ? 'Guardrail Passed'
                        : guardrailCheckStatus === 'failed'
                          ? 'Recheck Guardrail'
                          : 'Guardrail Check'}
                  </button>

                  <button
                    onClick={generateStoryboard}
                    disabled={isGenerating || guardrailCheckStatus !== 'passed' || scenesList.filter(s => s.trim()).length === 0 || !serverRunning || !serverStatus?.model_ready}
                    className={`w-full px-4 py-3 disabled:opacity-60 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-white mt-4 ${
                      isGenerating ? 'bg-slate-700' : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}
                    title={guardrailCheckStatus !== 'passed'
                      ? 'Run guardrail check first'
                      : !serverRunning
                        ? 'Start server first'
                        : !serverStatus?.model_ready
                          ? 'Load model first'
                          : scenesList.filter(s => s.trim()).length === 0
                            ? 'Add at least one scene'
                            : ''}
                  >
                    <IconSparkle className="w-3.5 h-3.5" />
                    {isGenerating ? 'Generating...' : 'Generate Storyboard'}
                  </button>

                  {guardrailError && (
                    <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-lg text-red-300 text-xs">
                      Blocked: {guardrailError}
                    </div>
                  )}

                  {!serverRunning && (
                    <div className="p-3 bg-amber-600/20 border border-amber-500/40 rounded-lg text-amber-300 text-xs">
                      ⚠️ Start the server first
                    </div>
                  )}

                  {serverRunning && !serverStatus?.model_ready && (
                    <div className="p-3 bg-amber-600/20 border border-amber-500/40 rounded-lg text-amber-300 text-xs">
                      ⚠️ Load a model to generate
                    </div>
                  )}

                  {isGenerating && serverStatus && (
                    <div className="space-y-2 pt-4 border-t border-white/10">
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full" style={{ width: `${(serverStatus.generation_progress || 0) * 100}%` }} />
                      </div>
                      <div className="text-xs text-slate-400">{serverStatus.generation_status}</div>
                      <button
                        onClick={stopGeneration}
                        className="w-full px-3 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/40 rounded text-red-300 font-medium transition-all text-xs"
                      >
                        Stop Generation
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        {/* RIGHT PANEL - Preview & Gallery (60%) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/30">
          {generatedScenes.length > 0 ? (
            <>
              {/* View Mode Toggle */}
              <div className="flex-none border-b border-white/10 p-3 bg-slate-900/50 flex gap-2">
                <button
                  onClick={() => setStoryboardViewMode('sequence')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    storyboardViewMode === 'sequence'
                      ? 'bg-cyan-500/30 border border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  Sequence View
                </button>
                <button
                  onClick={() => setStoryboardViewMode('detail')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    storyboardViewMode === 'detail'
                      ? 'bg-cyan-500/30 border border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:bg-slate-700/50'
                  }`}
                >
                  Detail View
                </button>
              </div>

              {/* Sequence View - Storyboard Grid */}
              {storyboardViewMode === 'sequence' && (
                <div className="flex-1 overflow-auto p-6">
                  <div className="max-w-6xl mx-auto">
                    <h3 className="text-sm font-semibold text-cyan-400 mb-4">Storyboard Sequence ({generatedScenes.length} scenes)</h3>
                    {compositeImage && (
                      <div className="mb-6 rounded-xl border border-white/10 bg-slate-900/40 p-3">
                        <div className="text-xs text-slate-400 mb-2">Combined Storyboard</div>
                        <img
                          src={`data:${compositeImage.mime_type};base64,${compositeImage.base64}`}
                          alt="Storyboard composite"
                          className="w-full rounded-lg border border-white/10"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-6 auto-rows-max">
                      {generatedScenes.map((scene, idx) => (
                        <div
                          key={idx}
                          className="group cursor-pointer"
                          onClick={() => {
                            setStoryboardViewMode('detail');
                            setSelectedSceneIdx(idx);
                          }}
                        >
                          <div className="bg-slate-800/50 rounded-lg overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                            {/* Scene Number Badge */}
                            <div className="relative">
                              <div className="absolute top-2 left-2 z-10 w-7 h-7 bg-cyan-500/80 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {idx + 1}
                              </div>

                              {/* Image */}
                              <img
                                src={`data:${scene.mime_type};base64,${scene.base64}`}
                                alt={`Scene ${idx + 1}`}
                                className="w-full aspect-video object-cover group-hover:brightness-110 transition-all"
                              />

                              {/* Overlay Info */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                                <p className="text-xs text-slate-300 line-clamp-2">{scene.description}</p>
                                <div className="flex gap-3 mt-2 text-xs text-slate-400">
                                  <span>{scene.generation_time}s</span>
                                  <span>{scene.width}x{scene.height}</span>
                                </div>
                              </div>
                            </div>
                            <div className="px-3 py-2 border-t border-white/10">
                              <div className="text-xs font-semibold text-slate-200">{scene.title || `Scene ${idx + 1}`}</div>
                              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{scene.caption || scene.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Detail View - Single Scene */}
              {storyboardViewMode === 'detail' && (
                <div className="flex-1 min-h-0 p-6 flex flex-col items-center justify-center">
                  {selectedSceneIdx >= 0 && generatedScenes[selectedSceneIdx] && (
                    <>
                      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                        <img
                          src={`data:${generatedScenes[selectedSceneIdx].mime_type};base64,${generatedScenes[selectedSceneIdx].base64}`}
                          alt={`Scene ${generatedScenes[selectedSceneIdx].scene_number}`}
                          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10"
                        />
                      </div>
                      <div className="flex-none mt-4 flex flex-col gap-3 w-full max-w-2xl">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-slate-200">
                            {generatedScenes[selectedSceneIdx].title || `Scene ${generatedScenes[selectedSceneIdx].scene_number}`}
                          </div>
                          <div className="text-xs text-slate-400">
                            {generatedScenes[selectedSceneIdx].caption || generatedScenes[selectedSceneIdx].description}
                          </div>
                        </div>
                        <div className="flex gap-6 text-xs text-slate-400">
                          <span><span className="text-cyan-400">Seed:</span> {generatedScenes[selectedSceneIdx].seed}</span>
                          <span><span className="text-emerald-400">Time:</span> {generatedScenes[selectedSceneIdx].generation_time}s</span>
                          <span><span className="text-pink-400">Size:</span> {generatedScenes[selectedSceneIdx].width}x{generatedScenes[selectedSceneIdx].height}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Thumbnail Navigation (always visible) */}
              <div className="flex-none border-t border-white/10 p-4 bg-slate-900/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                    <IconImage className="w-3.5 h-3.5" />
                    Scenes ({generatedScenes.length})
                  </h4>
                  <button
                    onClick={openOutputFolder}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-lg text-xs font-medium text-emerald-400 transition-all"
                  >
                    Open Folder →
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {generatedScenes.map((scene, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedSceneIdx(idx);
                        if (storyboardViewMode !== 'detail') {
                          setStoryboardViewMode('detail');
                        }
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all relative ${
                        selectedSceneIdx === idx
                          ? 'border-cyan-500 shadow-lg shadow-cyan-500/50'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      title={`Scene ${idx + 1}: ${scene.description}`}
                    >
                      <img
                        src={`data:${scene.mime_type};base64,${scene.base64}`}
                        alt={`Scene ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-lg pointer-events-none">{idx + 1}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div className="text-slate-400">
                <IconImage className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No scenes generated yet</p>
                <p className="text-xs text-slate-500 mt-1">Configure and generate a storyboard to see previews here</p>
              </div>
            </div>
          )}

          {/* Logs Panel at Bottom */}
          <div className="flex-none border-t border-white/10 bg-slate-900/50 p-4 h-48 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <IconTerminal className="w-3.5 h-3.5" />
                Generation Log
              </h3>
              <button
                onClick={() => setLogs([])}
                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
            </div>
            <div
              ref={logsContainerRef}
              onScroll={handleLogsScroll}
              className="flex-1 overflow-y-auto space-y-0.5 font-mono text-xs bg-slate-950/50 rounded-lg p-2"
            >
              {logs.length === 0 ? (
                <div className="text-slate-500">Ready for generation...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="text-slate-400 leading-relaxed">
                    <span className="text-slate-600">{log.split(']')[0]}]</span>
                    <span className="text-slate-300">{log.split(']').slice(1).join(']')}</span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryboardCreatorWindow;
