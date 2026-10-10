// Every drawing the steps use. A is "you" (solid), B your partner (outline). figures.js explains the
// settings. The floor is at y = 200 for side views. Check them all at tools/poses.html.
(function (P) {
  'use strict';

  // ---------------- Standing ----------------
  P.stand = {
    A: '128,104 t-82 h-80 l1:@146,196/-1 l2:@102,196/-1 a1:@B.front-3+2/1 a2:@172,86/1',
    B: '212,104 t-98 h-100 f-1 l1:@194,196/1 l2:@238,196/1 a1:@A.front+3+2/-1 a2:@168,88/-1',
  };

  P.clinch = {
    A: '150,104 t-76 h-66 l1:@168,196/-1 l2:@122,196/-1 a1:@B.nape+2+2/1 a2:@B.back-2+8/1',
    B: '196,104 t-104 h-114 f-1 l1:@180,196/1 l2:@224,196/1 a1:@A.nape-2+2/-1 a2:@A.back+2+8/-1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Ba1 Aa1',
  };

  P['single-leg'] = {
    A: '140,124 t-58 h-50 l1:@166,196/-1 l2:@106,196/-1 a1:@B.k1+6+2/1 a2:@B.k1+2+10/1',
    B: '212,108 t-100 h-104 f-1 l1:166,100 l2:@226,196/1 a1:@A.nape+4+0/-1 a2:@A.back+6+4/-1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt At Bl1 Al1 Aa1 Ba1',
  };

  P['double-leg'] = {
    A: '150,140 t-32 h-18 l1:80,178 l2:@92,196/-1 ft1:0 a1:@B.k1+6+0/1 a2:@B.k2+8+4/1',
    B: '216,104 t-100 h-106 f-1 l1:@196,196/1 l2:@236,196/1 a1:@A.back+0-2/-1 a2:@A.neck+8-2/-1',
    z: 'Aa2 Ba2 Bl2 Al2 At Bt Bl1 Al1 Aa1 Ba1',
  };

  P['snap-down'] = {
    A: '116,106 t-74 h-60 l1:@142,196/-1 l2:@92,196/-1 a1:@B.nape+0-2/1 a2:@B.e1+2+0/1',
    B: '226,110 t198 h165 f-1 l1:@196,196/1 l2:@252,196/1 a1:@A.k1+6+0/-1 a2:130,110',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
    arrows: ['A.h1+0-22 > A.h1-30+16 ~-0.3'],
  };

  P['ankle-pick'] = {
    A: '125,145 t-15 h-8 l1:@168,196/-1 l2:@78,196/-1 a1:@B.an1+2-8/1 a2:@B.e1+0+4/1',
    B: '222,106 t-112 h-125 f-1 l1:@185,196/1 l2:@246,196/1 a1:@A.back+4-2/-1 a2:@A.neck+6-4/-1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Aa1 Ba1',
  };

  P['guard-pull'] = {
    A: '150,186 t-128 h-120 l1:@B.hip-14+2/-1 l2:@176,196/-1 a1:@B.h1/1 a2:@B.h2+0-4/1',
    B: '236,104 t-128 h-138 f-1 l1:@214,196/1 l2:@254,196/1 a1:@A.k2+2-6/-1 a2:@A.k1+6-4/-1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Ba1 Aa1',
  };

  P['body-lock'] = {
    A: '150,106 t-82 h-70 l1:@170,196/-1 l2:@128,196/-1 a1:@B.tummy+4+0/1 a2:@B.tummy+2+8/1',
    B: '182,104 t-92 h-92 l1:@202,196/-1 l2:@170,196/-1 a1:60,100 a2:70,110',
    z: 'Aa2 Al2 Ba2 Bl2 At Bt Bl1 Ba1 Al1 Aa1',
  };

  // ---------------- Guard (you on the bottom) ----------------
  P['closed-guard'] = {
    A: '195,174 t165 h170 l1:-53,31 l2:-48,36 a1:@B.h1/1 a2:@B.h2/1',
    B: '243,152 t-108 h-100 f-1 l1:124,2 l2:121,4 ft1:5 ft2:5 a1:@A.hip-6-12/1 a2:@A.hip+2-12/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  P['guard-broken'] = {
    A: '195,174 t165 h170 l1:-72,40 l2:-66,46 a1:@B.nape+2+2/1 a2:@B.e1+0+2/1',
    B: '230,150 t-162 h-172 f-1 l1:118,2 l2:121,4 ft1:5 ft2:5 a1:@148,195/-1 a2:@142,192/-1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  P['hip-bump'] = {
    A: '205,172 t-122 h-115 l1:-30,72 l2:-12,42 a1:@B.front+0-4/1 a2:@140,196/-1',
    B: '242,150 t-82 h-78 f-1 l1:124,2 l2:121,4 ft1:5 ft2:5 a1:@A.k1-4+0/1 a2:@A.k1+0+6/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Ba1 Al1 Aa1',
    arrows: ['B.head+4-10 > B.head+46+30 ~-0.35'],
  };

  P['scissor-sweep'] = {
    A: '196,178 t172 h176 w0.3 l1:-58,180,1,0.45 l2:2,14 a1:@B.front+2+0/1 a2:@B.h1/1',
    B: '240,150 t-124 h-118 f-1 l1:122,2 l2:118,4 ft1:5 ft2:5 a1:@A.hip-2-16/1 a2:@A.k1+2+6/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
    arrows: ['A.an2+6+0 > A.an2-30+0 ~0.3', 'B.head-6-6 > B.head-40+44 ~0.35'],
  };

  P['flower-sweep'] = {
    A: '190,180 t176 h178 l1:-72,-84 l2:4,16 a1:@B.e1/1 a2:@B.front/1',
    B: '236,150 t-112 h-108 f-1 l1:122,2 l2:118,4 ft1:5 ft2:5 a1:@A.hip-4-14/1 a2:@A.hip+2-14/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
    arrows: ['A.an1+8-4 > A.an1+40+70 ~-0.35', 'B.head+0-10 > B.head-50+36 ~0.3'],
  };

  P['kimura-guard'] = {
    A: '200,175 t-142 h-130 l1:-40,55 l2:-20,40 a1:@B.e1+0-2/1 a2:@B.h1+0-2/1',
    B: '244,150 t-128 h-118 f-1 l1:122,2 l2:118,4 ft1:5 ft2:5 a1:@204,194/1 a2:@A.k1-2-4/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Ba1 Al1 Aa1',
    arrows: ['B.h1+8-6 > B.h1+40-50 ~-0.3'],
  };

  P.omoplata = {
    A: '150,170 t-62 h-50 l1:4,4 l2:10,2 a1:@B.hip-4-12/-1 a2:@B.waist+0-4/1',
    B: '226,187 t180 h182 f-1 l1:2,0 l2:-2,0 a1:-78,8 a2:150,180',
    z: 'Bl2 Ba2 Bl1 Bt Ba1 Al2 At Al1 Aa2 Aa1',
  };

  P['open-guard'] = {
    A: '180,184 t180 h182 l1:@B.tummy-2+6/-1 l2:@B.hip-6+2/-1 a1:@B.h1/1 a2:@B.h2/1',
    B: '240,150 t-104 h-100 f-1 l1:120,2 l2:123,0 ft1:5 ft2:5 a1:@A.k1+2-2/1 a2:@A.k2+6-2/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  P.butterfly = {
    A: '178,182 t-104 h-98 l1:@236,180/-1 l2:@240,184/-1 a1:@B.back+0+12/1 a2:@B.e1/1',
    B: '256,150 t-112 h-108 f-1 l1:119,2 l2:121,0 ft1:5 ft2:5 a1:@A.nape+0+4/1 a2:@A.back+2+4/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt At Bl1 Al1 Ba1 Aa1',
  };

  P['butterfly-sweep'] = {
    A: '176,186 t-160 h-150 l1:-40,-58 l2:-10,30 a1:@B.back+0+10/1 a2:@B.e1/1',
    B: '222,124 t-150 h-160 f-1 l1:-25,45 l2:-12,52 a1:@A.nape+2+0/1 a2:150,110',
    z: 'Ba2 Bl2 Aa2 Al2 Bt At Bl1 Al1 Ba1 Aa1',
    arrows: ['B.hip+6-14 > B.hip-60+30 ~0.45'],
  };

  P.dlr = {
    A: '172,186 t180 h182 l1:@B.k1+14+2/-1 l2:@B.hip+2+2/-1 a1:@B.an1-2-10/1 a2:@B.h1/1',
    B: '240,106 t-112 h-120 f-1 l1:@212,196/1 l2:@258,196/1 a1:@A.k2+0-4/-1 a2:@A.k2+4+2/-1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  P.spider = {
    A: '170,186 t180 h182 l1:@B.e1+0+4/-1 l2:@B.e2+4+6/-1 a1:@B.h1/1 a2:@B.h2/1',
    B: '244,108 t-124 h-130 f-1 l1:@224,196/1 l2:@262,196/1 a1:122,128 a2:128,138',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  P['x-guard'] = {
    A: '206,186 t180 h182 l1:@B.k1+12+4/-1 l2:@B.hip-10+6/-1 a1:@B.an1-2-10/1 a2:@B.k1-6+2/1',
    B: '232,100 t-104 h-116 f-1 l1:@208,196/1 l2:@274,190/1 a1:@A.k2+0-6/-1 a2:150,100',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  P['half-guard'] = {
    A: '178,186 t182 h184 w0.3 l1:-12,40 l2:4,12 a1:@B.back+0+8/1 a2:@B.neck+0+4/1',
    B: '206,162 t196 h200 f-1 l1:@222,193/-1 l2:20,6 ft2:0 a1:@140,196/1 a2:@A.head-4+8/1',
    z: 'Ba2 Bl2 Aa2 Al2 At Bt Bl1 Al1 Ba1 Aa1',
  };

  P['knee-shield'] = {
    A: '186,184 t178 h180 w0.3 l1:-62,184,1,0.5 l2:4,14 a1:@B.neck+2+4/1 a2:@B.e1/1',
    B: '236,150 t-140 h-150 f-1 l1:118,2 l2:122,0 ft1:5 ft2:5 a1:@A.hip-6-14/1 a2:@A.chest+4-12/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  P['rubber-guard'] = {
    A: '195,174 t165 h170 l1:-86,188 l2:-62,46 a1:@A.an1+2+2/1 a2:@B.nape+2+2/1',
    B: '230,150 t-164 h-172 f-1 l1:118,2 l2:121,4 ft1:5 ft2:5 a1:@148,195/-1 a2:@142,192/-1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  // ---------------- Pins ----------------
  P.mount = {
    A: '170,163 t-108 h-112 f-1 l1:70,0,0.6,1 l2:66,2,0.6,1 ft1:0 ft2:0 a1:@B.front/-1 a2:@B.front-8+2/-1',
    B: '190,187 t180 h182 l1:2,-2 l2:-40,62 ft2:0 a1:@A.tummy/1 a2:185,180',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Ba1 Al1 Aa1',
  };

  P['s-mount'] = {
    A: '150,164 t-96 h-104 f-1 l1:205,95 l2:62,4,0.6,1 ft2:0 a1:@B.e1+0+0/-1 a2:@B.h1+0+4/1',
    B: '200,187 t180 h182 l1:2,-2 l2:-40,62 ft2:0 a1:-84,-96 a2:185,180',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Ba1 Al1 Aa1',
  };

  P.upa = {
    A: '168,150 t-125 h-135 f-1 l1:70,0,0.6,1 l2:66,2,0.6,1 ft1:0 ft2:0 a1:@122,194/-1 a2:@B.front-8+2/-1',
    B: '196,176 t172 h176 l1:-36,62 l2:-40,64 ft1:0 ft2:0 a1:@A.e1+2+0/1 a2:@A.tummy/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Ba1 Al1 Aa1',
    arrows: ['B.hip+0+10 > B.hip+0-26 ~0', 'A.head-10-10 > A.head-50+30 ~0.3'],
  };

  P.shrimp = {
    A: '164,164 t-104 h-110 f-1 l1:70,0,0.6,1 l2:66,2,0.6,1 ft1:0 ft2:0 a1:@B.front+0+0/-1 a2:@B.front-8+2/-1',
    B: '210,186 t176 h180 w0.3 l1:-60,90 l2:20,-6 ft1:0 a1:@A.hip+4+0/1 a2:@A.k1-6-4/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt At Bl1 Ba1 Al1 Aa1',
    arrows: ['B.hip+14+0 > B.hip+44+0 ~0.25'],
  };

  P['side-control'] = {
    view: 'top',
    A: '174,170 t-90 w1 l1:75,85 l2:105,95 a1:@204,96/1 a2:@B.head-6+4/-1',
    B: '212,114 t180 w1 l1:-6,4 l2:8,-4 a1:-125,-165 a2:@A.neck+6+8/1',
    z: 'Bl1 Bl2 Ba1 Bt Ba2 Al1 Al2 Aa1 At Aa2',
  };

  P['north-south'] = {
    view: 'top',
    A: '138,112 t0 w1 l1:175,182 l2:190,178 a1:@B.s1+6-4/1 a2:@B.s2+6+4/-1',
    B: '252,112 t180 w1 l1:-4,2 l2:4,-2 a1:-150,-170 a2:150,170',
    z: 'Bl1 Bl2 Bt Ba1 Ba2 Al1 Al2 At Aa1 Aa2',
  };

  P.kesa = {
    view: 'top',
    A: '182,152 t-122 w0.8 l1:155,110 l2:60,96 a1:@B.head-10-2/-1 a2:@B.e2+0+0/1',
    B: '226,116 t180 w1 l1:-6,4 l2:8,-4 a1:-130,-170 a2:110,40',
    z: 'Bl1 Bl2 Ba1 Bt Ba2 Al1 Al2 At Aa1 Aa2',
  };

  P['knee-on-belly'] = {
    A: '186,120 t-105 h-115 f-1 l1:@B.tummy+2-2/1 l2:75,5 ft2:0 a1:@B.front/-1 a2:@B.hip+2-8/1',
    B: '200,187 t180 h182 l1:2,-2 l2:-35,60 ft2:0 a1:@A.k1/1 a2:200,190',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  P.back = {
    A: '148,182 t-100 h-92 l1:-25,40 l2:-30,45 a1:@B.front+2+6/1 a2:@B.front-2-6/1',
    B: '182,183 t-96 h-88 l1:-22,28 l2:-26,32 a1:100,40 a2:95,30',
    z: 'Aa2 Al2 Ba2 Bl2 At Bt Al1 Bl1 Aa1 Ba1',
  };

  P['back-flat'] = {
    A: '214,166 t182 h186 f-1 l1:30,150,1,0.7 l2:24,140,1,0.7 a1:@B.chin+4+4/-1 a2:@B.nape+2+0/-1',
    B: '212,186 t180 h178 f-1 l1:2,0 l2:-2,2 ft1:0 ft2:0 a1:150,60 a2:160,40',
    z: 'Bl2 Ba2 Bt Bl1 Al2 Aa2 At Al1 Ba1 Aa1',
  };

  P.turtle = {
    A: '252,118 t194 h200 f-1 l1:96,2 l2:100,0 ft1:0 ft2:0 a1:@B.chest+0+14/1 a2:@B.chest+6+18/1',
    B: '226,150 t188 h205 f-1 l1:106,0 l2:110,2 ft1:0 ft2:0 a1:118,180 a2:112,186',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  P['front-headlock'] = {
    A: '112,152 t-22 h-12 l1:118,0 l2:122,4 ft1:0 ft2:0 a1:@B.chin-2+6/1 a2:@B.back-6+2/1',
    B: '236,150 t192 h214 f-1 l1:104,2 l2:110,0 ft1:0 ft2:0 a1:120,190 a2:@A.k1+4+0/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };

  // ---------------- Submissions ----------------
  P.armbar = {
    view: 'top',
    A: '160,82 t-90 w1 l1:80,95 l2:100,85 a1:@B.h1+5+6/1 a2:@B.h1-5+8/-1',
    B: '222,116 t180 w1 l1:-4,2 l2:6,-2 a1:-82,-84 a2:150,170',
    z: 'Bl1 Bl2 Ba2 Bt Al1 Al2 At Ba1 Aa1 Aa2',
  };

  P.triangle = {
    A: '172,165 t162 h168 l1:-80,200,1,0.45 l2:-88,190,1,0.6 a1:@B.nape+2-4/1 a2:@B.e1/1',
    B: '226,148 t196 h195 f-1 l1:118,2 l2:115,4 ft1:5 ft2:5 a1:@150,193/-1 a2:@A.chest/1',
    z: 'Ba2 Bl2 Al2 Bt Bl1 Ba1 At Al1 Aa1 Aa2',
  };

  P.rnc = {
    A: '146,182 t-98 h-86 l1:-25,40 l2:-30,45 a1:@B.chin+6+6/1 a2:@B.nape+0-2/1',
    B: '182,183 t-100 h-80 l1:-22,28 l2:-26,32 a1:@A.e1+4+2/-1 a2:95,30',
    z: 'Aa2 Al2 Ba2 Bl2 At Bt Al1 Bl1 Aa1 Ba1',
  };

  P.americana = {
    view: 'top',
    A: '174,170 t-90 w1 l1:75,85 l2:105,95 a1:@B.e1+2+2/1 a2:@B.h1+0+0/-1',
    B: '212,114 t180 w1 l1:-6,4 l2:8,-4 a1:-90,180 a2:@A.neck+6+8/1',
    z: 'Bl1 Bl2 Bt Ba2 Al1 Al2 At Ba1 Aa1 Aa2',
    arrows: ['B.h1+0-4 > B.h1+40+10 ~-0.4'],
  };

  P['kimura-side'] = {
    view: 'top',
    A: '174,170 t-90 w1 l1:75,85 l2:105,95 a1:@B.e1+2+2/1 a2:@B.h1+0+0/-1',
    B: '212,114 t180 w1 l1:-6,4 l2:8,-4 a1:-90,0 a2:@A.neck+6+8/1',
    z: 'Bl1 Bl2 Bt Ba2 Al1 Al2 At Ba1 Aa1 Aa2',
    arrows: ['B.h1+4+0 > B.h1-36-14 ~0.4'],
  };

  P['arm-triangle'] = {
    view: 'top',
    A: '150,160 t-70 w1 l1:95,85 l2:120,100 a1:@B.head-2-16/1 a2:@B.head-8+10/-1',
    B: '212,114 t180 w1 l1:-6,4 l2:8,-4 a1:-120,150 a2:110,40',
    z: 'Bl1 Bl2 Bt Ba2 Ba1 Al1 Al2 At Aa1 Aa2',
  };

  P['heel-hook'] = {
    view: 'top',
    A: '180,110 t180 w1 l1:-8,48 l2:20,0 a1:@B.an2+4-8/-1 a2:@B.an2+4+8/1',
    B: '255,118 t0 w1 l1:40,140 l2:180,180 a1:60,100 a2:-50,-20',
    z: 'Bt Ba1 Ba2 Bl1 At Al2 Bl2 Al1 Aa1 Aa2',
  };

  P.saddle = {
    view: 'top',
    A: '180,110 t180 w1 l1:6,60 l2:28,-62 a1:@B.an2+4-8/-1 a2:@B.an2+4+8/1',
    B: '255,118 t0 w1 l1:40,140 l2:180,180 a1:60,100 a2:-50,-20',
    z: 'Bt Ba1 Ba2 Bl1 At Al2 Bl2 Al1 Aa1 Aa2',
  };

  P['straight-ankle'] = {
    A: '236,184 t-62 h-70 f-1 l1:@152,174/1 l2:@168,193/1 a1:@B.an1+2+0/1 a2:@B.an1+6+6/1',
    B: '108,187 t180 h182 l1:-8,-5 l2:-35,60 ft2:0 a1:190,180 a2:170,190',
    z: 'Bl2 Ba2 Bt Al2 Bl1 Ba1 At Al1 Aa2 Aa1',
  };

  P.kneebar = {
    A: '176,174 t-4 h-2 f-1 l1:186,176 l2:178,184 a1:@B.an1+2-4/-1 a2:@B.an1+6+2/1',
    B: '128,187 t180 h182 l1:-2,-4 l2:-40,62 ft2:0 a1:190,180 a2:170,190',
    z: 'Bl2 Ba2 Bt Ba1 Al2 Bl1 At Al1 Aa2 Aa1',
  };

  P['waki-gatame'] = {
    view: 'top',
    A: '150,56 t180 w0.6 l1:20,10 l2:-10,0 a1:@B.h1+4+0/1 a2:@B.h1+8+6/-1',
    B: '226,124 t180 w1 f-1 l1:-6,4 l2:8,-4 a1:-92,-94 a2:110,40',
    z: 'Bl1 Bl2 Ba2 Bt Ba1 Al2 Al1 At Aa2 Aa1',
  };

  // ---------------- Judo: tori (you) throws uke ----------------
  P['j-grip'] = {
    A: '130,104 t-86 h-84 l1:@146,196/-1 l2:@108,196/-1 a1:@B.front-2-4/1 a2:@B.e1+0+4/1',
    B: '210,104 t-94 h-96 f-1 l1:@194,196/1 l2:@232,196/1 a1:@A.front+2-4/-1 a2:@A.e1+0+4/-1',
  };

  P['j-pull'] = {
    A: '126,104 t-96 h-94 l1:@146,196/-1 l2:@104,196/-1 a1:@B.front-2-4/1 a2:@B.e1+0+4/1',
    B: '206,108 t-122 h-130 f-1 l1:@190,196/1 l2:@232,198/1 a1:@A.front+2-4/-1 a2:@A.e1+0+4/-1',
    arrows: ['B.head+6-8 > B.head-34+16 ~0.3'],
  };

  P['j-push'] = {
    A: '134,104 t-74 h-70 l1:@154,196/-1 l2:@108,196/-1 a1:@B.front-2-4/1 a2:@B.e1+0+4/1',
    B: '214,104 t-66 h-60 f-1 l1:@196,196/1 l2:@230,196/1 a1:@A.front+2-4/-1 a2:@A.e1+0+4/-1',
    arrows: ['B.head-10-6 > B.head+30+14 ~-0.3'],
  };

  P['j-turn-in'] = {
    A: '190,122 t-98 h-110 f-1 l1:@178,196/1 l2:@204,196/1 a1:@B.h1+0+0/-1 a2:@B.waist+2+0/1',
    B: '220,104 t-104 h-112 f-1 l1:@204,196/1 l2:@240,196/1 a1:168,176 a2:@A.back+0-6/1',
    z: 'Aa2 Ba2 Bl2 Bt Al2 At Bl1 Al1 Ba1 Aa1',
    arrows: ['B.head+0-14 > B.head-40-4 ~-0.3'],
  };

  P['j-hip-throw'] = {
    A: '196,112 t-130 h-150 f-1 l1:@184,196/1 l2:@212,196/1 a1:@B.e1+0+0/-1 a2:@B.waist+6+0/1',
    B: '206,88 t168 h160 f-1 l1:-28,-18 l2:-40,-8 a1:150,120 a2:@A.back+4+0/1',
    z: 'Aa2 Ba2 Bl2 Bt Al2 At Bl1 Al1 Ba1 Aa1',
    arrows: ['B.an1+10-10 > B.an1-40-60 ~0.4'],
  };

  P['j-seoi'] = {
    A: '196,136 t-124 h-150 f-1 l1:@172,196/1 l2:@214,196/1 a1:@B.e1+0+0/-1 a2:@B.h1+2+0/1',
    B: '214,96 t162 h150 f-1 l1:-18,8 l2:-28,20 a1:146,150 a2:70,100',
    z: 'Ba2 Aa2 Bl2 Bt Al2 At Bl1 Al1 Ba1 Aa1',
    arrows: ['B.an1+10-10 > B.an1-30-70 ~0.4'],
  };

  P['j-harai'] = {
    A: '186,112 t-146 h-170 f-1 l1:-8,14 l2:@194,196/1 a1:@B.e1+0+0/-1 a2:@B.back+4+0/1',
    B: '214,98 t160 h156 f-1 l1:-22,-12 l2:-14,-2 a1:150,130 a2:60,80',
    z: 'Ba2 Aa2 Bl2 Bt Al2 At Al1 Bl1 Ba1 Aa1',
    arrows: ['A.an1+10+10 > A.an1+20-40 ~-0.3'],
  };

  P['j-uchimata'] = {
    A: '184,116 t-150 h-175 f-1 l1:-58,-56 l2:@192,196/1 a1:@B.e1+0+0/-1 a2:@B.back+4+0/1',
    B: '206,86 t150 h146 f-1 l1:-60,-30 l2:20,70 a1:150,130 a2:60,80',
    z: 'Ba2 Aa2 Bl2 Bt Al2 At Al1 Bl1 Ba1 Aa1',
    arrows: ['B.an1+6-8 > B.an1-50-30 ~0.4'],
  };

  P['j-osoto'] = {
    A: '168,108 t-58 h-50 l1:28,56 l2:@156,196/-1 a1:@B.front+0+0/1 a2:@B.e1+0+0/1',
    B: '222,116 t-52 h-44 f-1 l1:150,124 l2:@238,196/1 a1:@A.e1+0-2/-1 a2:150,160',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Ba1 Aa1',
    arrows: ['A.an1+10+0 > A.an1+0-50 ~-0.4', 'B.head-10-6 > B.head+24+40 ~-0.3'],
  };

  P['j-ouchi'] = {
    A: '160,112 t-60 h-52 l1:30,96 l2:@138,196/-1 a1:@B.front+0+0/1 a2:@B.e1+0+0/1',
    B: '222,116 t-62 h-54 f-1 l1:@194,196/1 l2:122,150 a1:@A.e1+0-2/-1 a2:150,160',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Ba1 Aa1',
    arrows: ['A.an1+0+4 > A.an1-34-10 ~0.3', 'B.head-10-6 > B.head+24+40 ~-0.3'],
  };

  P['j-kouchi'] = {
    A: '146,108 t-74 h-70 l1:58,52 l2:@124,196/-1 a1:@B.front+0+0/1 a2:@B.e1+0+0/1',
    B: '218,110 t-66 h-60 f-1 l1:@194,190/1 l2:@236,196/1 a1:@A.e1+0-2/-1 a2:150,160',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Ba1 Aa1',
    arrows: ['B.an1+0+8 > B.an1-34+6 ~0.2'],
  };

  P['j-deashi'] = {
    A: '134,104 t-84 h-80 l1:@B.an1-6+2/-1 l2:@112,196/-1 a1:@B.front+0+0/1 a2:@B.e1+0+0/1',
    B: '212,106 t-108 h-112 f-1 l1:@180,190/1 l2:@236,196/1 a1:@A.e1+0-2/-1 a2:150,160',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Ba1 Aa1',
    arrows: ['B.an1-10+10 > B.an1+30+6 ~0.2', 'B.head+0-10 > B.head-30+30 ~0.3'],
  };

  P['j-taiotoshi'] = {
    A: '178,128 t-104 h-120 f-1 l1:@B.an1-2-12/1 l2:@168,196/1 a1:@B.e1+0+0/-1 a2:@B.front+0+0/-1',
    B: '226,100 t-136 h-150 f-1 l1:@214,196/1 l2:@250,196/1 a1:120,140 a2:@A.back+0+0/1',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Ba1 Aa1',
    arrows: ['B.head+0-10 > B.head-60+60 ~0.35'],
  };

  P['j-kataguruma'] = {
    A: '170,112 t-90 w1 l1:@202,196/-1 l2:@138,196/1 a1:@B.k1+0+4/-1 a2:@B.e1+0+0/1',
    B: '220,40 t180 h170 f-1 l1:30,88 l2:16,80 a1:110,100 a2:120,90',
    z: 'Ba2 Bl2 Al2 Al1 At Bt Bl1 Ba1 Aa1 Aa2',
  };

  P['j-tomoe'] = {
    A: '206,182 t174 h176 l1:@B.tummy+0+4/-1 l2:-30,60 a1:@B.e1+0+0/1 a2:@B.front+2+0/1',
    B: '216,96 t178 h176 f-1 l1:-62,-70 l2:-50,-40 a1:150,130 a2:140,120',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
    arrows: ['B.hip+0-14 > B.hip-110+10 ~0.45'],
  };

  P['j-sumi'] = {
    A: '196,182 t-160 h-160 l1:@B.k1+2+6/-1 l2:-20,40 a1:@B.back+2+6/1 a2:@B.e1+0+0/1',
    B: '222,110 t-150 h-160 f-1 l1:-40,60 l2:-20,30 a1:@A.nape+0+0/1 a2:150,110',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Ba1 Aa1',
    arrows: ['B.hip+6-14 > B.hip-80+30 ~0.45'],
  };

  P['j-yoko'] = {
    A: '178,182 t196 h196 w0.3 l1:2,0 l2:8,6 a1:@B.e1+0+0/1 a2:@B.front+0+0/1',
    B: '234,112 t-142 h-150 f-1 l1:@220,196/1 l2:@262,196/1 a1:120,140 a2:150,160',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
    arrows: ['B.head+0-10 > B.head-60+60 ~0.35'],
  };

  P['j-makikomi'] = {
    A: '196,140 t-172 h-182 f-1 l1:@184,196/1 l2:@216,196/1 a1:@B.e1+0+0/-1 a2:160,196',
    B: '218,108 t176 h168 f-1 l1:-34,-24 l2:-46,-14 a1:170,176 a2:60,80',
    z: 'Ba2 Aa2 Bl2 Bt Al2 At Bl1 Al1 Ba1 Aa1',
    arrows: ['B.an1+10-10 > B.an1-60-20 ~0.4'],
  };

  P['j-uranage'] = {
    A: '186,140 t-126 h-140 l1:@226,196/-1 l2:@196,196/-1 a1:@B.waist+0+0/1 a2:@B.tummy+0+0/1',
    B: '170,68 t160 h150 f-1 l1:-38,-20 l2:-50,-30 a1:130,110 a2:150,120',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Ba1 Aa1',
    arrows: ['B.an1+10+0 > B.an1-40-60 ~0.4'],
  };

  P['j-lift'] = {
    A: '196,116 t-94 h-100 f-1 l1:@182,196/1 l2:@210,196/1 a1:@B.tummy+0+0/-1 a2:@B.tummy+4+6/-1',
    B: '170,90 t-92 h-96 f-1 l1:96,100 l2:106,110 a1:120,150 a2:80,100',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 At Al1 Ba1 Aa1',
    arrows: ['B.an1+0+10 > B.an1+0-20 ~0'],
  };

  P['j-landed'] = {
    A: '146,104 t-98 h-110 l1:@164,196/-1 l2:@128,196/-1 a1:@B.h1+0+0/1 a2:@B.e1-4+4/1',
    B: '206,187 t180 h182 l1:-20,10 l2:-40,50 ft2:0 a1:-70,-72 a2:170,190',
    z: 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1',
  };
})(window.Figures.poses);
