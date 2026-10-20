// The weekend open mats, Jupiter to Miami and west. Gi / no-gi, prices and notes checked against the gyms' own schedules on
// October 9, 2026 where they publish them (most don't say gi or no-gi for their open mat: those stay black). Each gym once, north to south (its number is its pin on the map),
// with its Saturday and Sunday open mats.
//
// From Let's Roll (letsroll.co), the open-mat directory: each gym's own page there, read October 9, 2026. Times are
// what the gyms list; always worth a quick look at the gym's Instagram before driving over.
//
// What Let's Roll doesn't say, fill in yourself and it shows on the papers:
//   price: 'free', or what it costs ('$20'). Left out: "price not listed".
//   gi:    'gi', 'nogi' or 'both', on a session. Left out: "gi or no-gi not listed".
// (Free from Let's Roll's own city listings: Miami Martial Arts South Beach and Silver Fox 561.)
//
// Add a gym the same way; ig is its Instagram handle, at is [latitude, longitude] (in Google Maps, right-click the
// spot and click the numbers at the top to copy them).
//
// phone: the gym's own number, checked October 11, 2026 on the gym's own website (the number in its header or
// contact section), except Couchon BJJ (its site has none: Yelp and BJJ Metrics both list it) and Nomad Studio (its
// Google listing, via Atly). On the desktop it shows when the mouse rests on a gym; on the phone it's the Call button.
// Leave it out when you can't confirm it. 10th Planet Boca (818), 10th Planet Pompano (415), Couchon (718) and Miloki
// Flow (239) aren't South Florida area codes, but they're the numbers those gyms give.

