import { registerListener } from '../core/instance-helpers.js';

export const Listen = (event: string) => {
    return (target: any, name: string) => {
        registerListener(target, event, name);
    };
};
