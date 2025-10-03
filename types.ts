
export interface Model {
  id: string;
  name: string;
  isFunctional: boolean;
  isEditing: boolean;
  description: string;
}

export interface AspectRatio {
  label: string;
  value: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

export interface HistoryItem {
  id: string;
  image: string;
  prompt: string;
  negativePrompt: string;
  modelName: string;
  aspectRatio: AspectRatio['value'];
  style: string;
  numberOfImages: number;
}