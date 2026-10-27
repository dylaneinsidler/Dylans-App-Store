// Dylan's Athletics, the left screen: run clubs, archery and pickleball around Fort Lauderdale, each place pinned on the
// map. (The open mats, on the right screen, are in mats.js.) Gathered October 14-15, 2026; clubs move spots and times,
// so their Instagram or website has the week's details. Map positions from OpenStreetMap's address search.
//
//   places: id, name, at [latitude, longitude], kind 'run' | 'archery' | 'pickle', and for archery and pickleball
//           what it is (what), when, cost, and where (the address). A place's number on the map is its place in its list.
//   runs:   the weekly group runs (moved here from Dylan's Corkboard on October 15): club, day, time, what, place (an id).
window.ATHLETICS = {
  checked: '2026-10-15',
  places: [
    // ---- Run clubs' meeting points ----
    { id: 'carter', kind: 'run', name: 'Joseph C. Carter Park', at: [26.135508, -80.161851] },
    { id: 'tarpon', kind: 'run', name: 'Tarpon River Brewing (Riverwalk)', at: [26.11462, -80.145955] },
    { id: 'tommy', kind: 'run', name: 'Tommy Bahama, Las Olas', at: [26.119215, -80.133896] },
    { id: 'tunnel', kind: 'run', name: 'Tunnel Top Park, Las Olas', at: [26.1193, -80.1374] },
    { id: 'parker', kind: 'run', name: 'Holiday Park, by the Parker', at: [26.134328, -80.136187] },
    { id: 'galleria', kind: 'run', name: 'Galleria Mall, west end', at: [26.136262, -80.1185] },
    { id: 'lifshey', kind: 'run', name: 'Earl Lifshey Ocean Park', at: [26.187659, -80.095963] },
    { id: 'pride', kind: 'run', name: 'Pride Center, Wilton Manors', at: [26.154719, -80.132983] },

    // ---- Archery (Dylan's picks, October 15: Fort Lauderdale Archers, Gold Coast Archers and FAU's club; plus the
    //      public range at Markham Park) ----
    { id: 'ftla', kind: 'archery', name: 'Fort Lauderdale Archers', at: [26.106267, -80.209325], where: '4590 Peters Rd, Plantation',
      what: 'Club: 28-target field range, 3-D course, lighted front range (10-65 yd)', when: 'Members 24/7; a board member is usually there 8-10 am',
      cost: '$300 a year (gate key)' },
    { id: 'goldcoast', kind: 'archery', name: 'Gold Coast Archers', at: [26.4587, -80.205], where: '10875 W Atlantic Ave, Delray Beach',
      what: 'Club: 14-target field range and a 3-D range', when: 'Members; monthly shoots', cost: 'Membership' },
    { id: 'fau', kind: 'archery', name: 'FAU Owls Archery Club', at: [26.374344, -80.102724], where: 'Shoots at Gold Coast Archers',
      what: "Florida Atlantic University's student club", when: 'Fri and Sun 4-6 pm (last listed 2016: check)', cost: 'Student club' },
    { id: 'markham', kind: 'archery', name: 'Markham Park Archery Range', at: [26.134561, -80.351901], where: '16001 W State Rd 84, Sunrise',
      what: 'Public range, 10-50 yd, targets provided (bring your bow)', when: 'Wed 1-5 pm, Sat-Sun 8 am-5 pm', cost: '$7 an hour' },

    // ---- Pickleball: The Fort, and the city's free courts ----
    { id: 'fort', kind: 'pickle', name: 'The Fort', at: [26.081695, -80.152496], where: '891 SW 34th St',
      what: '43 courts (14 covered), open play, clinics, leagues', when: 'Daily 6 am-10 pm', cost: 'Day pass or membership; book in its app' },
    { id: 'holiday', kind: 'pickle', name: 'Holiday Park', at: [26.133722, -80.132638], where: '1150 G Harold Martin Dr',
      what: '6 courts', when: 'First come', cost: 'free' },
    { id: 'english', kind: 'pickle', name: 'George English Park', at: [26.139493, -80.116273], where: '1101 Bayview Dr',
      what: '6-8 courts', when: 'First come (open play mornings)', cost: 'free' },
    { id: 'benenson', kind: 'pickle', name: 'Benenson Park', at: [26.10361, -80.19038], where: '1330 SW 33rd Terrace',
      what: '6 courts', when: 'First come', cost: 'free' },
    { id: 'osswald', kind: 'pickle', name: 'Osswald Park', at: [26.157123, -80.168611], where: '2220 NW 21st Ave',
      what: '4 courts', when: 'First come', cost: 'free' },
    { id: 'cartercourts', kind: 'pickle', name: 'Joseph C. Carter Park', at: [26.1349, -80.1612], where: '1450 W Sunrise Blvd',
      what: '3 courts', when: 'First come', cost: 'free' },
    { id: 'hardy', kind: 'pickle', name: 'Florence C. Hardy Park', at: [26.112081, -80.144186], where: '1100 S Andrews Ave',
      what: '2 courts', when: 'First come', cost: 'free' },
  ],
  runs: [
    { club: 'Tropical Run Crew', day: 'Tue', time: '6:15 AM', what: 'track', place: 'carter' },
    { club: 'Tarpon River Run Club', day: 'Tue', time: '6:30 PM', what: '2 mi', place: 'tarpon' },
    { club: 'Fort Lauderdale Run Club', day: 'Wed', time: '6:30 PM', what: '2 mi', place: 'tommy' },
    { club: 'Tropical Run Crew', day: 'Wed', time: '6:40 PM', what: '3 mi social', place: 'parker' },
    { club: 'Front Runners & Walkers', day: 'Wed', time: '7:00 PM', what: '3-6 mi', place: 'parker' },
    { club: 'Tarpon River Run Club', day: 'Thu', time: '5:30 AM', place: 'carter' },
    { club: 'We Run Las Olas', day: 'Thu', time: '6:45 PM', what: '3 mi', place: 'tunnel' },
    { club: 'Tropical Run Crew', day: 'Sat', time: '6:15 AM', what: 'long run', place: 'parker' },
    { club: 'Front Runners & Walkers', day: 'Sat', time: '7:30 AM', what: '3-6 mi', place: 'galleria' },
    { club: 'Nameless Run Club', day: 'Sat', time: '9:30 AM', what: '1-3 mi', where: 'spot posted on Instagram' },
    { club: 'Tarpon River Run Club', day: 'Sun', time: '7:45 AM', what: 'beach run', place: 'lifshey' },
    { club: 'Front Runners & Walkers', day: 'Sun', time: '6:00 PM', what: '3-6 mi', place: 'pride' },
  ],
};
