var svg, node, path;
var dx = 0,
	dy = 0;
	
var count = 0;
var color = d3.scale.category20();
var radius = 8;

var canvasW = 500,
 	canvasH = 500,
 	toolW = 200,
 	toolH = 500;
 	
var toolC = { 
	x: (toolW / 2),
	y: (toolH / 2) 
};
var	canvasC = {
	x: (canvasW / 2), 
	y: (canvasH / 2) 
};

function createCanvas(){	
	var svg = d3.select('.canvas')
		.append('svg')
		.attr('width', canvasW)
		.attr('height', canvasH);
}

function createToolbar(){
	
	svg = d3.select('.toolbar')
		.append('svg')
		.attr('width', toolW)
		.attr('height', toolH);
		
	node = svg.append('circle')
		.attr('class', 'entity')
		.attr('cx', toolC.x)
		.attr('cy', toolC.y - 75)
		.attr('r', radius);
		
	node.on('click', function(){
		var group = d3.select('.canvas svg')
			.append('g')
			.attr('class', count);
			
		var circle = group.append('circle')
			.attr('class', 0)
			.attr('cx', canvasC.x + dx)
			.attr('cy', canvasC.y + dx)
			.attr('r', radius)
			.call(d3.behavior.drag().on('drag', move))
			.on('dblclick', doubleClickNode);
				
		count++;
		
		dx += 2;
	});

}

function move(){
	moveCircles(this.parentNode);
	moveLines(this.parentNode);
};

function moveLines(parent){
	d3.select(parent).selectAll('line')
		.each(function(d,i){
			var line = d3.select(this);
			
			line.attr('x1', function() { return d3.event.dx + parseInt(line.attr('x1')) })
				.attr('y1', function() { return d3.event.dy + parseInt(line.attr('y1')) })
				.attr('x2', function() { return d3.event.dx + parseInt(line.attr('x2')) })
				.attr('y2', function() { return d3.event.dy + parseInt(line.attr('y2')) });
		});
};

function moveCircles(parent){
	d3.select(parent).selectAll('circle')
		.each(function(d,i){
			var circle = d3.select(this);
			
			circle.attr('cx', function() { return d3.event.dx + parseInt(circle.attr('cx')) })
				  .attr('cy', function() { return d3.event.dy + parseInt(circle.attr('cy')) });
		});
};

function doubleClickNode(){
	var deg = 360 * Math.random();
	var c = d3.select(this);
	var r = c.attr('r');
	var layer = parseInt(c.attr('class'), 10);
	console.log(layer);
	var dx = r * Math.cos(deg);
	var dy = r * Math.sin(deg);
	
	var group = d3.select(this.parentNode);
	var net = group.append('g');
	
	var cx = parseInt(c.attr('cx'), 10);
	var cy = parseInt(c.attr('cy'), 10);
	
	var p = net.append('line')
		.attr('x1', function(){ return computeCoord(cx, 'x'); })
		.attr('y1', function(){ return computeCoord(cy, 'y'); })
		.attr('x2', function(){ return computeCoord(cx + r*dx, 'x'); })
		.attr('y2', function(){ return computeCoord(cy + r*dy, 'y'); });
		
	var newC = net.append('circle')
		.attr('class', layer + 1)
		.attr('cx', function(){
			return computeCoord(cx + r*dx, 'x');
		})
		.attr('cy', function(){
			return computeCoord(cy + r*dy, 'y');
		})
		.attr('r', radius)
		.style('fill', color(layer + 1))
		.call(d3.behavior.drag().on('drag', dragGroup))
		.on('dblclick', doubleClickNode);
		
	this.parentNode.appendChild(this);
};

function dragGroup(){
	var circle = d3.select(this);
	circle.attr('cx', function() { 
			var newC = d3.event.dx + parseInt(circle.attr('cx'));
			return computeCoord(newC, 'x'); 
		})
		.attr('cy', function() { 
			var newC =  d3.event.dy + parseInt(circle.attr('cy'));
			return computeCoord(newC, 'y'); 
		});
		
	var line = d3.select(this.parentNode).select('line');
	line.attr('x2', function() { 
			var newC = d3.event.dx + parseInt(line.attr('x2')); 
			return computeCoord(newC, 'x');
		})
		.attr('y2', function() { 
			var newC = d3.event.dy + parseInt(line.attr('y2')); 
			return computeCoord(newC, 'y');
		});
		
	var k = d3.select(this.parentNode).selectAll('g');
	var immKids = this.parentNode.childNodes;
	var groups = [];
	
	for (var i = 0; i < immKids.length; i++){
		if (immKids[i].localName === 'g'){ groups.push(immKids[i]);	}
	}
	
	d3.selectAll(groups).each(function(d, i){
		var l = d3.select(this).select('line');
		l.attr('x1', function() { return d3.event.dx + parseInt(l.attr('x1')) })
			.attr('y1', function() { return d3.event.dy + parseInt(l.attr('y1')) });
	});
}

function computeCoord(newC, axis){
	var max = axis === 'x' ? canvasW : canvasH;
	if (newC < 0){
		return 0;
	} else if (newC > max){
		return max;
	} else {
		return newC;
	}
}
