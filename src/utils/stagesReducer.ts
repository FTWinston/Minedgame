import { UnexpectedValueError } from 'src/utils/UnexpectedValueError';
import { CellBoard, CellBoardDefinition, createCellBoardInstance } from 'src/features/hexcells';

interface Stages {
    instantiateStage: (stageNumber: number) => CellBoard;
    stageNumber: number;
    totalStages: number;
}

type StagesAction = {
    type: 'increment';
};

export function createStagesState(definitions: CellBoardDefinition[]): Stages {
    return {
        stageNumber: 1,
        totalStages: definitions.length,
        instantiateStage: (stageNumber) => createCellBoardInstance(definitions[stageNumber - 1]),
    };
}

export function stagesReducer(state: Stages, action: StagesAction): Stages | void {
    switch (action.type) {
        case 'increment': {
            if (state.stageNumber >= state.totalStages) {
                return;
            }

            return {
                ...state,
                stageNumber: state.stageNumber + 1,
            }
        }
        default:
            throw new UnexpectedValueError(action.type);
    }
}