window.OPEN_MATS = {
  checked: '2026-10-09',
  gyms: [
    { name: 'Marcelo Cohen BJJ', city: 'Tequesta', street: '265 US-1', phone: '(561) 856-8875', at: [26.958264, -80.084992], ig: 'mcbjj_tequesta',
      sat: [{ from: '11:00', to: '12:00' }], note: 'members only' },
    // From Dylan (October 9, 2026). Its own site doesn't list the open mat's time; the gym is open Saturdays 9 to 1.
    { name: 'Gracie Barra Jupiter', city: 'Jupiter', street: '400 Toney Penna Dr, Ste D1', phone: '(561) 203-7064', at: [26.925899, -80.099921],
      note: 'weekend open mat time not listed yet' },
    { name: 'Silver Fox BJJ 561', city: 'West Palm Beach', street: '3650 Shawnee Ave, Ste 4', phone: '(561) 269-3323', at: [26.706021, -80.096654], price: 'free',
      sat: [{ from: '12:30', to: '14:00' }] },
    { name: 'Rodriguez BJJ', city: 'Wellington', street: '3141 Fortune Way', phone: '(561) 246-8503', at: [26.635034, -80.227112], ig: 'rbjjteam',
      sun: [{ from: '10:00', to: '11:00' }, { from: '12:00', to: '13:30' }] },
    { name: 'Senjutsu Martial Arts', city: 'Greenacres', street: '6680 Lantana Rd, Unit 8', phone: '(561) 452-5188', at: [26.588357, -80.149369], ig: 'senjutsu_martialarts',
      sat: [{ from: '13:00', to: '14:30' }] },
    { name: 'Xcell Jiu Jitsu', city: 'Boynton Beach', street: '975 Gateway Blvd', phone: '(561) 619-6969', at: [26.550752, -80.07504], ig: 'xcelljiujitsu',
      sat: [{ from: '10:00', to: '12:00' }] },
    { name: 'Fight Sports Club Boynton', city: 'Boynton Beach', street: '11700 S Military Trl, Unit 307', phone: '(561) 336-4252', at: [26.508935, -80.121537], ig: 'fightsportsclubboyntonbeach',
      sat: [{ from: '11:00', to: '12:30', gi: 'both' }] },
    { name: 'RMBJJ Academy', city: 'Delray Beach', street: '4900 Linton Blvd, Ste 13', phone: '(561) 455-2645', at: [26.439265, -80.119206], ig: 'rmbjjacademy',
      sat: [{ from: '10:00', to: '12:00', gi: 'gi' }], sun: [{ from: '10:00', to: '12:00' }], note: 'white belt 3 stripes and up' },
    { name: 'Patriot BJJ', city: 'Delray Beach', street: '3205 S Federal Hwy, Bay 3', phone: '(561) 666-9864', at: [26.42489, -80.07333],
      sat: [{ from: '11:00', to: '12:30' }] },
    // From Dylan (October 9, 2026). No-gi only, like every 10th Planet; its weekend open mat time isn't listed anywhere yet.
    { name: '10th Planet Boca Raton', city: 'Boca Raton', street: '170 Yamato Rd', phone: '(818) 430-7345', at: [26.394444, -80.083081], ig: '10thplanetbocaraton',
      note: 'no-gi; weekend open mat time not listed yet' },
    { name: 'Renzo Gracie Boca Raton', city: 'Boca Raton', street: '9045 La Fontana Blvd, #116', phone: '(561) 400-7675', at: [26.380505, -80.187818], ig: 'renzogracieboca',
      sat: [{ from: '11:30', to: '12:30', gi: 'nogi' }] },
    // From Dylan (October 9, 2026): 11 AM. The end time isn't known. October 19, 2026: Saturday is a gi class, not an open
    // mat, but keep it on the list; it's free for him.
    { name: 'BTT Boca (Brazilian Top Team)', city: 'Boca Raton', street: '450 NE 20th St, Ste 109', phone: '(561) 368-4123', at: [26.367294, -80.079403],
      price: 'free', sat: [{ from: '11:00', to: '12:30', gi: 'gi' }], note: 'a gi class, not an open mat; end time not listed' },
    { name: 'Denys Darzi BJJ', city: 'Boca Raton', street: '9144 Glades Rd', phone: '(561) 503-8440', at: [26.3664607, -80.1881822], ig: 'denysdarzibjj',
      sat: [{ from: '09:00', to: '10:30' }] },
    { name: 'Kimura BJJ', city: 'Boca Raton', street: '23269 FL-7, #117', phone: '(561) 409-6660', at: [26.32666, -80.203436], ig: 'kimurabjjusaofficial',
      sat: [{ from: '12:15', to: '13:15', gi: 'nogi' }] },
    { name: 'Fight Sports Deerfield', city: 'Deerfield Beach', street: '3650 SW 10th St, #2D', phone: '(561) 344-7990', at: [26.3195668, -80.1002777], ig: 'fightsportsdeerfieldbeach',
      sat: [{ from: '11:00', to: '13:00' }], note: 'at another spot for now: see Instagram' },
    { name: 'Elite Force BJJ', city: 'Lighthouse Point', street: '4752 N Federal Hwy', phone: '(954) 298-7126', at: [26.28911, -80.09536],
      sat: [{ from: '10:00', to: '11:30' }] },
    { name: 'Alliance Coral Springs', city: 'Coral Springs', street: '4674 Coral Ridge Dr', phone: '(954) 261-3808', at: [26.288652, -80.282436], ig: 'alliancecs',
      sat: [{ from: '10:00', to: '11:00' }], sun: [{ from: '09:30', to: '11:00' }] },
    { name: 'Silver Fox Coral Springs', city: 'Coral Springs', street: '9750 W Sample Rd', phone: '(954) 909-9895', at: [26.272615, -80.256422], ig: 'silverfoxbjjcs',
      sun: [{ from: '11:00', to: '12:30' }] },
    { name: 'Coral Springs BJJ', city: 'Coral Springs', street: '9645 W Sample Rd', phone: '(954) 255-3332', at: [26.272311, -80.254802], ig: 'coralspringsbjj',
      sun: [{ from: '10:00', to: '11:30' }], note: 'adults, 16 and up' },
    // From Dylan (October 9, 2026). Let's Roll lists its open mats on weekdays only (Tue and Thu 7:30 PM, Fri 6 AM).
    { name: '10th Planet Pompano Beach', city: 'Pompano Beach', street: '150 SW 5th Ct', phone: '(415) 307-0948', at: [26.223388, -80.12536],
      note: 'no-gi; open mats Tue and Thu 7:30 PM, Fri 6 AM' },
    { name: 'A&M Jiu-Jitsu', city: 'Fort Lauderdale', street: '5300 Powerline Rd', phone: '(954) 900-6197', at: [26.1922868, -80.1534993],
      sun: [{ from: '12:00', to: '13:30' }] },
    { name: 'Killer Bees South Florida', city: 'Lauderhill', street: '5272 N University Dr', phone: '(954) 282-1030', at: [26.189591, -80.251377], ig: 'killerbeessouthflorida',
      sat: [{ from: '10:00', to: '12:00' }] },
    // From Dylan (October 9, 2026). Carbon Submission Grappling, no-gi only: its own schedule (gymdesk), Saturday 10:30 to 1:30.
    // Free for him (October 19, 2026).
    { name: 'Carbon SG (Carbon Grappling)', city: 'Fort Lauderdale', street: '331 E Commercial Blvd', phone: '(954) 998-3524', at: [26.188997, -80.125145], ig: 'carbongrappling', price: 'free',
      sat: [{ from: '10:30', to: '13:30', gi: 'nogi' }] },
    { name: 'Couchon BJJ', city: 'Oakland Park', street: '3873 Powerline Rd', phone: '(718) 619-1863', at: [26.173298, -80.154831], ig: 'couchonbjj',
      sat: [{ from: '13:00', to: '14:00' }] },
    { name: 'Komba Jiu Jitsu', city: 'Sunrise', street: '3541 N Pine Island Rd', phone: '(954) 900-8823', at: [26.170462, -80.267502], ig: 'getkomba', price: 'free',
      sat: [{ from: '12:00', to: '14:00' }], note: 'free with the Komba app' },
    // From Dylan (October 10, 2026); times read from the gym's 2026 schedule (its Instagram "Schedule" highlight):
    // Saturday open mat, gi or no-gi; Sunday no-gi open mat "open to all gyms", after an invitation-only competition class.
    { name: 'Renzo Gracie Fort Lauderdale', city: 'Fort Lauderdale', street: '535 NE 13th St', phone: '(954) 530-5637', at: [26.142413, -80.1385],
      ig: 'renzogracieftlauderdale', price: 'free',   // free for Dylan (October 19, 2026)
      sat: [{ from: '10:30', to: '11:30', gi: 'both' }],
      sun: [{ from: '11:00', to: '12:30', gi: 'nogi' }], note: 'Sunday open to all gyms' },
    { name: 'Mattix Gracie Academy', city: 'Davie', street: '4301 S Flamingo Rd, Ste 103', phone: '(954) 864-9174', at: [26.066742, -80.313807], ig: 'mattixacademy',
      sat: [{ from: '15:00', to: '16:30' }], sun: [{ from: '18:00', to: '19:30' }] },
    { name: 'Renzo Gracie Cooper City', city: 'Cooper City', street: '8698 Griffin Rd', phone: '(305) 349-3815', at: [26.064283, -80.261726], ig: 'renzograciecoopercity',
      sat: [{ from: '10:00', to: '11:30', gi: 'nogi' }], note: 'Q&A and rolling' },
    { name: 'Outer Heaven Jiu Jitsu', city: 'Fort Lauderdale', street: '2990 Griffin Rd, Ste 2', phone: '(754) 239-3852', at: [26.062226, -80.181694], ig: 'outerheavenjjclub',
      sun: [{ from: '10:00', to: '12:00' }], note: 'free for blue belts and up' },
    // From Dylan (October 9, 2026): no-gi, Saturdays at 2. The end time isn't known. Free for him (October 19, 2026).
    { name: 'Vagner Rocha Martial Arts', city: 'Hollywood', street: '6592 Taft St', phone: '(954) 432-8788', at: [26.024518, -80.220063], price: 'free',
      sat: [{ from: '14:00', to: '15:30', gi: 'nogi' }], note: 'end time not listed' },
    // 10th Planet is no-gi only. Its own schedule (10thplanetmiami.com, October 9, 2026): Sunday open mat 11 to 1.
    { name: '10th Planet Miami', city: 'Miramar', street: '6315 Miramar Pkwy', phone: '(786) 891-2900', at: [25.9846692, -80.213036],
      sun: [{ from: '11:00', to: '13:00', gi: 'nogi' }] },
    // Fight Sports Miami, the headquarters: its own schedule (miami.fightsportsglobal.com), October 9, 2026.
    { name: 'Fight Sports Miami HQ', city: 'Miami', street: '339 NE 61st St', phone: '(786) 290-6875', at: [25.8325516, -80.1893718],
      sat: [{ from: '11:00', to: '13:00' }], sun: [{ from: '11:00', to: '13:00' }] },
    { name: 'Miami Martial Arts', city: 'Miami Beach', street: '2700 Sheridan Ave', phone: '(305) 859-1624', at: [25.804053, -80.12954], ig: 'bjjmiami', price: 'free',
      sat: [{ from: '10:30', to: '12:00' }] },
    { name: 'Lira Jiu Jitsu', city: 'Miami', street: '2076 NW 21st St', phone: '(786) 201-1912', at: [25.795433, -80.229132], ig: 'championfitmiami',
      sat: [{ from: '10:00', to: '11:00' }] },
    { name: 'Nomad Studio Miami', city: 'Miami Beach', street: '1845 Bay Rd', phone: '(786) 870-0169', at: [25.794437, -80.14339],
      sat: [{ from: '12:00', to: '13:00' }] },
    { name: 'Mario Sperry Jiu Jitsu', city: 'Miami', street: '760 NW 4th St, #101', phone: '(786) 483-9466', at: [25.777507, -80.207372], ig: 'mariosperry',
      sat: [{ from: '12:00', to: '13:30' }] },
    { name: 'Arena Combat Sports', city: 'Miami', street: '1061 SW 8th St', phone: '(786) 369-6834', at: [25.766137, -80.212476], ig: 'arenacombatsports',
      sun: [{ from: '12:00', to: '13:00' }] },
    { name: 'Miloki Flow Jiu Jitsu', city: 'Key Biscayne', street: '200 Crandon Blvd, #103', phone: '(239) 366-2466', at: [25.697686, -80.163683], ig: 'milokiflow',
      sat: [{ from: '10:00', to: '11:30' }, { from: '12:45', to: '14:00' }] },
  ],
};
