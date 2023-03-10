export interface Mission {
    id?: string;
    title: string;
    rewardType: MissionRewardType;
    voucherGroup: string;
    points: number;
    tokens: number;
    task: MissionTask;
    url: string;
    isActive: boolean;
}

export type MissionTask = 'completeProfile' | 'questionnaire';
export type MissionRewardType = 'voucherGroup' | 'myVoicePoint' | 'uWinToken' ;