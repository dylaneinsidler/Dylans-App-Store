// Farmers markets around Southeast Florida, for the small Farmers Markets square beside the Local Events card: one line
// each for every market in the next three weeks (in season), soonest first, today's in red. Checked October 10-11, 2026 (from each market's
// own page where it has one, otherwise local listings: South Florida on the Cheap, The Palm Beaches, Hoodline, Pinecrest
// Gardens). Hours change: worth a quick look before driving over.
//
// Each market:
//   name, city:  what it's called, and where
//   days:        'Sat', 'Sun', 'Mon'... (several if it's on more than one day)
//   weeks:       optional, which weeks of the month, like [1, 3] for the 1st and 3rd
//   time:        its hours
//   season:      optional, ['10-03', '05-22'] (month-day it starts, month-day it ends); left out = all year
//   where:       optional, the address or place
//   short:       the name on the card (it's a small square)
window.CORKBOARD_MARKETS = [
  { name: 'Las Olas Oceanside Park Farmers Market', short: 'FTL Beach (LOOP)', city: 'Fort Lauderdale Beach', days: ['Sat'], time: '9 AM - 4 PM', where: 'Las Olas Oceanside Park, 3000 E Las Olas Blvd' },
  { name: 'Yellow Green Farmers Market', short: 'Yellow Green', city: 'Hollywood', days: ['Sat', 'Sun'], time: '10 AM - 7 PM', where: '1940 N 30th Rd' },
  { name: 'Downtown Boca Green Market', short: 'Boca Green Market', city: 'Boca Raton', days: ['Sun'], time: '8 AM - 12:30 PM', season: ['10-04', '05-02'], where: 'Royal Palm Place, Mizner Blvd' },
  { name: 'Legion Park Farmers Market', short: 'Legion Park (Miami)', city: 'Miami (Upper East Side)', days: ['Sat'], time: '9 AM - 2 PM', where: '6601 Biscayne Blvd' },
  { name: 'Coconut Grove Farmers Market', short: 'Coconut Grove', city: 'Coconut Grove', days: ['Sat'], time: '10 AM - 6:30 PM', where: '3300 Grand Ave' },
  { name: 'Pinecrest Gardens Farmers Market', short: 'Pinecrest Gardens', city: 'Pinecrest', days: ['Sun'], time: '8:30 AM - 1:30 PM', where: '11000 Red Rd' },
  { name: 'River Market', short: 'River Market (FTL)', city: 'Fort Lauderdale', days: ['Wed'], weeks: [1, 3], time: '4 - 9 PM', where: 'on the Riverwalk' },
  { name: 'Imperial Point Market', short: 'Imperial Point (FTL)', city: 'Fort Lauderdale', days: ['Thu'], time: '10 AM - 3 PM', where: '6401 N Federal Hwy' },
  { name: 'Plantation Volunteer Park Market', short: 'Plantation', city: 'Plantation', days: ['Sat'], time: '9 AM - 2 PM', where: '12050 W Sunrise Blvd' },
  { name: 'Tamarac Park Market', short: 'Tamarac', city: 'Tamarac', days: ['Sun'], time: '9 AM - 2 PM', where: '7501 N University Dr' },
  { name: 'Parkland Farmers Market', short: 'Parkland', city: 'Parkland', days: ['Sun'], weeks: [1, 3], time: '9 AM - 1 PM', season: ['11-01', '04-30'], where: 'Equestrian Center, 8350 Ranch Rd' },
  { name: 'Delray Beach GreenMarket', short: 'Delray GreenMarket', city: 'Delray Beach', days: ['Sat'], time: '9 AM - 2 PM', season: ['10-24', '05-31'], where: 'Old School Square' },
  { name: 'West Palm Beach GreenMarket', short: 'West Palm Beach', city: 'West Palm Beach', days: ['Sat'], time: '8:30 AM - 1:30 PM', season: ['10-03', '05-22'], where: '100 N Clematis St' },
  { name: 'Royal Palm Beach Green Market', short: 'Royal Palm Beach', city: 'Royal Palm Beach', days: ['Sat'], time: '9 AM - 1 PM', season: ['10-17', '04-24'], where: 'Village Hall' },
  { name: 'The Gardens GreenMarket', short: 'Gardens GreenMarket', city: 'Palm Beach Gardens', days: ['Sun'], time: '8 AM - 1 PM', season: ['10-04', '05-30'], where: 'City Hall, 10500 N Military Trail' },
];
