// Instructions:
//  npm install --save d3 jsdom

const fs = require('fs');
const d3 = require('d3');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const outputLocation = './output.svg';

function generateSkill(label, rating, fontSize, outputFile) {
	const fakeDom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
	const body = d3.select(fakeDom.window.document).select('body');

	const container = body.append("div");
	const width = 256,
		  height = 256,
		  radius = 128;

	const svg = container
		.append("svg")
		.attr("width", width)
		.attr("height", width)
		.attr("version", "1.1")
		.attr("xmlns", "http://www.w3.org/2000/svg");

	const background = svg.append('path')
	  .attr('d', d3.arc().innerRadius(radius*0.85).outerRadius(radius).startAngle(0).endAngle(2*Math.PI))
	  .attr("transform", `translate(${width/2},${height/2})`)
	  .attr("fill", "rgba(121,168,169,0.2)");

	const skill = svg.append('path')
	  .attr('d', d3.arc().innerRadius(radius*0.85).outerRadius(radius).startAngle(0).endAngle(rating*2*Math.PI))
	  .attr("transform", `translate(${width/2},${height/2})`)
	  .attr("fill", "#79a8a9");

	text = svg.append("text")
		.attr("transform", `translate(${width/2},${height/2})`)
		.text(label)
		.attr("font-family", "sans-serif")
		.attr("font-size", fontSize)
		.attr("font-weight", "bold")
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.attr("fill", "#79a8a9");

	// Output the result to file
	fs.writeFileSync(outputFile, container.html());

	console.info(`<li><img src="${outputFile}" alt="${label}"></li>`)
}

generateSkill("HTML5", 1.0, 45, "skill-html.svg");
generateSkill("CSS3", 0.8, 41, "skill-css.svg");
generateSkill("JavaScript/ES6", 0.9, 28, "skill-js.svg");
generateSkill("Node.js", 0.9, 40, "skill-node.svg");
generateSkill("React.js", 0.8, 40, "skill-react.svg");
generateSkill("D3.js", 0.8, 40, "skill-d3.svg");
generateSkill("Go", 0.7, 40, "skill-go.svg");
