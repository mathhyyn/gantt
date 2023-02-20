import { DataSource } from './../data-source/data-source';

const tasks2 = JSON.parse(
    '[{"id": "t1", "title": "задача 1", "completed": false, "date": "2022-11-25T21:00:00.000Z", "deadline": "2022-11-28T21:00:00.000Z"},{"id": "t2", "title": "задача 2", "completed": true, "date": "2022-11-24T12:00:00.000Z", "deadline": "2022-11-26T20:00:00.000Z"},{"id": "t3", "title": "задача 3", "completed": false, "date": "2022-11-28T08:00:00.000Z", "deadline": "2022-11-30T08:00:00.000Z"}]');

/* убрать export */
export const tasks = JSON.parse(
    '[{"id": "t1", "title": "задача 1", "completed": false, "date": "2023-02-25T21:00:00.000Z", "deadline": "2023-02-27T21:00:00.000Z"},\
    {"id": "t4", "title": "задача 4", "completed": false, "date": "2023-03-01T08:00:00.000Z", "deadline": "2023-03-03T08:00:00.000Z"},\
    {"id": "t6", "title": "задача 6", "completed": false, "date": "2023-03-02T08:00:00.000Z", "deadline": "2023-03-04T08:00:00.000Z"},\
    {"id": "t2", "title": "задача 2", "completed": true, "date": "2023-02-24T12:00:00.000Z", "deadline": "2023-02-26T20:00:00.000Z"},\
    {"id": "t3", "title": "задача 3", "completed": false, "date": "2023-02-23T08:00:00.000Z", "deadline": "2023-02-25T08:00:00.000Z"},\
    {"id": "t5", "title": "задача 5", "completed": false, "date": "2023-03-01T08:00:00.000Z", "deadline": "2023-03-03T08:00:00.000Z"},\
    {"id": "t7", "title": "задача 7", "completed": false, "date": "2023-02-25T21:00:00.000Z", "deadline": "2023-02-27T21:00:00.000Z"}]');

export const eventsSource: DataSource = {
    getAll: () => {
        return Promise.resolve(tasks);
    }
};

/* убрать export */
export const dependencies = JSON.parse('[{"id":"d1","predecessor":"t1","successor":"t4"},\
{"id":"d2","predecessor":"t2","successor":"t4"},\
{"id":"d3","predecessor":"t3","successor":"t4"},\
{"id":"d4","predecessor":"t1","successor":"t5"},\
{"id":"d5","predecessor":"t2","successor":"t5"},\
{"id":"d6","predecessor":"t3","successor":"t5"},\
{"id":"d7","predecessor":"t6","successor":"t7"},\
{"id":"d8","predecessor":"t6","successor":"t4"},\
{"id":"d65","predecessor":"t6","successor":"t5"},\
{"id":"d56","predecessor":"t5","successor":"t6"},\
{"id":"d55","predecessor":"t5","successor":"t5"},\
{"id":"d74","predecessor":"t5","successor":"t4"}]');

const dependencies2 = JSON.parse('[{"id":"d1","predecessor":"t2","successor":"t3"}, {"id":"d2","predecessor":"t1","successor":"t3"}, {"id":"d3","predecessor":"t1","successor":"t2"}, {"id":"d4","predecessor":"t3","successor":"t1"}]');

export const dependenciesSource: DataSource = {
    getAll: () => {
        return Promise.resolve(dependencies);
    }
};
