import { GanttWidget } from './gantt/gantt';
import { aggregationLevels } from './gantt-timeline/date-aggregation-levels';

const intervalStart = new Date();
const intervalEnd = Date.now() + 1000 * 24 * 60 * 60;

const gantt = new GanttWidget({
    id: 'gantt-uniq-id',
    table: {
        columns: []
    },
    timeline: {
        rowCount: 2,
        aggregationLevels: [aggregationLevels.get('day'), aggregationLevels.get('week'), aggregationLevels.get('month')],
        width: 1050,
        minCellWidth: 90/*,
        dayAgreggationLevelRenderer: (date) => {
            let cell = document.createElement('div');
                cell.classList.add('gantt-timeline-cell');
                cell.style.backgroundColor = 'rgba(245, 222, 179, 0.7)';
            if (date.getUTCDate() == new Date().getDate() && date.getUTCMonth() == new Date().getMonth() && date.getUTCFullYear() == new Date().getFullYear())
                cell.id = 'today';
            else 
                cell.textContent = date.toLocaleDateString('ru', {timeZone: 'UTC'});
            return cell;
        }*/
    }
});

gantt.render(document.querySelector('body'));

//import { Viz } from 'viz.js';
/*import {graphviz2} from "d3-graphviz";

const graphviz = require("@hpcc-js/wasm");

const dot = "digraph G { Hello -> World }";

graphviz.dot(dot).then(svg => {
    const div = document.getElementById("graph");
    div.innerHTML = svg;    
});*/

import { tasks, dependencies } from './mocks/test'

let ngButton = document.createElement('button');
ngButton.textContent = "Get network graph";
document.body.appendChild(ngButton);

let addTaskButton = document.createElement('button');
addTaskButton.textContent = "Add task";
document.body.appendChild(addTaskButton);


let ng = document.createElement('div');
document.body.appendChild(ng);

ngButton.onclick = () => {
    let graph = "digraph { \nrankdir = LR\n";
    for (let t of tasks) {
        graph += t.id + " [label = \"" + t.title + "\", shape = box]" + "\n";
    }
    for (let d of dependencies) {
        graph += d.predecessor + " -> " + d.successor + "\n";
    }
    graph += "}";
    ng.innerText = graph;
    /*graphviz.graphviz("#graph")
    .renderDot('digraph {a -> b}');*/
}

let addTaskWindow = document.getElementById("addTaskWindow");

addTaskButton.onclick = () => {
    addTaskWindow.style.display = "flex";
}

let closeTaskWindow = document.getElementById("closeTaskWindow");

let count = 0;

closeTaskWindow.onclick = () => {
    let taskTitle = (document.getElementById("name") as HTMLInputElement).value;
    let taskDate = (document.getElementById("date") as HTMLInputElement).value;
    let taskDeadline = (document.getElementById("deadline") as HTMLInputElement).value;
    let taskIsCompleted = (document.getElementById("completed") as HTMLInputElement).checked;
    console.log(document.getElementById("completed"), taskIsCompleted);

    count++;
    tasks.push({id: "new"+count, title: taskTitle,  date: taskDate, deadline: taskDeadline, completed: taskIsCompleted});
    gantt.updateDiagram();

    addTaskWindow.style.display = "none";
}


