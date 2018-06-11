import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService} from '../data.service';
import {MIDWESTUSA} from './MWstates';
import {NORTHEASTUSA} from './NEstates';
import {SOUTHUSA} from './Sstates';
import {WESTUSA} from './Wstates';
import {STATEAFFILIATIONS} from './stateAff';

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.css']
})
export class BarGraphComponent implements OnInit {
    public data_file = {};
    
    constructor(private dataSource: DataService) { }

    ngOnInit() {
        this.getJSONData();
    }

    getJSONData() {
        this.dataSource.getData().subscribe((res) => {
            this.data_file = res;
            console.log(res);
            this.renderGraph("Republican");
        });
    }

    removeGraph() {
        let child = document.querySelector("svg");
        child.parentNode.removeChild(child);
        return child.className.baseVal[0] === "R" ? "Democratic" : "Republican";
    }

    renderGraph (selector) {
        let stateAffiliations = STATEAFFILIATIONS;
        let westUSA = WESTUSA;
        let midWestUSA = MIDWESTUSA;
        let northEastUSA = NORTHEASTUSA;
        let southUSA = SOUTHUSA;
        let W_killed = 0, MW_killed = 0, NE_killed = 0, S_killed = 0;

        let margin = {top : 20, right : 10, bottom : 120, left : 80},
            width = 800 - margin.right - margin.left,
            height = 500 - margin.top - margin.bottom;

        let svg = d3.select("body")
                    .append("svg")
                    .attr ({
                        "width" : width + margin.right + margin.left,
                        "height" : height + margin.top + margin.bottom,
                        "class" : selector
                    })
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

        let xScale = d3.scale.ordinal()
            .rangeRoundBands([0,width], 0.2, 0.2);

        let yScale = d3.scale.linear()
            .range([height, 0]);

        let xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        let yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        for (let attr in this.data_file) {
            let entry = this.data_file[attr];
            if (stateAffiliations[entry.state] === selector[0]) {
                if (westUSA.includes(entry.state)) {
                    W_killed += Number(entry.killed);
                } else if (midWestUSA.includes(entry.state)) {
                    MW_killed += Number(entry.killed);
                } else if (northEastUSA.includes(entry.state)) {
                    NE_killed += Number(entry.killed);
                } else if (southUSA.includes(entry.state)) {
                    S_killed += Number(entry.killed);
                }
            }
        }

        let dataset = [
            {
            "country" : "West USA",
            "killed" :  W_killed },
            {
            "country" : "Mid West USA",
            "killed" : MW_killed },
            {
            "country" : "North East USA",
            "killed" : NE_killed },
            {
            "country" : "South USA",
            "killed" : S_killed }
        ];
        xScale.domain(dataset.map((d) =>  d.country));
        yScale.domain([0, d3.max(dataset, (d) => d.killed)]);
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr({
                "x": function(d) { return xScale(d.country); },
                "y": function(d) { return yScale(d.killed); },
                "width": xScale.rangeBand(),
                "height": function(d) { return  height - yScale(d.killed); }
            });
    
        svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text(function(d){
                return d.killed;
            })
            .attr({
                "x": function(d){ return xScale(d.country) +  xScale.rangeBand()/2; },
                "y": function(d){ return yScale(d.killed)+ 12; },
                "font-family": 'sans-serif',
                "font-size": '17px',
                "font-weight": 'bold',
                "fill": 'white',
                "text-anchor": 'middle'
            });
    
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("dx", "-.8em")
            .attr("dy", ".25em")
            .attr("transform", "rotate(-60)" )
            .style("text-anchor", "end")
            .attr("font-size", "15px")
    
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("dy", "-4em")
            .style("text-anchor", "middle")
            .text("Number of People Killed in " + selector + " states");
    }
}
