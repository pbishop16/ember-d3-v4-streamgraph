import d3 from 'npm:d3';
import D3Base from './d3-base';

export default D3Base.extend({
  area: null,
  duration: 2500,
  height: null,
  layers: null,
  layers0: null,
  layers1: null,
  k: 10,
  n: 20,
  m: 200,
  svg: null,
  width: null,
  x: null,
  y: null,
  z: null,

  didInsertElement() {
    this._super(...arguments);

    this.setLayers();
    this.setGraphPlane();
    this.setX();
    this.setY();
    this.setZ();
    this.setArea();
    this.buildGraph();
  },

  transition() {
    const {
      area,
      duration,
      layers0,
      layers1,
    } = this.getProperties(
      'area',
      'duration',
      'layers0',
      'layers1'
    );
    let t,
        tlayers1 = layers1,
        tlayers0 = layers0;

    d3.selectAll('path')
      .data((t = tlayers1, tlayers1 = tlayers0, tlayers0 = t))
      .transition()
      .duration(duration)
      .attr('d', area);

    this.setProperties({
      layers0: tlayers0,
      layers1: tlayers1,
    });
  },

  setLayers() {
    const {
      k,
      m,
      n,
    } = this.getProperties(
      'k',
      'm',
      'n',
    );
    const _bumps = this.get('_bumps');
    const stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle),
          layers0 = stack(d3.transpose(d3.range(n).map(() => _bumps(this, m, k)))),
          layers1 = stack(d3.transpose(d3.range(n).map(() => _bumps(this, m, k)))),
          layers = layers0.concat(layers1);

    this.setProperties({
      layers,
      layers0,
      layers1,
    });
  },

  setGraphPlane() {
    const svg = d3.select('svg'),
          width = +svg.attr('width'),
          height = +svg.attr('height');

    this.setProperties({
      svg,
      width,
      height,
    });
  },

  setX() {
    const {
      m,
      width,
    } = this.getProperties(
      'm',
      'width',
    );
    const x = d3.scaleLinear()
      .domain([0, m - 1])
      .range([0, width]);

    this.set('x', x);
  },

  setY() {
    const {
      height,
      layers,
      _stackMin,
      _stackMax,
    } = this.getProperties(
      'height',
      'layers',
      '_stackMax',
      '_stackMin',
    );
    const y = d3.scaleLinear()
      .domain([d3.min(layers, _stackMin), d3.max(layers, _stackMax)])
      .range([height, 0]);

    this.set('y', y);
  },

  setZ() {
    const z = d3.interpolateCool;

    this.set('z', z);
  },

  setArea() {
    const {
      x,
      y,
    } = this.getProperties(
      'x',
      'y',
    );

    const area = d3.area()
      .x((d,i) => x(i))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]));

    this.set('area', area);
  },

  buildGraph() {
    const {
      area,
      layers0,
      svg,
      z
    } = this.getProperties(
      'area',
      'layers0',
      'svg',
      'z',
    );

    svg.selectAll('path')
      .data(layers0)
      .enter().append('path')
      .attr('d', area)
      .attr('fill', () => z(Math.random()));
  },

  _stackMin(layer) {
    return d3.min(layer, (d) => d[0]);
  },

  _stackMax(layer) {
    return d3.max(layer, (d) => d[1]);
  },

  _bumps($this, n, m) {
    const _bump = $this.get('_bump');
    let a = [], i;

    for (i = 0; i < n; ++i) { a[i] = 0; }
    for (i = 0; i < m; ++i) { _bump(a, n); }

    return a;
  },

  _bump(a, n) {
    const x = 1 / (0.1 + Math.random()),
          y = 2 * Math.random() - 0.5,
          z = 10 / (0.1 + Math.random());

    for (let i = 0; i < n; i++) {
      const w = (i / n - y) * z;

      a[i] += x * Math.exp(-w * w);
    }
  },

  actions: {
    triggerTransition() {
      this.transition();
    },
  },

});
