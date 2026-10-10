// Every jiu-jitsu technique in the app. To add one, copy an entry and change it.
//
//   @ id | Name                 starts a technique (the id is its short name; letters and dashes)
//   f family                    what it's a version of (armbar, triangle...): families group variations
//   k kind / target             kind: submission sweep pass takedown backtake escape transition
//                               target (submissions): choke elbow shoulder wrist leg neck compression
//   p position                  where it starts (the list is in catalog.js: closed-guard, mount, saddle...)
//   s style                     classic modern 10p leglock wrestling judo
//   g attire                    both gi nogi
//   l level                     when it's usually learned: white blue purple brown
//   r tags                      anything a rulebook restricts (rules.js): heelhook reap kneebar toehold...
//   a other names | ...         name variations
//   = one-sentence summary
//   1 pose | step               numbered steps; the pose is a drawing from poses.js
//                               ("mount !" = same drawing with you underneath, "~" = mirrored)
//   + key detail | ...          the "Key details" list
//   - mistake | ...             the "Common mistakes" list
//   x counter | ...             how people counter it
//   v id, id                    related techniques
//   j judo-id                   the same idea in judo (opens on the right screen)
//   n a note                    history, or where the name comes from
//
//   @family id | Name | what the family is about
window.BJJ_DATA = String.raw`

@family armbar | Armbar | Straightening the elbow against your hips. Judo calls it juji-gatame, the "cross lock".
@family triangle | Triangle | Choking with your legs (or arms) wrapped around the neck and one arm.
@family kimura | Kimura & Americana | Bending the arm and turning the shoulder: the figure-four arm locks.
@family rnc | Rear naked choke | The choke from the back, with no gi needed.
@family heelhook | Heel hook | Turning the heel to twist the knee. The leg lock that changed no-gi.
@family scissor | Closed-guard sweeps | Classic sweeps from closed guard.

@ armbar-closed-guard | Armbar from closed guard
f armbar
k submission / elbow
p closed-guard
s classic
g both
l white
a Juji-gatame from guard | Straight armlock | Arm bar
= The first submission most people learn: trap one arm, swing your hips out to the side and straighten their elbow over your hips.
1 closed-guard | Control one arm at the wrist and pin it to your chest. Keep your guard closed.
2 guard-broken | Put a foot on their hip and turn your body sideways so you face the arm you're holding.
3 armbar !~ | Swing the other leg over their face, squeeze your knees together and lift your hips with their thumb pointing up.
+ Knees pinched tight around the arm | Their thumb points at the ceiling | Hips tight to their shoulder
- Leaving space between your hips and their arm | Crossing your feet | Pulling with your arms instead of lifting your hips
x Stack you onto your shoulders | Turn the thumb down and pull the elbow out (hitchhiker) | Posture up before you angle
v armbar-mount, triangle-closed-guard, kimura-closed-guard
j juji-gatame

@ armbar-mount | Armbar from mount
f armbar
k submission / elbow
p mount
s classic
g both
l white
a Juji-gatame | Mounted armbar
= When they push on your chest from under mount, climb high, swing around their arm and fall back with it between your legs.
1 mount | From mount, wait for them to push on your chest. Trap that arm against you with both hands.
2 s-mount | Step your foot up by their head and turn into S-mount, sitting on their chest.
3 armbar | Swing your leg over their face, sit tight to their shoulder and fall back. Lift your hips to finish.
+ Sit down close to their shoulder before you fall back | Keep your knees together | Hug the arm to your chest
- Falling back with your butt far from their shoulder | Letting them turn into you before you sit down
x Bridge into you as you swing your leg | Hide the elbow and clasp hands
v armbar-closed-guard
j juji-gatame

@ triangle-closed-guard | Triangle from closed guard
f triangle
k submission / choke
p closed-guard
s classic
g both
l white
a Sankaku-jime | Leg triangle
= Push one of their arms out of your guard, shoot your leg over their neck and lock your legs into a figure four around their head and the other arm.
1 closed-guard | Control both wrists. Push one hand to their stomach and pull the other toward you.
2 guard-broken | Shoot your leg up over the shoulder of the arm you pulled. One arm in, one arm out.
3 triangle | Grab your shin, lock the other knee over your foot, angle out and pull their head down.
+ One arm in, one arm out | Angle your body so your thigh closes the neck | Pull the head down, squeeze the knees
- Locking it straight on, so it can't choke | Letting them posture up before you lock it
x Posture up and stack you | Pull the trapped arm out | Pass to the side your shin points
v armbar-closed-guard
j sankaku-jime

@ kimura-closed-guard | Kimura from closed guard
f kimura
k submission / shoulder
p closed-guard
s classic
g both
l white
a Ude-garami | Double wristlock | Reverse keylock
= When they post a hand on the mat, sit up, catch their wrist and wrap a figure four over their arm, then turn their hand up behind their back.
1 closed-guard | Wait for them to post a hand on the mat, or break their posture so they have to.
2 kimura-guard | Open your guard, sit up on your elbow and grab their wrist. Reach over their shoulder and grab your own wrist.
3 kimura-guard | Fall back to your side, keep their elbow tight to you and turn their hand up toward their head.
+ Hold their wrist like a figure four, palm over | Their elbow stays bent at 90 degrees | Lock your guard over their back to stop the roll
- Letting their elbow straighten | Turning the arm with your hands instead of your whole body
x Grab their own belt or leg to hide the arm | Roll forward over the shoulder
v armbar-closed-guard, hip-bump
j ude-garami
n Named for Masahiko Kimura, the judo champion who broke Hélio Gracie's arm with it in 1951.

@ hip-bump | Hip bump sweep
f scissor
k sweep
p closed-guard
s classic
g both
l white
a Sit-up sweep | Bump sweep
= When they posture up tall, sit up into them, post a hand behind you and drive your hips into their chest to roll them over.
1 closed-guard | They sit up straight to break your guard. Open your legs and sit up toward them.
2 hip-bump | Post a hand behind you, reach over their shoulder and lift your hips into them.
3 mount | Roll them over the side you reached over and come up in mount.
+ Sit up fast, before they lean forward | Hip high off the mat | Trap the arm on the side you sweep to
- Staying flat on your back | Reaching for the arm on the wrong side
x Lean forward into you | Post the free hand on the mat
v kimura-closed-guard
j

@ heel-hook-outside | Outside heel hook
f heelhook
k submission / leg
p outside-ashi
s leglock
g nogi
l brown
r heelhook
a Outside heel hook | Ashi garami heel hook | Kakato-gatame
= Trap their leg in outside ashi, hide their heel in your armpit and turn your whole body to twist the heel to the outside.
1 x-guard | Enter from under them with your legs on one of their legs.
2 heel-hook | Hide the heel in your armpit, cup it with your forearm and lock your hands.
3 heel-hook | Hold their knee tight between your legs and turn your body away to finish. Slowly: it injures the knee fast.
+ Control their knee line first, the heel second | Turn your hips, not just your arms | Apply it slowly; the knee breaks before it hurts
- Letting their knee slip out past your legs | Yanking it fast in training
x Turn with the heel hook to take the pressure off | Free the heel by pointing the toes and pulling | Clear your legs off their hips
v
j
`;
