particlesJS('particles-js', {
	'particles': {
		'number': {
			'value': 50,
			'density': {
				'enable': true,
				'value_area': 800
			}
		},
		'color': {
			'value': '#b1b1b1'
		},
		'shape': {
			'type': 'circle',
			'stroke': {
				'width': 0,
				'color': '#000000'
			},
			'polygon': {
				'nb_sides': 5
			},
			'image': {
				'src': 'img/github.svg',
				'width': 100,
				'height': 100
			}
		},
		'opacity': {
			'value': 1,
			'random': true,
			'anim': {
				'enable': true,
				'speed': 1,
				'opacity_min': 0,
				'sync': false
			}
		},
		'size': {
			'value': 2,
			'random': true,
			'anim': {
				'enable': true,
				'speed': 5,
				'size_min': 1,
				'sync': false
			}
		},
		'line_linked': {
			'enable': true,
			'distance': 150,
			'color': '#666666',
			'opacity': 0.25,
			'width': 1
		},
		'move': {
			'enable': true,
			'speed': 2,
			'direction': 'none',
			'random': true,
			'straight': false,
			'out_mode': 'bounce',
			'bounce': false,
			'attract': {
				'enable': false,
				'rotateX': 600,
				'rotateY': 600
			}
		}
	},
	'interactivity': {
		'detect_on': 'canvas',
		'events': {
			'onhover': {
				'enable': true,
				'mode': 'grab'
			},
			'onclick': {
				'enable': true,
				'mode': 'push'
			},
			'resize': true
		},
		'modes': {
			'grab': {
				'distance': 120,
				'line_linked': {
					'opacity': 1
				}
			},
			'bubble': {
				'distance': 800,
				'size': 80,
				'duration': 2,
				'opacity': 0.8,
				'speed': 3
			},
			'repulse': {
				'distance': 160,
				'duration': 0.4
			},
			'push': {
				'particles_nb': 5
			},
			'remove': {
				'particles_nb': 2
			}
		}
	},
	'retina_detect': true
});