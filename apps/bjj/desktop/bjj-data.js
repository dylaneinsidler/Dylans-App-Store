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
j ude-hishigi-juji-gatame

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
j ude-hishigi-juji-gatame

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

@family lockdown | Lockdown & electric chair | Eddie Bravo's half guard: wrap their trapped leg in the lockdown, stretch it straight, then go under for the sweeps, splits and calf cranks.
@family rubber-guard | Rubber guard | 10th Planet's closed-guard system for no-gi and MMA: a leg clamped high on their back and held with your arm, so they can't posture or punch. Each named position leads to the next.
@family truck | The truck | 10th Planet's back-and-leg ride: one of their legs tied up in your legs while you sit behind their hip. Home of the twister, the banana split and the calf slicer.

@ lockdown-position | Lockdown
f lockdown
k transition
p lockdown
s 10p
g both
l blue
a The lockdown | 10th Planet half guard | Leg lockdown | Lockdown half guard
= From half guard, tie their trapped leg up in a figure four with your legs and stretch it straight, so they can't pass or base out and you can work your underhook.
1 half-guard | Start in half guard with their leg trapped between yours. Get your head and an underhook on the side of the trapped leg if you can.
2 half-guard | Bring your outside leg over their trapped shin and hook your foot under their ankle from the outside.
3 half-guard | Take your inside leg over the top of that foot and lock it under your own calf, like a figure four. Their shin is now tied in both your legs.
4 half-guard | Arch your back and push both legs away (Eddie calls it the whip-up or blast) to stretch their leg straight and break their base forward onto you.
5 half-guard | While they're stretched out, dig the underhook deeper and get your head under their chin or against their chest, ready for the old school or the electric chair.
+ Lockdown first, then whip it straight: a bent leg can't be swept | Pair it with a deep underhook or a double-under around the body | Keep your hips on your side facing them, not flat on your back | Hug them close so they can't post on your head
- Holding the lockdown with your legs bent, so they just walk the leg free | Lying flat and getting crossfaced | Squeezing the lockdown forever with no plan to go under
x Crossface and flatten them before the underhook comes | Turn the trapped foot out and straighten the leg on your terms to free it | Back-step or switch the hips to face their legs and pull the knee out
v old-school-sweep, electric-chair-sweep, electric-chair-submission, vaporizer, kimura-half-guard
n Eddie Bravo made the lockdown and his half guard famous at ADCC 2003, where he beat Royler Gracie by triangle. The drawing is plain half guard; there's no lockdown picture yet, so read the leg lock in the steps.

@ old-school-sweep | Old school sweep
f lockdown
k sweep
p lockdown
s 10p
g both
l blue
a Old school | Half guard heel grab sweep | Underhook sweep to the ankle
= From lockdown with a deep underhook, reach under them, grab the heel of the leg in your half guard, let go of the legs and come up on your knees driving them over onto their back.
1 half-guard | Lockdown their leg and whip it straight. Get the underhook on that side and your head tight to their chest.
2 half-guard | Turn onto your side toward them and walk your underhook arm deep around their back so you're under their hips.
3 half-guard | Reach your other hand under your own legs and grab the heel (or the pants at the ankle in the gi) of the trapped leg.
4 half-guard | Release the lockdown, step your top foot out and come up onto your knees, keeping the heel trapped so they can't step to block.
5 side-control | Drive forward and across into them. With the heel held they fall back, and you come up into side control or top half.
+ The heel grip is what makes it work: they can't step that leg out to catch their balance | Come up on your knees before you drive | Head stays tight to them the whole time | Drive across their body, not straight up
- Letting go of the lockdown before you have the heel | Trying to drive while still flat on your back | Reaching for the heel without the underhook
x Whizzer (overhook) the underhook arm and sprawl the hips back | Step the far leg wide to base | Crossface before you come up
v lockdown-position, electric-chair-sweep, kimura-half-guard
n Eddie Bravo named it the old school because half-guard players were hitting it long before the lockdown; he made it a pillar of his system.

@ electric-chair-sweep | Electric chair sweep
f lockdown
k sweep
p lockdown
s 10p
g both
l blue
a Electric chair | Electric chair (sweep) | Lockdown leg split sweep
= Keep their near leg stretched in the lockdown, slide under their hips, hook their far leg over your shoulder and come up on top as they're split apart.
1 half-guard | From lockdown with a deep underhook, whip their trapped leg straight so they post their hands on the mat.
2 half-guard | Let go of the underhook, pull your head out and scoot your body under their hips, turning to face their far leg.
3 x-guard | Reach your top arm around the outside of their far thigh and pull that leg over your shoulder. This is the electric chair: one leg in the lockdown, the other on your shoulder.
4 x-guard | Push the lockdown leg away and lift the far leg so their legs spread and they tip onto their side or butt.
5 side-control | Release the lockdown, come up on your knees still hugging the far leg and drive forward into side control or a leg-drag pass.
+ The near leg stays stretched: that's what stops them stepping back to base | Get under their hips, not beside them | Hold the far leg high on your shoulder, by the knee | Come up as soon as they fall; don't stay underneath
- Going under while the lockdown leg is bent | Holding the far leg by the ankle, where they kick it free | Staying on your back admiring the split
x Sit back hard before you get under | Free the far leg by pulling the knee down to your chest | Turn toward your far side and fall into a leg lock of their own
v electric-chair-submission, vaporizer, lockdown-position, old-school-sweep
n There's no drawing of the electric chair; the steps use half guard and the x-guard picture as the closest (you underneath, holding their legs).

@ electric-chair-submission | Electric chair (hip stretch)
f lockdown
k submission / leg
p lockdown
s 10p
g both
l purple
r legstretch
a Electric chair | Electric chair submission | Groin stretch | Lockdown split | Hip split from half guard
= From the electric chair grip (near leg stretched in the lockdown, far leg on your shoulder), push the two legs apart until the split taps them.
1 half-guard | Lockdown their leg, whip it straight and slide under their hips as for the electric chair sweep.
2 x-guard | Pull their far leg over your shoulder and hug it at the knee with both arms if you can.
3 x-guard | Turn onto your back so your body is at a right angle to theirs: you're facing their far leg, the lockdown holding the near leg.
4 x-guard | Straighten the lockdown away from you and pull the far knee toward your face. Their legs split and the stretch lands in the groin and hip.
5 x-guard | Go slowly. If they turn to escape the split, come up on top with the sweep instead.
+ Both legs need to be straight: knee on your shoulder, lockdown leg stretched | Turn your hips perpendicular to theirs before you stretch | Squeeze the far knee to your ear | Slow, steady pressure: groin and hamstring tears happen fast
- Pulling the far leg by the foot, so the knee bends and the split goes away | Trying it with the lockdown leg still bent | Ripping it in training
x Bend the far knee and pull it out from your shoulder | Sit up into you and turn the hips to face you | Stand on the lockdown leg if you can free it, and pass
v electric-chair-sweep, vaporizer, banana-split, lockdown-position
n Legal for adults at IBJJF, ADCC and EBI; NAGA Gi treats leg-and-groin stretches by belt. The steps borrow the x-guard drawing as the closest picture.

@ vaporizer | Vaporizer
f lockdown
k submission / compression
p lockdown
s 10p
g nogi
l brown
r calfslicer, toehold
a Lockdown calf crank | Calf slicer from the electric chair | Vapor | Defcon 4 (variation)
= When they bend the leg in your lockdown to escape the electric chair, wedge your shin behind their knee and fold their foot toward their butt, twisting it as you crush the calf.
1 half-guard | Lockdown their leg and go under into the electric chair: far leg on your shoulder, near leg in your legs.
2 x-guard | They bend the trapped leg to escape the stretch. Let it bend, but keep your legs wrapped around it.
3 kneebar | Shift your top leg so your shin bone sits deep in the back of their knee, and grab their foot with both hands.
4 kneebar | Fold the foot toward their butt over your shin. The calf is crushed between your shin and their own leg.
5 kneebar | Turn the toes sideways as you fold to add pressure on the knee. Push your other foot into their leg (the Defcon 4 version) for more. Slowly.
+ Shin, not knee, behind their knee | Let them bend the leg: the escape is the entry | Fold first, twist second | It loads the knee too: treat it like a heel hook in training
- Fighting to keep the leg straight once they've bent it | Twisting hard before the fold | Going fast with a training partner
x Keep the trapped leg straight and pass while it's stretched | Turn toward you and grab their own foot to stop the fold | Pull the knee out before the shin gets deep
v electric-chair-submission, electric-chair-sweep, calf-slicer, toe-hold
n Eddie Bravo taught it publicly around his 2014 Metamoris rematch with Royler Gracie and describes it as part toe hold, part calf crank. Because it twists the foot as well as crushing the calf, check the event rules before using it.

@ truck-entry | Getting to the truck
f truck
k transition
p turtle-top
s 10p
g nogi
l purple
a The truck | Twister roll | Truck roll | Crotch ride to the truck
= From the side of the turtle, hook their near leg with your legs and roll over your shoulder so they come with you, landing with their leg tied up and you sitting behind their hip.
1 turtle | Ride the turtle from the side, your chest on their back near their hips.
2 turtle | Put your near leg between their legs from the back and hook their near thigh (the inside hook).
3 turtle | Reach your near arm under their far leg or grab their far wrist, and tuck your head toward the mat on their far side.
4 back | Roll over your near shoulder across their back. Keep the hook and they roll with you onto their side.
5 back | Lock your legs around their near leg (a lockdown or a triangle with your legs). You're the truck: sitting by their hip with their bottom leg tied up and their upper body free for you to attack.
+ The inside hook is the key: without it they just stay on their knees | Roll toward your own head, not sideways | Lock the legs on their leg the moment you land | From the truck, go back, twister, calf slicer or banana split
- Rolling with a shallow hook and landing in their guard | Leaving their leg free after the roll | Letting them face you while you lock it up
x Sit back on the hooked leg before the roll | Turn into you and face you as you land | Clear the leg lock with your hands and come up
v twister, banana-split, calf-slicer, rnc-from-back
n There's no truck drawing; the steps use the turtle and back pictures as the closest. The name comes from the shape: their leg tied in yours looks like the chassis, the rest of their body the cab.

@ twister | Twister
f truck
k submission / neck
p truck
s 10p
g nogi
l purple
r spine
a Twister | Spine lock | Wrestler's guillotine (wrestling name) | Twister from the truck
= From the truck, their leg is stretched one way in your legs while you pull their head the other way toward their far shoulder, side-bending the spine and neck.
1 turtle | Get to the truck: their near leg locked in your legs and you sitting behind their hip.
2 back | Thread your near arm under their near armpit and up behind their neck, lifting that arm so it ends up over your head and shoulder.
3 back | Reach your other arm around the front of their head (over their ear or under the chin) and lock your hands together.
4 back | Stretch the trapped leg away with your legs and pull their head toward your chest and their far hip. Their spine bends sideways.
5 back | Keep the leg lock tight; it holds their hips while the head turns. Go slowly: the neck takes the twist.
+ The leg must be locked and stretched, or they just turn with you | Their near arm goes over your head, not under it | Pull the head to their far hip, not up | Gentle in training: spinal cranks hurt fast
- Losing the leg lock while you reach for the head | Grabbing the head with their arm still in the way | Cranking hard in a training room
x Turn the chin away and toward your chest before the hands lock | Free the trapped leg first | Pull their head out from under your arm and face you
v truck-entry, banana-split, calf-slicer, rnc-from-back
n Eddie Bravo brought it from wrestling (where it's a pin hold called the guillotine) and made it famous; the Korean Zombie hit it in the UFC in 2011. Banned at every IBJJF belt; legal at EBI and NAGA No-Gi. There's no truck drawing, so the steps use the back picture.

@ banana-split | Banana split
f truck
k submission / leg
p truck
s 10p
g nogi
l purple
r bananasplit
a Banana split | Crotch ripper | Groin stretch from the truck | Split from the back
= From the truck, keep one of their legs tied in yours and pull the other leg the opposite way, splitting their legs until the groin and hip give.
1 turtle | Get to the truck: their bottom leg locked in your legs, you behind their hip.
2 back | Reach around their top leg with both arms and hug it behind the knee.
3 back | Roll onto your back a little so their hips turn up toward the ceiling.
4 kneebar | Keep your legs stretching the bottom leg away and pull the top leg toward your chest. Their legs split apart.
5 kneebar | Go slowly; tap comes from the groin and inner thigh.
+ Hug the top leg by the knee, not the foot | Turn their hips up before you split | Both legs straight | Slow: groin tears are serious
- Grabbing the ankle so they bend the knee out | Letting the bottom leg out of your lock | Ripping it in training
x Bend the top leg and turn to face you | Grab your hands and pull the top knee back | Free the bottom leg before the split starts
v truck-entry, twister, calf-slicer, electric-chair-submission
n The same split as the electric chair, from the top. ADCC bans it for beginners. No truck drawing exists, so the steps borrow the back and kneebar pictures.

@ mission-control | Mission control
f rubber-guard
k transition
p rubber-guard
s 10p
g nogi
l blue
a Mission control | Rubber guard | Rubber guard first position
= From closed guard with their posture broken, bring one leg up high across their back and hold your own ankle, so they can't posture up or punch.
1 closed-guard | Break their posture: pull their head down with your knees and arms.
2 closed-guard | Overhook one of their arms (or hold the wrist) and open your guard on that side.
3 rubber-guard | Bring that leg up high across their shoulder blades, near the back of their neck.
4 rubber-guard | Grab your own ankle with the opposite-side hand, so your shin is clamped across their upper back.
5 rubber-guard | Put your other forearm on their collarbone or neck to stop them driving in, and your other foot on their hip. From here go to New York, the zombie, or straight to the gogoplata or omoplata.
+ The leg goes high on the back, by the neck, not on the shoulder | Hold the ankle, not the foot | Keep their head down at all times | Needs flexible hips: warm up first
- Opening the guard before the posture is broken | Letting the leg slide down onto their shoulder, where they posture out | Forcing the leg up if your hips don't bend that far
x Posture up before the leg climbs | Stack the leg and pass | Pull the trapped arm back out and stand
v new-york-rubber-guard, chill-dog, zombie-rubber-guard, gogoplata-rubber-guard, omoplata-closed-guard
n Eddie Bravo's rubber guard took off in the 2000s as a no-gi and MMA guard: the high leg kills their posture and their punches without needing a collar to hold.

@ new-york-rubber-guard | New York
f rubber-guard
k transition
p rubber-guard
s 10p
g nogi
l blue
a New York | New York position | Rubber guard New York
= From mission control, pin their arm on your chest under your high leg and hold your ankle with that same-side hand, freeing your other arm to control their head.
1 rubber-guard | Start in mission control: your leg high across their back, ankle held.
2 rubber-guard | They post that arm on your chest or the mat. Clamp it to your chest with your high leg so it's stuck.
3 rubber-guard | Switch hands on your ankle: grab it with the hand on the same side as the high leg.
4 rubber-guard | Wrap your free arm over the back of their head and pull it down. Their arm is pinned and their head is low.
5 rubber-guard | From here go to chill dog, the Kung Fu Move into the gogoplata, or the omoplata.
+ The pinned arm is trapped by your leg, not your hand | Head control the whole time | Hips angled out a little to the high-leg side
- Letting their trapped arm slide out while you switch hands | Head control slipping so they posture up
x Pull the arm out as you switch hands | Posture up hard with the head | Stack forward on the high leg
v mission-control, chill-dog, zombie-rubber-guard, invisible-collar, gogoplata-rubber-guard
n The positions are named in order of how deep into the system they are, using Eddie Bravo's own nicknames.

@ chill-dog | Chill dog
f rubber-guard
k transition
p rubber-guard
s 10p
g nogi
l purple
a Chill dog | Chilldog
= From New York, move your free forearm to the far side of their neck so the head and far collarbone are loaded, and their trapped arm stays under your leg.
1 rubber-guard | Start in New York: their arm pinned under your high leg, your hand on your ankle and your free arm over their head.
2 rubber-guard | Slide the free arm across so your forearm lies on the far side of their neck.
3 rubber-guard | Pull their head toward you with that forearm and keep your high leg clamped.
4 rubber-guard | From here, take the invisible collar for the gogoplata, or the jiu claw if they try to posture.
+ Forearm on the far side of the neck, not on the face | High leg stays tight on the trapped arm | Keep their head down with steady pressure
- Lifting your elbow so they posture | Loosening the leg as you change hands
x Posture up and pull the arm free | Turn the head toward the trapped arm side
v new-york-rubber-guard, invisible-collar, jiu-claw, gogoplata-rubber-guard

@ zombie-rubber-guard | Zombie
f rubber-guard
k transition
p rubber-guard
s 10p
g nogi
l purple
a Zombie | Rubber guard zombie | Arm isolation to omoplata
= From New York, push their pinned arm through under your high leg so it's isolated, then swing into the omoplata or an armbar.
1 rubber-guard | From New York, their arm is pinned under your high leg.
2 rubber-guard | Grab their trapped wrist with your free hand and push it toward the mat past your hip.
3 rubber-guard | Slide your hips out and swing your high leg over their shoulder, keeping their arm locked under it.
4 omoplata | Sit up and finish the omoplata, or if they straighten the arm, switch to the armbar.
+ Push the hand through toward the mat, then swing | Your high leg never lets go of the arm | Sit up quickly so they can't roll
- Letting go of the head before the arm is isolated | Swinging the leg over without moving the hips
x Roll forward over the trapped shoulder | Pull the arm back out before the leg swings
v new-york-rubber-guard, omoplata-closed-guard, armbar-closed-guard

@ invisible-collar | Invisible collar
f rubber-guard
k transition
p rubber-guard
s 10p
g nogi
l purple
a Invisible collar | Rubber guard collar
= From chill dog, wrap your high leg behind their neck and hold your own shin like a gi collar, pulling their head down so you can bring the foot under their chin for the gogoplata.
1 rubber-guard | From chill dog, their arm is pinned and their head is held down.
2 rubber-guard | Bring your high leg across the back of their head.
3 rubber-guard | Grab your own shin or heel with your far hand, as if you were gripping a collar.
4 rubber-guard | Pull down with that grip. Their head stays low and your foot slides around under their chin.
5 rubber-guard | Push the foot through into the gogoplata or the loco plata.
+ Grip your shin like a collar | Their head stays low the whole time | Keep the trapped arm pinned
- Losing the arm pin while switching grips | Letting the head come up
x Posture up before the grip | Pull the trapped arm free
v chill-dog, gogoplata-rubber-guard, jiu-claw, new-york-rubber-guard
n Named because it gives you a collar grip in no-gi, where there's no collar to hold.

@ jiu-claw | Jiu claw
f rubber-guard
k transition
p rubber-guard
s 10p
g nogi
l purple
a Jiu claw | Jiu-claw
= When they try to posture out of chill dog, grab your own foot with your hand like a claw and keep your leg on their neck, holding their head down and setting up the gogoplata.
1 rubber-guard | From chill dog, they start to posture up.
2 rubber-guard | Reach your free hand across and grab your own foot or toes on the high leg.
3 rubber-guard | Pull that foot down so your leg keeps clamping their head.
4 rubber-guard | Once they settle, slip the foot under their chin for the Kung Fu Move and the gogoplata.
+ Catch the foot early, the moment they posture | Your leg does the holding; the hand only keeps it there | Stay on your side, hips angled
- Waiting until they've already posted up | Pulling with your arm instead of your leg
x Explode up before the claw grip | Turn the head out and pull the arm free
v chill-dog, invisible-collar, gogoplata-rubber-guard
n Instructors differ on the exact grip; this is the common version taught in 10th Planet schools.

@ spider-web-kimura | Spider web from the kimura
f armbar
k submission / elbow
p side-control
s 10p
g both
l blue
a Spider web | Spider web armbar | Kimura to armbar | Side-control armbar from the kimura
= From side control, catch a kimura grip on their near arm, step over their head and sit back into the spider web, then break their grip and finish the armbar.
1 side-control | From side control, isolate their near arm and get a kimura grip on it.
2 kimura-side | Step your near leg over their head and sit down beside their shoulder, keeping the kimura.
3 armbar | Bring your other leg over their chest. You're in the spider web: legs over head and chest, their arm hugged to you.
4 armbar | Break their grip with the kimura (pull the elbow back toward their head) or slide your forearm through.
5 armbar | Straighten the arm with your hips up and their thumb pointing up.
+ Keep the kimura grip until you're sitting down | Knees tight on the arm | Break the grip by changing angles, not pulling straight
- Opening the knees while you work the grip | Sitting too far from their shoulder
x Hide the elbow and roll into you | Grab your own hands or your clothes
v armbar-side-control, kimura-side-control, spider-web-north-south, kimura-north-south
j ude-hishigi-juji-gatame
n Eddie Bravo calls this position the spider web.

@ spider-web-north-south | Spider web from north-south
f armbar
k submission / elbow
p north-south
s 10p
g both
l blue
a Spider web from north-south | North-south to spider web
= From north-south, catch the kimura grip, step your leg over their head and sit back into the spider web.
1 north-south | From north-south, get a kimura grip on their near arm.
2 kimura-side | Step your leg over their head and sit down close to their shoulder.
3 armbar | Bring your other leg over their chest; you're in the spider web.
4 armbar | Break their grip and straighten the arm with your hips up.
+ Keep their elbow tight to your chest | Sit close to the shoulder | Change angles to break the grip
- Letting the arm out while stepping over | Leaving space between your hips and their arm
x Hide the elbow | Bridge and roll into you
v spider-web-kimura, kimura-north-south, armbar-side-control
j ude-hishigi-juji-gatame

@family back-collar | Collar chokes from behind | Gi chokes with their own collar from the back or the turtle: the sliding collar, bow and arrow, single wing and clock choke.
@family crucifix | Crucifix | One of their arms trapped in your legs and the other in your hand, so nothing is left to protect their neck or their elbow.

@ rnc-from-back | Rear naked choke
f rnc
k submission / choke
p back
s classic
g both
l white
a RNC | Mata leão | Hadaka-jime | Sleeper hold | Rear choke | Lion killer
= From back control, slide your arm under their chin, lock a figure four behind their head and squeeze both sides of the neck between your biceps and forearm.
1 back | Hold the back with a seatbelt (one arm over a shoulder, one under the other armpit, hands together on their chest) and both hooks in. Keep your chest glued to their back.
2 back | Win the hand fight first. Use your bottom hand to peel their hands off your choking wrist until the path to the neck is clear.
3 rnc | Slide the choking arm across the throat until your elbow sits right under their chin. Grab your other biceps with the choking hand.
4 rnc | Put the second hand behind their head (or on your own shoulder) and keep your head tight against theirs so they can't turn in.
5 rnc | Squeeze your elbows together and swell your chest forward. When it's in right it takes a few seconds; you never need to crank the jaw.
+ Elbow under the chin, in the middle of the throat | Biceps on one side of the neck, forearm on the other: a blood choke, not a windpipe crush | Head glued to theirs | Seatbelt first, choke second: position before submission | Hooks or a body triangle keep them from sliding out
- Squeezing across the jaw, which is a neck crank, not a choke | Crossing your feet in front of them (they can foot-lock you) | Going for the choke with no hand fight, so they pull it straight off | Loosening the seatbelt to reach for the neck and losing the back
x Tuck the chin and turn it into the choking elbow | Two hands on the choking wrist, pulling it down off the neck | Slide the shoulders to the mat on the choking-arm side and turn in | Foot-lock the attacker if they cross their feet
v short-choke-back, arm-trap-rnc, armbar-from-back, back-triangle, sliding-collar-choke
j hadaka-jime
n Mata leão is Portuguese for "lion killer". Judo's name, hadaka-jime, means "naked strangle": it needs no gi.

@ short-choke-back | Short choke (palm-to-palm RNC)
f rnc
k submission / choke
p back
s modern
g both
l blue
a Palm-to-palm rear naked choke | Gable grip choke | Short rear naked choke | Hand-in-hand RNC
= When they stop your figure four, skip it: clasp your hands palm to palm, pull your choking wrist back across their neck and drive your head forward into the back of theirs.
1 back | You're on the back with the seatbelt, but they keep your second hand away from the back of their head, or your choking arm is only halfway in.
2 rnc | Keep the choking arm across the throat with your elbow as close under the chin as you can get it.
3 rnc | Bring your other hand over their shoulder and clasp the choking hand palm to palm (or grab your own choking wrist).
4 rnc | Pull the clasped hands back toward your own shoulder, pinch the elbow in and push your head into theirs. The blade of your wrist and forearm cuts into the side of the neck.
+ Pull back toward your own chest, not up into the jaw | Your head pushes their head forward into the choke | It's the answer when they win the fight for your second hand | Keep your chest tight to their back while you pull
- Squeezing the jaw instead of the neck | Lifting your elbows so the choke opens up | Pulling away from them and leaving space between your chests
x Tuck the chin hard and pull the forearm down with both hands | Turn the chin toward the choking elbow | Slide to the mat on the choking-arm side and turn in
v rnc-from-back, arm-trap-rnc, crucifix-choke
j hadaka-jime
n Kodokan judo usually teaches hadaka-jime with the hands clasped like this rather than the figure four.

@ arm-trap-rnc | Arm-trap rear naked choke
f rnc
k submission / choke
p back
s classic
g both
l blue
a Arm-trap RNC | Leg-trap mata leão | Trapped-arm rear naked choke
= When they defend the choke with both hands, pin one of their arms under your leg so they only have one hand left to fight your two.
1 back | From back control with the seatbelt, they hold your choking wrist with both hands.
2 back | Use your bottom (underhook) hand to push their wrist on that side down past their hip.
3 back | Take that leg out of its hook and step it over their forearm. Lock your foot behind your other knee, or hook it back under their thigh, so the arm stays pinned.
4 rnc | Free your bottom hand and finish the rear naked choke. They have one hand to stop two of yours.
+ Push the wrist down with your hand first; the leg follows | Trap the forearm near the wrist, so the elbow can't pull out | Keep the seatbelt tight while you switch the leg | The other hook (or a body triangle) holds the back while one leg traps
- Lifting the leg over before the arm is pushed down | Trapping above the elbow, where they pull the arm straight out | Losing your other hook while you work
x Keep the elbows tight to the ribs so the arm can't be pushed down | Bridge back into the attacker to loosen the leg | Slide the shoulders to the mat and turn in before the choke
v rnc-from-back, short-choke-back, armbar-from-back, back-triangle
j hadaka-jime
n In the gi you can trap the same arm with their own lapel instead of your leg.

@ sliding-collar-choke | Sliding collar choke
f back-collar
k submission / choke
p back
s classic
g gi
l white
a Okuri-eri-jime | Collar choke from the back | Sliding lapel choke | Lapel choke from the back
= From the back, reach around their neck and grab the collar on the far side deep, then pull their other lapel down so the collar slides tight around the neck.
1 back | From back control, use your bottom hand to pull their collar open on the far side and feed it up toward your top hand.
2 rnc | Reach your top hand around their throat and grab that collar deep, four fingers inside, thumb inside, as close to their ear as you can.
3 back | Let go with the bottom hand and grab their other lapel lower down, around chest height.
4 rnc | Pull the low lapel straight down while you pull your choking elbow back, head tight to theirs. The collar slides closed around the neck.
+ A deep grip: knuckles against the side of the neck | Feed the collar with your other hand instead of fishing for it | Pull the bottom lapel down toward their hips | Chest on their back and hooks in the whole time
- A shallow grip at the front of the throat | Pulling with the top arm alone | Letting them turn into you while you change grips
x Tuck the chin and fight the top hand before it gets deep | Pull the choking hand down with both hands | Slide the shoulders to the mat on the choking-arm side and turn in
v bow-and-arrow-choke, single-wing-choke, clock-choke, rnc-from-back
j okuri-eri-jime
n Okuri-eri-jime means "sliding collar strangle". It's one of the Kodokan's original chokes.

@ bow-and-arrow-choke | Bow and arrow choke
f back-collar
k submission / choke
p back
s classic
g gi
l blue
a Arco e flecha | Bow and arrow strangle | Bow choke
= From the back, grab their collar deep and their pants at the knee, swing your body out to the side and stretch them like a bow while the collar strangles.
1 back | From back control, open their collar on the far side with your bottom hand and feed it to your top hand.
2 rnc | The top hand grabs the collar deep, thumb inside, close to the back of their neck.
3 back | Let go with the bottom hand, take out the hook on that side and slide your hips out, away from the choking arm, until you're almost at a right angle to them.
4 back | Grab their pants at the knee with your free hand. Throw your top leg over their stomach (or up over their head) and keep your bottom shin against their back.
5 rnc | Pull the collar with one hand and the knee with the other, as if drawing a bow, and push with your legs. The stretch drives the collar into the neck.
+ Get the angle: your body ends close to a right angle to theirs | A deep collar grip, fed by your other hand | The pants grip stops them turning in to face you | Pull with your back and legs, not just your arm
- A shallow collar grip | Staying square behind them, so there's nothing to stretch | Letting them turn their chest toward you as you slide out
x Turn in toward the attacker and face them | Two hands on the collar hand before you're stretched out | Kick the knee free of the pants grip | Get your back flat on the mat before the angle is set
v sliding-collar-choke, single-wing-choke, clock-choke, rnc-from-back
j okuri-eri-jime
n One of the most successful gi chokes in competition. Judo has no separate name for it; it uses okuri-eri-jime's collar grip. The drawings can't show the sideways finish, so the last one is the closest match.

@ single-wing-choke | Single wing choke
f back-collar
k submission / choke
p back
s classic
g gi
l blue
a Kata-ha-jime | Single wing strangle | Wing choke
= Grab their collar deep from behind, lift their arm on the other side with your free arm and slide that hand behind their neck, then push the head forward into the collar.
1 back | From back control (or on top of the turtle), take a deep collar grip around their neck with your top hand, thumb inside, fed by your bottom hand.
2 rnc | Keep the collar tight. Your bottom arm is already under their armpit on the other side: that's the arm you'll wing.
3 back | Drive that arm up, lifting their elbow above their shoulder.
4 back | Slide the same hand behind their neck, knife edge on the back of the neck. Their arm is now stuck up in the air: the "wing".
5 back-flat | Get off to the side of the winged arm and drive your weight down, flattening them if you can. Pull the collar and push their neck forward with the wing hand.
+ The deep collar grip comes first; the wing only tightens it | Lift the elbow high, above their shoulder line | Get off to the winged side instead of staying square behind them | Push the head forward and away from the collar hand
- Leaving the wing low, so they keep the elbow down | Staying square behind them | Pulling the collar without pushing with the wing hand
x Keep the elbow glued to the ribs so it can't be lifted | Pull the winged arm back down before the hand gets behind the neck | Tuck the chin and peel the collar hand | Turn in and face them before the wing is set
v sliding-collar-choke, bow-and-arrow-choke, clock-choke, rnc-from-back
j kata-ha-jime
n Kata-ha-jime means "single wing strangle". It's just as strong on a turtle, where your bottom arm threads under their near arm.

@ clock-choke | Clock choke
f back-collar
k submission / choke
p turtle-top
s classic
g gi
l blue
a Turtle collar choke | Clock collar choke
= On top of a turtle, grab their collar deep under the chin, block their arm so they can't roll you, then sprawl and walk your legs around toward their head like the hand of a clock.
1 turtle | From the side of their turtle, chest heavy on their back, open their collar with one hand.
2 turtle | Feed your hand nearest their head under their chin and grab the collar deep, thumb inside, knuckles against the neck.
3 turtle | With your other hand, grab their near wrist or sleeve (or their belt) so they can't roll you over that side.
4 front-headlock | Sprawl your legs back, chest on their upper back and shoulder, head posted on the mat, and walk your feet around toward their head. Every step tightens the collar.
5 front-headlock | Drop your hip and sink your weight onto the back of their neck and shoulder to finish.
+ A deep grip with the thumb inside | Heavy chest pressure on their back the whole time | Walk toward their head, never toward their hips | Block their near arm so they can't roll out
- Staying up on your knees instead of sprawling | Walking too fast and losing the arm block, so they spin out | A shallow grip on the chin that crushes the jaw instead of choking
x Tuck the chin and fight the collar hand early | Roll toward the attacker before the walk starts | Turn in and recover guard as they circle | Hook the attacker's leg to stop the walk
v sliding-collar-choke, single-wing-choke, bow-and-arrow-choke, crucifix-choke
j okuri-eri-jime
n Named for the walk: your legs swing around their head like the hand of a clock. The last drawings (the front headlock) are the closest picture of the end of the walk.

@ crucifix-choke | Crucifix choke
f crucifix
k submission / choke
p turtle-top
s modern
g both
l purple
a Crucifix | Claw choke | Crucifix short choke
= On top of the turtle, trap their near arm in your legs and hold the far wrist, roll them face up onto you, then choke the neck they have no hands left to defend.
1 turtle | From the side of their turtle, chest on their back, grab their far wrist (a seatbelt or a wrist grip) and don't let it go.
2 turtle | Drive your inside knee between their near knee and elbow. When they reach or post that arm, step your leg over it and pinch it between your legs, feet locked if you can.
3 back | Keep the wrist and roll (or fall back) so they land face up on top of you, across your body. One arm is in your legs, the other in your hand.
4 rnc | Still holding the wrist, wrap your other arm around their neck and grab their far shoulder (no-gi) or their far collar deep (gi).
5 rnc | Pull your wrist into the side of their throat and push your head into theirs. They have no arm free to stop it.
+ Never let go of the far wrist: that grip is what stops them sitting up | Legs tight on the trapped arm; loose legs and the arm slides out | It's a choke on the neck: pulling the head forward instead is a neck crank, illegal at every IBJJF belt | They will guard the neck, so threaten the armlock to open it
- Letting go of the wrist to choke with both hands | Rolling before the arm is locked in your legs | Cranking the head instead of choking
x Keep the near elbow tight to the knee in the turtle so no leg can get in | Turn toward the trapped arm and pull it out before the roll | Sit up toward the attacker's legs | Tuck the chin and turn the face toward the choking arm
v crucifix-armlock, clock-choke, rnc-from-back, short-choke-back
n An old catch-wrestling position that became a favorite turtle attack in modern jiu-jitsu (and in MMA, where the hands are free for strikes). There's no drawing of the crucifix itself: the pictures show the turtle entry and a choke from behind.

@ crucifix-armlock | Crucifix armlock
f crucifix
k submission / elbow
p turtle-top
s modern
g both
l purple
a Crucifix armbar | Crucifix arm lock
= In the crucifix their near arm is already straight between your legs: take out the slack, then lift your hips into the back of the elbow while your top knee drives down.
1 turtle | On top of the turtle, hold their far wrist and trap their near arm between your legs (as in the crucifix choke).
2 back | Roll them so they lie face up across you. Keep the legs locked on the arm, instep behind your other calf.
3 back | Take out the slack: plant your top foot and scoot your legs away so the trapped arm stretches out straight.
4 armbar | Bridge your hips up into the back of their elbow while your top knee drops toward the mat. The elbow straightens over your hips.
+ They defend the neck first, so the armlock is often the first thing that works | Lock the legs at the calf, not at the knee, for more leverage | Remove all the slack before you lift your hips | Keep the wrist grip on their other arm the whole time
- Lifting the hips while the arm still has slack | Loose legs that let the elbow bend | Letting go of the far wrist
x Turn the trapped arm into a hitchhiker (thumb pointing out) to take the pressure off the elbow | Bend the arm and pull it out before the slack is gone | Walk the hips away and sit up toward the attacker's legs
v crucifix-choke, armbar-from-back, armbar-mount
n If they turn the thumb to escape, switch which leg is on top and lift into the elbow again. There's no crucifix drawing; the finish shows a regular armbar as the closest match.

@ back-triangle | Back triangle
f triangle
k submission / choke
p back
s modern
g both
l purple
a Rear triangle | Triangle from the back | Back sankaku
= From back control, push one of their arms across their body, throw your leg over that shoulder and lock a triangle around the neck and that arm from behind.
1 back | From back control, they defend the choke with both hands. Grab one wrist and push that arm across their body, past the middle of their chest.
2 back | Lift your leg on that side up over their shoulder, the back of your knee against their neck. Put your other foot on their hip to cut an angle.
3 triangle | Bring the other leg under and lock: the ankle of your top leg behind the knee of your bottom leg. One arm in, one arm out.
4 triangle | Hold the trapped wrist so the arm can't pull out, angle your hips toward the trapped arm and squeeze your knees together.
5 armbar | If the choke won't come, the arm you're holding is already isolated: take your top leg over their face and finish an armbar.
+ One arm in, one arm out, or it can't choke | Push the arm across first; the leg follows the arm | Cut the angle with a foot on their hip | Keep hold of their wrist so the arm stays inside
- Locking it with both arms inside: that's just a body lock | Locking it square behind them, with no angle | Throwing the leg up before the arm is across
x Pull the trapped arm out before the lock | Turn into the attacker toward the trapped-arm side | Keep the elbows tight so neither arm can be pushed across
v rnc-from-back, armbar-from-back, arm-trap-rnc, triangle-closed-guard
j sankaku-jime
n The drawings for the lock show a triangle from the front. In the back triangle you're behind them, but the lock and the squeeze are the same.

@ armbar-from-back | Armbar from back control
f armbar
k submission / elbow
p back
s classic
g both
l blue
a Straight armlock from the back | Back armbar | Juji-gatame from the back | Back mount armbar
= When they slide out of back control toward your choking arm, clamp their near arm, push off their hip and swing your leg over their face into an armbar.
1 back | You have the back. They defend the choke with both hands and start sliding their shoulders to the mat on the side of your choking arm.
2 back | Clamp the arm on your underhook side tight to your chest. Both of their hands are busy at your choking wrist, so that arm is out in front.
3 back | Put the foot on your underhook side on their hip and push it away as you turn your body to face the arm.
4 armbar | Swing your other leg over their face, pinch your knees together and fall back with their thumb pointing up. Lift your hips to finish.
+ It's the answer to the most common back escape | Clamp the arm before your legs move | The foot on the hip makes the angle | Knees pinched, thumb up, hips tight to their shoulder
- Swinging the leg before the arm is clamped | Leaving space between your hips and their shoulder | Letting them turn into you and stack you
x Grip the hands together and hide the arm | Turn into the attacker as the leg swings and come up on top | Hitchhiker: turn the thumb and pull the elbow out
v rnc-from-back, back-triangle, arm-trap-rnc, crucifix-armlock, armbar-mount, armbar-closed-guard
j ude-hishigi-juji-gatame

@family guillotine | Guillotine | Wrapping the neck from the front with their head in your armpit, then lifting your wrist into the throat.
@family darce | D'Arce, anaconda & neckties | Head-and-arm chokes from the front headlock: one of their arms is trapped against their own neck.
@family arm-triangle | Arm triangle | Head-and-arm chokes from the top: their own arm or shoulder squeezes one side of the neck, you squeeze the other. Judo's kata-gatame.
@family nschoke | North-south choke | A head-only choke from the top: your arm around the neck, your armpit and chest sinking down on it.
@family ezekiel | Ezekiel | A forearm across the throat while your other arm wraps behind the head. Judo's sode-guruma-jime.

@ guillotine-closed-guard | Guillotine from closed guard
f guillotine
k submission / choke
p closed-guard
s classic
g both
l white
a Guillotine choke | Guilhotina | Front choke | Head-only guillotine | Arm-out guillotine
= When their head drops in front of you, wrap your arm around the neck with your wrist under the chin, lock your hands and lift that wrist up into their throat while your legs stretch them out.
1 closed-guard | Break their posture, or wait for them to drop their head, reach for your hips or try to stand up. Pull their head down toward your chest.
2 hip-bump | Sit up into them. Wrap one arm over the back of their neck and slide the forearm under the throat, so their head ends up in your armpit and your wrist is under their chin.
3 guard-broken | Grab the choking hand with your other hand (palm to palm, or over the wrist) and pull it to your chest. Both of their arms stay outside your arm: this is the head-only version.
4 guard-broken | Lie back with them and close your guard low on their back. Push your hips up and away with your legs to stretch them out while you pull your wrist up toward your own chin.
+ Choke with the hard thumb-side edge of your forearm and wrist, not the soft inside of the arm | Lift the wrist toward your chin; don't just squeeze your arms together | Keep your armpit clamped down on the back of their head | Stretch them with your legs as you pull: the two together finish it
- Grabbing shallow, with the forearm on their jaw instead of under it | Falling flat with your guard open, so they posture up or stack you | Pulling straight back toward your own face, which cranks the neck but doesn't choke | Letting one of their arms slip inside and still trying to finish it head-on
x Two-on-one the choking wrist and pull it down off the throat | Stack them: drive your weight forward so their hips can't lift | Pass to the side away from the choking arm and hit the von Flue choke if they keep holding on
v arm-in-guillotine, high-elbow-guillotine, marcelotine, ten-finger-guillotine, von-flue-choke, hip-bump
n It isn't on the Kodokan's list of judo chokes, though judoka use it. In Brazil it's the guilhotina.

@ arm-in-guillotine | Arm-in guillotine
f guillotine
k submission / choke
p front-headlock
s classic
g both
l blue
a Arm-in guillotine | Arm-in front choke | Head-and-arm guillotine
= When they shoot or turtle with one arm under your chest, wrap their head and that arm together, sit to guard and pull your elbow to your middle, so their own shoulder chokes one side of the neck.
1 double-leg ! | They shoot on you. Sprawl your hips back and get your chest heavy on their head and upper back.
2 front-headlock | Wrap your arm over the back of their neck and dig the forearm under the throat, then keep going under their armpit, so one arm stays inside with their head.
3 front-headlock | Connect your hands (palm to palm, or grab your wrist) with the choking hand coming out past their trapped arm. Squeeze their trapped shoulder up into their neck.
4 butterfly | Sit back to your butt, keeping your elbow tight, so they stay bent over in front of you. Close your guard or put a foot on their hip.
5 guard-broken | Hip out to a slight angle and pull your choking elbow toward the middle of your own body as you lift the wrist. The angle and the elbow to your center are what finish it.
+ It's a blood choke: their trapped shoulder squeezes one side of the neck, your forearm and biceps the other | Your choking elbow goes to your own centerline; if it drifts outside, nothing squeezes | Keep their trapped arm high and tight so they can't pull it out | Get an angle: square on, the arm-in is much weaker than the head-only guillotine
- Finishing square in front of them like a head-only guillotine | Leaving space between your armpit and their head | Letting them post the trapped hand on the mat and pull the arm free
x Wrap your free arm around their back and base on the mat, shoot your legs back and drive your shoulder into their chest | Block the hip they want to angle out on, so they stay square | Find the thumb of the choking hand and peel it away, keeping your chin in line with their body
v guillotine-closed-guard, marcelotine, high-elbow-guillotine, anaconda-front-headlock, peruvian-necktie
n The same arm path as the anaconda and the Peruvian necktie: those are other ways to finish this grip.

@ high-elbow-guillotine | High-elbow guillotine
f guillotine
k submission / choke
p standing
s modern
g both
l blue
a High-elbow guillotine | Standing guillotine | Head-only high-elbow guillotine
= From a snap-down, wrap the neck deep, then drive your choking elbow up and over their back so your forearm becomes a blade under the throat. Finish standing or by sitting to guard.
1 snap-down | Snap their head down with a collar tie, or catch it as they shoot. Their head goes under your armpit.
2 snap-down | Wrap your arm over the back of their neck and drive the forearm under the throat until your wrist comes out past the far side of their neck. Both of their arms stay outside.
3 snap-down | Grab the choking hand with your other hand, palm to palm. Now lift your choking elbow high, toward the ceiling and over their back, so the thumb side of your wrist cuts up into the throat.
4 guard-pull | Finish standing by stepping back and lifting your wrist to your chest, or sit to guard: drop to your butt with the elbow still high and close your legs around them.
5 guard-broken | On the ground, keep the elbow high, stretch them out with your legs and lift the wrist toward your chin.
+ The elbow stays high and over their back: it turns your arm into a blade instead of a loose loop | Get the wrist deep, past the far side of the neck, before you lift | Keep their head under your armpit with the chin trapped | Finish with your whole body, not by squeezing your arms
- Elbow low against their side, which turns it into an air choke they can power through | Sitting to guard before the grip is set, so the head pops out on the way down | Reaching around the neck from too far away, with no chest on their head
x Two-on-one the choking wrist and pull it off the throat | Take them down right away: on top, on the side away from the choking arm, the guillotine is weak | If they pull guard, pass to the side away from the choking arm and look for the von Flue choke
v guillotine-closed-guard, marcelotine, arm-in-guillotine, ten-finger-guillotine, von-flue-choke
n The arm-in version of this high-elbow finish is the Marcelotine.

@ marcelotine | Marcelotine
f guillotine
k submission / choke
p butterfly
s modern
g both
l purple
a Marcelotine | Marcelo guillotine | Marcelo Garcia guillotine | High-elbow arm-in guillotine
= Marcelo Garcia's guillotine from butterfly guard, usually arm-in: the thin end of your forearm under the throat, your elbow up on top of their shoulder, then knees to your chest and hands to your chin.
1 butterfly | From butterfly guard, control their head with a collar tie. When they lean in, reach or shoot, snap the head down to your chest.
2 butterfly | Wrap the neck, usually with one of their arms inside, so the thin end of your forearm, just above the wrist, is under the throat. Make a fist with the choking hand.
3 butterfly | Grab the pinky side of the choking wrist with your other hand. Turn the choking arm so the elbow climbs up on top of their shoulder and upper back: your arm makes a V around the neck.
4 butterfly-sweep | Fall back, bring your knees up toward your chest to pull them into you, and lift both hands toward your chin. Don't straighten your legs.
+ Choke with the thin, bony end of the forearm near the wrist, not the thick part near the elbow | The elbow sits on top of their shoulder (the trapezius), not down by their ribs | Hands go up toward your chin | Knees come to your chest to pull them in; your legs never push them away
- Choking with the meaty part of the forearm | Kicking your legs straight, which pushes them out of the choke | Letting the elbow drop, which leaves space at the side of the neck
x Drive forward with your hips heavy and your shoulder into their chest so they can't pull you in | Hand-fight the choking wrist before the second hand locks on | Get your head out early, before the elbow climbs onto your shoulder
v arm-in-guillotine, high-elbow-guillotine, guillotine-closed-guard, ten-finger-guillotine
n Named for Marcelo Garcia, the ADCC and world champion who caught many of the best grapplers of his era with guillotines from butterfly guard and standing.

@ ten-finger-guillotine | 10-finger guillotine
f guillotine
k submission / choke
p front-headlock
s modern
g both
l blue
a Ten-finger guillotine | 10 finger guillotine | Chin-cup guillotine
= No forearm under the throat: both hands cup their chin and you cock your wrists up so your thumb knuckles dig into the windpipe. Fast, and it fits when a normal guillotine grip won't.
1 double-leg ! | They shoot. Square up and sprawl your hips back, and as you sprawl, cup their chin with one hand, the chin between your little and ring fingers.
2 front-headlock | Sprawl all the way down. Bring your second hand in and cradle the chin with both hands, your thumbs side by side.
3 front-headlock | Clamp their head against your ribs with your elbow, the way you'd carry a football, so it can't slide out.
4 front-headlock | Cock both wrists upward so the backs of your thumbs press into the windpipe. Go slowly in training: it comes on almost at once.
5 guard-broken | From guard it works the same way: sit up, reach over their shoulder, cup the chin with both hands, move your hips out to the side and cock the wrists up.
+ Your thumb knuckles do the choking, not your forearm | The chin sits between your little and ring fingers | Set the hands first, then finish by bending the wrists up | Keep their head pinned to your ribs, or to the mat in a sprawl
- Squeezing with your arms instead of turning the wrists | Letting the head slip out because your elbow isn't clamped | Cranking it fast on a training partner: it's an air choke and hurts the throat
x Tuck your chin and pull your head out before the second hand arrives | Grab one of their wrists with both hands and pull it down to break the cup | Drive forward into them and posture up before they can clamp the head
v guillotine-closed-guard, high-elbow-guillotine, marcelotine, arm-in-guillotine
n This is Chris Brennan's version, published in 2006; he also teaches a one-hand "5-finger" version from inside butterfly guard. Other coaches teach it with the fingers interlocked around the neck, so the name means different things in different gyms.

@ darce-front-headlock | D'Arce from the front headlock
f darce
k submission / choke
p front-headlock
s classic
g both
l blue
a D'Arce choke | Darce | Brabo choke | Head-and-arm choke from the front
= From the front headlock, thread your arm under their armpit and in front of their neck, lock your hand on your other biceps, and squeeze their own shoulder into one side of the neck.
1 front-headlock | Get a front headlock with them on their knees and your chest heavy on their head. Walk a little toward the side you'll thread.
2 front-headlock | Thread the arm on that side under their armpit, then in front of their throat, deep, until your hand comes out over their far shoulder by the neck.
3 front-headlock | Grab your other biceps with that hand and put the other hand on their back or behind their head. Your arms now make a figure four around their head and one arm.
4 arm-triangle | Drop to your shoulder and hip and bring them over onto their side, or flatten them. Stay on your side, not flat on your back.
5 arm-triangle | Squeeze your elbows together, drop your chest onto their head, and sprawl your hips back away from their head to tighten.
+ Thread deep: your hand should come all the way out past their far shoulder | Their trapped shoulder does half the choking; you supply the other half | Stay on your side or shoulder with your chest heavy; flat on your back it loosens | Control their far arm so they can't frame
- Threading shallow, with only the forearm through | Lying flat on your back to finish | Leaving space so they can pull the trapped arm out | Letting your head float, so they pull theirs free
x Keep your elbows tight to your knees in turtle so the arm can't thread | Pull the trapped arm out before the biceps grip locks | Turn in toward them, keeping the trapped elbow pointed down
v anaconda-front-headlock, japanese-necktie, peruvian-necktie, arm-in-guillotine, arm-triangle-side
n Named for Joe D'Arce, a Renzo Gracie black belt who made it famous in competition; he didn't invent it. The gi version, gripping the lapel, is the Brabo choke. The drawings for the finish show it from the top.

@ anaconda-front-headlock | Anaconda choke
f darce
k submission / choke
p front-headlock
s classic
g both
l blue
a Anaconda | Gator roll choke | Arm-in front headlock choke
= From the front headlock, shoot your arm under their neck and out through the far armpit, lock onto your other biceps and gator-roll toward the trapped arm, so they land on it and choke.
1 front-headlock | Front headlock with them turtled and your chest heavy on their head. Catch a short grip behind the armpit of the arm you plan to trap.
2 front-headlock | Shoot your choking arm under their neck, in front of the throat, and out through the far armpit, so their head and that arm are both inside. Lock palm to palm first to take out the slack.
3 front-headlock | Switch to the figure four: the choking hand grabs your other biceps and that hand goes onto their back. Post your foot on the side of their trapped shoulder.
4 arm-triangle | Gator roll: roll under them toward the trapped arm, taking them with you, so they land on their trapped shoulder.
5 arm-triangle | Hook their near leg with your leg so they can't roll back, drive your hips toward the mat and squeeze your elbows together.
+ Under the neck first, then the armpit: the opposite path from the D'Arce | Take out the slack with a palm-to-palm grip before you switch to the biceps | Roll toward the trapped arm, never away from it | After the roll, hook a leg and keep them on their side
- A shallow arm, so the roll just unwraps it | Rolling the wrong way, which lets them come up on top | Rolling flat, with no angle, so the choke loosens
x Keep your elbows in and your head up in turtle | Pull the trapped arm out before the roll | Sit back to your heels and drive into them before they can roll
v darce-front-headlock, arm-in-guillotine, peruvian-necktie, japanese-necktie
n Named for the way a big snake wraps its prey and rolls. The last drawings show the squeeze from the top; after a real gator roll you're both on your sides.

@ peruvian-necktie | Peruvian necktie
f darce
k submission / choke
p front-headlock
s modern
g both
l purple
a Peruvian necktie | Peruvian tie
= An arm-in guillotine grip from the front headlock, but you sit beside their head and throw your legs over the back of their neck and their back, then push down with your legs while you pull up with your arms.
1 front-headlock | Front headlock on a turtled opponent. Wrap their head and one arm together with the arm-in guillotine path: under the neck and out past the armpit.
2 front-headlock | Connect your hands with an S-grip or palm to palm. Don't let the trapped arm out.
3 omoplata | Sit down to your hip beside their head. Walk the leg nearest their head up and over the back of their neck, hamstring or calf across it.
4 omoplata | Throw your other leg across their back on the far side. Their head and arm stay tight against your stomach.
5 omoplata | Sit toward your other hip, drive the top leg down on the back of their neck and pull your grip up. Squeeze slowly.
+ The leg over the neck is on the side away from their trapped arm (left arm trapped, right leg over) | Lock your hands before you sit: the grip carries the choke | Your legs push down while your arms pull up | Their trapped shoulder does half the choking
- Sitting down before the grip is locked, so their head slides out | Putting the leg on their upper back instead of the back of the neck | Yanking: with the legs it's very strong and can hurt the neck
x Stay square with your head up in the front headlock | Pull the trapped arm out before they sit | Posture up and drive forward into them before the legs come over
v arm-in-guillotine, anaconda-front-headlock, darce-front-headlock, japanese-necktie
n Named for Tony DeSouza, the Peruvian-born fighter who made it famous in MMA. The drawing shows them flat; most of the time they're still on their knees.

@ japanese-necktie | Japanese necktie
f darce
k submission / choke
p front-headlock
s modern
g both
l purple
a Japanese necktie | Japanese tie
= A D'Arce-style grip from the front headlock, but you lock your hands together, walk to the side and drop your chest onto the back of their neck: part choke, part crank.
1 front-headlock | Front headlock on a turtled opponent. Thread your choking arm in front of their neck so their head and one arm are inside, as for a D'Arce.
2 front-headlock | Instead of grabbing your biceps, lock your hands together palm to palm to keep the forearm tight on the neck.
3 turtle | Sprawl your hips back and walk toward your choking-arm side, swinging that leg over their back.
4 turtle | Drop your hips to the mat on the other side of their head and drive your chest down on the back of their neck while you squeeze your elbows together.
+ Your chest weight on the back of their neck does the work, not your arms | Palm-to-palm grip keeps the forearm tight to the neck | Their shoulder is trapped against their own neck, as in a D'Arce | It chokes and cranks at once: go slowly
- Finishing with your arms while your chest is off them | Gripping shallow, so the arm slides off the neck | Dropping your weight fast on a training partner
x Pull the trapped arm out before the grip locks | Lift your head and turn in toward them | Come up on your knees and drive forward before they can drop their weight
v darce-front-headlock, anaconda-front-headlock, peruvian-necktie
n Because it cranks the neck as much as it chokes, some referees and gyms treat it as a neck crank: check before using it under IBJJF rules. Coaches teach slightly different entries. The drawing for the finish is the closest one, you on their back.

@ von-flue-choke | Von Flue choke
f arm-triangle
k submission / choke
p top-closed
s classic
g both
l blue
a Von Flue | Von Flue choke | Guillotine counter choke | Shoulder choke
= When they hang on to a head-only guillotine from guard, pass to side control on the side away from their choking arm and drive your shoulder into their neck: their own arm chokes them.
1 guard-broken ! | They catch you in a head-only guillotine from guard. Hand-fight the choking wrist and keep your hips heavy so they can't arch into it.
2 half-guard ! | Clear their legs and pass to the side away from their choking arm, the weak side. Keep your head tight to their chest.
3 side-control | Settle into side control on that side, chest to chest, with your head still inside their arm.
4 side-control | Keep their choking arm trapped with your head and shoulder; if you need more, clasp your hands together to hold it in place.
5 side-control | Drop your shoulder into the side of their neck and sprawl your hips down. If they keep holding the guillotine, they choke themselves.
+ Pass to the side away from the choking arm, the weak side | Your shoulder goes into their neck, and their own arm is the other wall | Sprawl your hips low and drive off your toes | Use it the moment they hang on to a guillotine they can't finish
- Passing to the choking-arm side, which tightens the guillotine | Rushing the pass while the choke is still deep | Lifting your hips, so the shoulder pressure goes away
x Let go of the guillotine as soon as they clear your legs | Frame on their hip and recover guard before their shoulder drops
v guillotine-closed-guard, high-elbow-guillotine, arm-triangle-side
n Named for Jason Von Flue, who choked Alex Karalexis unconscious with it at a UFC Fight Night in 2006.

@ arm-triangle-mount | Arm triangle from mount
f arm-triangle
k submission / choke
p mount
s classic
g both
l white
a Arm triangle | Arm-triangle choke | Head-and-arm choke | Side choke | Kata-gatame
= When they push on you from under mount, drive their arm across their face, drop your head beside it, wrap under the neck and step off to the side to squeeze their own shoulder into their neck.
1 mount | From mount, wait for them to push on your chest with one arm. Push that elbow across their face with your hand.
2 mount | Drop your head to the mat beside their head, on the side their arm went to, pinning the arm against their neck. Ear to the mat, arm sandwiched.
3 arm-triangle | Slide the arm on that side under their neck, grab your other biceps, and put that hand on the mat or on your own head.
4 arm-triangle | Step off to the side away from your head, into side control. Hips low, knees wide, your knee tight to their hip so they can't turn in.
5 arm-triangle | Sprawl your hips down, drive off your toes so your shoulder sinks into their neck, and squeeze your elbows together.
+ Their own shoulder does half the choke: get the arm all the way across first | Finish on the side away from your head, not from mount | Hips low and heavy: the pressure comes from your shoulder, not your hands | Squeeze your elbows together; don't pull with your hands
- Trying to finish from mount, where it rarely works | Stepping off to the wrong side, the one your head is on | Leaving a gap between your head and their arm | Hips high, so the pressure leaks out
x Don't push with a straight arm in the first place | Pull the trapped arm back across before their head drops | Turn in toward them and bridge as they step off the mount
v arm-triangle-side, darce-front-headlock, armbar-mount, ezekiel-nogi-mount
j kata-gatame
n In judo the same shape is kata-gatame, one of the official pins; done tight, it chokes too.

@ arm-triangle-side | Arm triangle from side control
f arm-triangle
k submission / choke
p side-control
s classic
g both
l blue
a Arm triangle from the side | Side choke | Head-and-arm choke | Kata-gatame
= From side control, get their near arm across their face, lock the arm triangle with your head on the far side, then sprawl your hips down and squeeze.
1 side-control | From side control, cross-face them and wait for the near arm to come up, often to frame on your neck.
2 side-control | Push that elbow up and across their face, with your hand or your head, until it points past their far ear.
3 arm-triangle | Drop your head to the mat on the far side, trapping the arm against their neck. Your cross-face arm is already under the neck: grab your other biceps with that hand and put the other hand on your head or the mat.
4 arm-triangle | Bring your near knee tight to their hip, then sprawl your legs back with your hips low, drive your shoulder through their neck and squeeze your elbows together.
5 arm-triangle | If it isn't tight yet, circle your hips a little and settle them lower: a small change of angle makes it bite.
+ Head on the mat on the far side, glued to their arm | Their arm must be all the way across, elbow past their face | Hips low and chest heavy: the pressure comes from your shoulder | Knee tight to their hip so they can't turn in
- Squeezing with your arms while your hips are high | Trapping only their hand or forearm instead of the upper arm | Giving them room to turn in toward you
x Keep your near elbow tight to your ribs so it never crosses | Turn in toward them and hide the elbow | Bridge and shrimp as they lock it, before their hips drop
v arm-triangle-mount, darce-front-headlock, north-south-choke, von-flue-choke
j kata-gatame

@ north-south-choke | North-south choke
f nschoke
k submission / choke
p north-south
s modern
g both
l purple
a North-south choke | N/S choke
= From side control, wrap your top arm around their neck, slide around to north-south and sink your armpit onto the side of their neck, then drop your hips and shoulders so your weight does the choking.
1 side-control | From side control, push their arms down so the neck is open. Wrap the arm nearest their head around the neck, with your armpit low on it.
2 north-south | Walk around to north-south, keeping your chest on theirs and their head under your armpit. Your biceps sits against the side of their neck.
3 north-south | Use the side of your ribs to turn their head so they look at the ceiling. Connect your hands: choking hand palm down, the other palm up.
4 north-south | Sprawl your legs, drop your weight onto their far arm and let your shoulders sink. Settle back and down rather than squeezing.
+ Your armpit sinks low on the neck, and the neck sits in the crook of your elbow | Choking hand palm down | Drop your weight and shoulders; don't squeeze and crank | Pin their arms first so they can't frame on your hips
- Squeezing hard with your arms, which only cranks | Armpit too high, on their head instead of their neck | Lifting your chest off theirs while you set it, so they turn in
x Keep a hand or forearm in front of your own throat before the arm wraps | Turn toward them and get to your side, chin tucked | Bridge and shrimp as they walk to north-south, before their hips drop
v arm-triangle-side, guillotine-closed-guard
n Marcelo Garcia made it famous in modern jiu-jitsu. It takes longer than most chokes to get the feel for: it's about weight, not strength.

@ ezekiel-nogi-mount | No-gi Ezekiel from mount
f ezekiel
k submission / choke
p mount
s classic
g nogi
l blue
a No-gi Ezekiel | Ezequiel | Sode-guruma-jime | Sleeve-wheel choke without a sleeve
= With no sleeve to hold, one arm goes behind their head and grabs your other forearm near the wrist, and the blade of that forearm cuts across their throat.
1 mount | From a tight mount, knees high, slide one arm under their head as if hugging it. Keep your weight forward so they can't bridge.
2 mount | Bring your other forearm across the front of their throat, thumb-side bone down, the hand past the far side of their neck.
3 mount | With the hand behind their head, grab your other forearm near the wrist. That grip takes the place of the gi sleeve.
4 mount | Close the scissors: drive the forearm across the throat down while the arm behind their head lifts. Keep your head down beside theirs to stay heavy.
+ The hand behind the head grabs near the wrist of the choking forearm | The thumb-side bone of the forearm goes across the throat | Stay low and heavy with your head beside theirs, so they can't bridge you off | A great answer when they hug your neck from underneath: their hug holds your arm in place
- Sitting up tall, so they bridge and roll you | Putting the forearm on their jaw instead of the throat | Grabbing too close to the hand, which slips without a sleeve
x Tuck your chin and push the choking forearm off your throat | Trap an arm and bridge (upa): both of their hands are busy, so they can't post | Elbow-knee escape before the grip is locked
v arm-triangle-mount, armbar-mount, guillotine-closed-guard
j sode-guruma-jime
n Named for Ezequiel Paraguassu, a Brazilian judo Olympian (1988 and 1992) who caught jiu-jitsu players with it at Carlson Gracie's academy. Judo had it long before, as sode-guruma-jime, the "sleeve wheel" choke.

@family cross-collar | Cross collar chokes | Both hands deep in their collar, wrists crossed, so the collar and your forearms close both sides of the neck. Judo's juji-jime ("cross strangles").
@family gi-cutter | Collar cutters & bat chokes | Gi chokes from the top where one hand holds the collar and the other forearm (or a bat-style grip) cuts across the neck.

@ cross-collar-closed-guard | Cross collar choke from closed guard
f cross-collar
k submission / choke
p closed-guard
s classic
g gi
l white
a X-choke | Cross choke | Collar choke from guard | Juji-jime | Gyaku-juji-jime | Nami-juji-jime | Kata-juji-jime
= From closed guard, feed one hand deep into their far collar, slide the second hand into the other side, then pull their head down and flare your elbows so your wrists close the neck like scissors.
1 closed-guard | Break their posture: pull them down with your legs and your collar grips until their elbows are in front of you, not on the mat at your sides.
2 closed-guard | Open their collar with one hand and feed it to the other. Slide that first hand in as deep as you can, fingers inside, thumb outside, knuckles against the back of the neck.
3 guard-broken | Bring the second hand over the first and grab the other side of the collar just as deep, also near the back of the neck.
4 closed-guard | Pull their head down to your chest with your legs and your hands. Keep your guard closed so they can't posture up.
5 closed-guard | Flare your elbows out to the sides and pull them toward the mat while you bend your wrists in. Your forearms scissor the sides of the neck.
+ The depth of the first grip decides everything: get it to the back of the neck | Feed the collar with the other hand instead of fishing for it | Pull them down with your legs, not just your arms | Elbows out and down, like you're doing a row toward the floor
- A shallow first grip at the front of the throat, which only hurts the windpipe | Letting them posture up while you get the second grip | Pulling your hands straight toward your face instead of flaring the elbows
x Posture up hard before the second grip lands | Hands on your hips or biceps to stop the elbows flaring | Duck the head under the second hand and stack you | Pass while your hands are busy in the collar
v cross-collar-mount, loop-choke, ezekiel-gi-mount, armbar-closed-guard, triangle-closed-guard
j gyaku-juji-jime, nami-juji-jime, kata-juji-jime
n Judo names the grips: gyaku-juji (both palms up, fingers inside), nami-juji (both palms down, thumbs inside) and kata-juji (one of each). The one taught here is gyaku-juji, the most common in jiu-jitsu.

@ cross-collar-mount | Cross collar choke from mount
f cross-collar
k submission / choke
p mount
s classic
g gi
l white
a X-choke from mount | Mounted cross choke | Juji-jime from mount
= From mount, get one hand deep in their collar, post your head on the mat beside theirs while the second hand grips the other side, then drop your elbows and sink your weight.
1 mount | Climb to a high mount, knees up near their armpits, so their arms can't push your hips.
2 mount | Open their collar with one hand and feed it to the other. Slide that hand in deep, four fingers inside, until your knuckles reach the back of the neck.
3 mount | Put your head on the mat next to theirs (on the side of the first hand) to keep your base while you reach for the second grip.
4 mount | Grab the other side of the collar with your second hand, palm down and thumb inside, crossing over the first arm.
5 mount | Drop your elbows wide toward the mat and sink your chest down onto your hands. The forearms close the neck.
+ Deep first grip, knuckles behind the neck | Head on the mat for base while the second hand comes in | High mount so their elbows can't come under your knees | Sink with your body; don't just squeeze your hands
- Sitting upright while you choke, so one bridge throws you off | A shallow grip on the front of the throat | Crossing hands so far apart that the wrists never meet the neck
x Bridge and roll toward the side of the second hand while you're reaching | Push your elbows up and in toward your head | Tuck the chin and turn into the first hand | Shrimp out as soon as your head goes to the mat
v cross-collar-closed-guard, ezekiel-gi-mount, armbar-mount, arm-triangle-mount
j gyaku-juji-jime, nami-juji-jime, kata-juji-jime
n If they push your elbows up, that same push straightens their arms: switch to the armbar from mount.

@ loop-choke | Loop choke
f gi-cutter
k submission / choke
p open-guard
s classic
g gi
l blue
a Loop collar choke | Rolling loop choke | Arm-out collar choke
= When their head drops low in front of you, grab their collar on the same side, put their head through the loop of your arm and roll to that side so your forearm and their own collar close the neck.
1 open-guard | Get a collar grip on the same side as your hand (right hand on their right collar), thumb inside, as deep and as high as you can.
2 guard-broken | Wait for the head to drop: they shoot in, drive forward to pass, or bend down to grab your pants. Pull the collar to bring their head down beside your gripping arm.
3 guard-broken | Bring your other arm over the back of their head and push it down so the head ends up under your gripping arm. Your forearm now crosses the back of their neck.
4 hip-bump | Turn to your side toward the gripping hand and let your free hand go behind their head or onto their shoulder.
5 guard-broken | Roll toward the gripping side, under them, pulling your gripping elbow back. The loop of collar and forearm tightens around the neck.
+ Use the same-side collar, thumb inside, high toward the ear | It works best on someone driving forward with their head low | Roll toward the gripping hand, not away | Pull the elbow back to your ribs as you roll
- Gripping the cross collar (that's the cross collar choke, a different set-up) | Rolling the wrong way, which opens the loop | Trying it when their head is high and their back is straight
x Keep your head up and your posture tall | Pull the head out the back before they roll | Walk your feet around in the direction of the roll so the loop stays loose | Pin the gripping arm and pass
v cross-collar-closed-guard, baseball-bat-choke, guillotine-closed-guard
n Popular in judo and MMA-era jiu-jitsu, and a favorite counter when someone shoots a takedown into your guard. The drawings can't show the roll, so the guard pictures stand in for it.

@ baseball-bat-choke | Baseball bat choke
f gi-cutter
k submission / choke
p knee-on-belly
s modern
g gi
l blue
a Baseball choke | Bat choke | Baseball bat collar choke
= From side control or knee on belly, grab their collar with both hands like you're holding a baseball bat (one thumb in, one thumb out), then walk around their head and turn to tighten.
1 knee-on-belly | From knee on belly (or side control), slide the hand nearest their head into the near side of their collar, thumb inside, deep toward the back of the neck.
2 side-control | Put your other hand just in front of the first, thumb out, palm facing you. Your two hands now hold the collar like a baseball bat, knuckles of both on the neck.
3 north-south | Step around toward their head, toward north-south. As you walk, your wrists cross their throat.
4 north-south | Keep turning. Drop your chest to the mat and rotate your body away so the hands twist the collar tight like wringing a towel.
5 side-control | Some finish it by rolling over their head instead: keep the grips and roll, landing on your side. Either way the hands twist the collar closed.
+ Both grips deep, both close to the neck | One thumb in, one thumb out: that's the bat | The choke comes from walking around the head and turning, not from pulling | It also works from bottom half guard or when they turtle
- Holding the grips loose so they slip when you move | Pulling straight up instead of turning | Going so far around the head that you lose the pin and they turn in
x Tuck the chin and turn toward you before you walk | Grab your wrists and keep them from crossing | Turn in to face you and come to your knees | Bridge and push your hips away as you step around
v loop-choke, bread-cutter-choke, paper-cutter-choke, cross-collar-mount
n Popularized in modern competition (Rodolfo Vieira and others used it often). The rolling finish looks dramatic, but the walk-around finish is the one to learn first.

@ bread-cutter-choke | Bread cutter choke
f gi-cutter
k submission / choke
p side-control
s classic
g gi
l blue
a Bread cutter | Collar cutter from side control | Forearm collar choke
= From side control, grab their far collar deep with the hand nearest their head, lay that forearm across their throat and drive your weight down through it like slicing a loaf of bread.
1 side-control | Hold side control with your chest on theirs. Use your hip-side hand to pull their far collar open.
2 side-control | Feed the far collar to your head-side hand: four fingers inside, thumb outside, knuckles reaching the far side of the neck.
3 side-control | Lay that forearm flat across their throat. Your elbow ends on the near side of their neck.
4 side-control | Grab your own wrist or post on their far shoulder with the other hand, then lift your chest and drive your weight down through the forearm while you pull the collar tight.
+ A deep collar grip that reaches the side of the neck | The forearm lies across the neck, not across the jaw | The weight comes from your chest and hips, not your arm | Stay heavy in side control while you set it up
- A shallow grip that only crushes the windpipe | Lifting off them so they shrimp away | Leaving the elbow up in the air instead of across the neck
x Turn in to face you and tuck the chin | Frame on your neck and hips before the forearm lands | Hold the gripping wrist and pull it off the collar | Bridge and shrimp the moment your chest lifts
v paper-cutter-choke, baseball-bat-choke, brabo-choke
j
n The name is the motion: your forearm saws down across the neck like a bread knife. Some gyms swap the names of this and the paper cutter, so check what your instructor calls each.

@ paper-cutter-choke | Paper cutter choke
f gi-cutter
k submission / choke
p side-control
s classic
g gi
l blue
a Paper cutter | Guillotine collar choke from side control | Collar choke from side control
= From side control, feed their near collar to the arm cradling their head, grab it deep, then bring your other forearm across their throat and hinge it down to the mat like closing a paper cutter.
1 side-control | From side control, slide the arm nearest their head under their neck, cradling the head.
2 side-control | With your other hand, pull their near collar open and feed it to the hand under their head. Grab it deep, thumb inside.
3 side-control | Bring your free forearm across their throat, elbow on the far side of their neck, hand next to the collar grip.
4 north-south | Drop that elbow down toward the mat on the far side while you pull the collar grip toward you. Hinge, like closing the blade of a paper cutter.
+ Feed the collar so the grip is deep before the forearm comes over | The forearm acts as the blade and the collar as the hinge | Hips low, chest heavy | Drop the elbow to the mat; don't push the throat straight down
- A shallow collar grip | Lifting the chest and letting them turn in | Pushing on the windpipe instead of closing the sides of the neck
x Turn toward you and get the near elbow under your hips | Grab the forearm before it crosses the neck | Bridge into you as you lift to bring the forearm across | Tuck the chin and turn it toward the collar grip
v bread-cutter-choke, baseball-bat-choke, brabo-choke, north-south-choke
n Different gyms swap the names of this and the bread cutter. The idea of both is the same: one hand on the collar, one forearm across the neck.

@ ezekiel-gi-mount | Ezekiel choke from mount (gi)
f ezekiel
k submission / choke
p mount
s classic
g gi
l white
a Ezequiel choke | Sode-guruma-jime | Sleeve choke | Sleeve wheel choke
= From mount, put one arm behind their head and grab inside your own other sleeve, then slide the blade of your other hand across their throat and pull both together.
1 mount | From mount, slide one arm under the back of their head. Post on your head or keep your hips heavy for base.
2 mount | With that arm, grab inside the sleeve of your other arm at the forearm, four fingers in.
3 mount | Bring the free hand, the one whose sleeve you're holding, across their throat, knife edge first, to the far side of their neck.
4 mount | Pull the sleeve and drive the knife-edge hand down and through the neck, like a scissors closing. Keep your chest low.
+ The hand behind the head grabs your sleeve: you need your own gi | Knife edge of the hand across the throat, thumb up | Low chest and wide knees so you can't be rolled | It works from inside their closed guard and from side control too
- Sitting up tall, so a bridge takes you over | Grabbing the sleeve so far from the wrist that the arm behind the head is loose | Pushing straight down on the windpipe instead of cutting across the neck
x Bridge and roll toward the arm behind the head | Tuck the chin and turn it toward the blade | Push the blade arm off the neck with both hands | Elbow escape while the attacker's hands are busy
v ezekiel-nogi-mount, ezekiel-inside-guard, cross-collar-mount, arm-triangle-mount
j sode-guruma-jime
n Named after Ezequiel Paraguassu, a Brazilian Olympic judoka who used it often in Rio jiu-jitsu academies. Judo calls it sode-guruma-jime, the "sleeve wheel" strangle.

@ ezekiel-inside-guard | Ezekiel choke inside closed guard
f ezekiel
k submission / choke
p top-closed
s classic
g gi
l blue
a Ezekiel from inside the guard | Sode-guruma-jime from guard | Guard Ezekiel
= When they pull you down and wrap your head in their closed guard, slide your arm behind their head, grab your own sleeve and choke them with your other hand from inside their guard.
1 closed-guard ! | You're inside their closed guard and they pull your head down and hug you around the neck or shoulders.
2 closed-guard ! | Instead of fighting to posture up, slide one arm under the back of their head and grab inside your other sleeve.
3 closed-guard ! | Bring the free hand across their throat, knife edge first.
4 closed-guard ! | Drop your weight forward onto the blade and pull the sleeve. Keep your knees wide so they can't sweep you.
+ It turns their best defense (breaking your posture) into your attack | Keep your base wide while you choke | Knife edge, thumb up, across the side of the neck | Use it when the head is trapped anyway
- Leaving your hips light so they sweep or armbar you | Gripping the sleeve so loosely the choke never tightens | Forgetting your other arm can be armbarred if it lingers
x Push the attacker's head away to make space | Armbar the arm across the throat | Tuck the chin and turn into the blade | Open the guard and hip escape out to the side
v ezekiel-gi-mount, ezekiel-nogi-mount, cross-collar-closed-guard
j sode-guruma-jime
n The drawing shows closed guard with you on top. It's a standard answer to being broken down in the guard.

@ brabo-choke | Brabo choke (lapel D'Arce)
f darce
k submission / choke
p front-headlock
s modern
g gi
l purple
a Brabo | Lapel D'Arce | Gi D'Arce | Lapel arm-in choke | Lapel choke from the front headlock
= From a front headlock or turtle, pull out their lapel, feed it under their neck and through to your other hand, then pin their arm against their neck and squeeze like a D'Arce.
1 front-headlock | From the front headlock (or the side of their turtle), pull their lapel out from under their arm on the side you'll trap.
2 turtle | Thread your arm under their armpit and neck, and pass the lapel through to that hand, so the lapel loops around their neck and arm.
3 turtle | Grab the lapel deep with the threaded hand, close to their neck, and pull it tight.
4 arm-triangle | Sprawl or roll to your side so their arm is jammed against their own neck. Pull the lapel and drive your shoulder in to finish.
+ Feed the lapel from their side, not yours: pull it out first | Their arm must be stuck against their neck | Drive your shoulder into their arm as you pull | It also works from top half guard and side control when their arm is under your neck
- Feeding a short lapel that won't reach your hand | Leaving their arm out of the choke | Pulling straight up instead of across the neck
x Keep your elbows tight so the lapel can't be pulled out | Turn your head toward the trapped arm | Sit back to guard before the lapel is fed | Grab your own lapel and pull it back
v darce-front-headlock, anaconda-front-headlock, brabo-side-control, clock-choke
n Brabo is a Brazilian name for the head-and-arm lapel choke. The drawing for the finish shows an arm triangle, which is the same head-and-arm idea.

@ brabo-side-control | Brabo choke from side control
f darce
k submission / choke
p side-control
s modern
g gi
l purple
a Lapel arm triangle | Brabo from side control | Lapel head-and-arm choke | Lapel choke from side control
= From side control, pull out their lapel, feed it under their neck around their arm, and choke them with their own arm and lapel while you walk your body toward their head.
1 side-control | From side control, use your near hand to pull out their far lapel (or their near lapel) so you have a long tail.
2 side-control | With your head-side arm, reach under their neck and around their near arm, so the arm is trapped against the neck. Pass the lapel to that hand.
3 arm-triangle | Grab the lapel deep, pull it toward their head and drop your shoulder into their trapped arm.
4 arm-triangle | Walk your hips out toward their head and squeeze. Their own arm and lapel close the neck.
+ Pull out a long lapel first | Their arm has to be stuck against their neck | The pressure comes from your shoulder and your weight, not your arms | Walk toward their head to tighten
- Leaving their arm out, so it only pushes the jaw | A short lapel grip that keeps slipping | Lifting your chest off them while you thread the lapel
x Pull the trapped arm out and frame | Turn into you and pull guard | Grab the lapel and pull it back | Tuck the chin and turn it toward the trapped arm
v brabo-choke, arm-triangle-side, bread-cutter-choke, paper-cutter-choke
n A gi version of the arm triangle: the lapel does the job of your second arm.

@ knee-on-belly-collar-choke | Collar choke from knee on belly
f cross-collar
k submission / choke
p knee-on-belly
s classic
g gi
l blue
a Knee-on-belly cross choke | Knee-on-stomach collar choke | Kata-juji-jime from knee on belly
= From knee on belly, slide one hand deep into their far collar, put the other on their near collar or shoulder, and drop your weight forward to close the collar around their neck.
1 knee-on-belly | From knee on belly, use your belt-side hand to pull open their far collar.
2 knee-on-belly | Feed it to your head-side hand. Grab deep, thumb inside, knuckles against the side of the neck.
3 knee-on-belly | Put your other hand on their near collar, thumb outside, or flat on their near shoulder.
4 side-control | Drop your chest forward and turn your elbows out, or step your back leg around toward their head. The collar wraps their neck from both sides.
+ A deep first grip is half the choke | Stay heavy on the knee so they can't turn in | Elbows out, chest down: the same finish as the cross collar choke | If they push on your knee, that arm is out for an armbar
- A shallow grip on the front of the throat | Falling forward onto your hands and losing the knee on belly | Pulling the hands to your face instead of opening the elbows
x Push the knee off the belly and shrimp | Turn into you and come to your knees | Grab both wrists to stop the elbows flaring | Tuck the chin and turn toward the first hand
v cross-collar-mount, baseball-bat-choke, bread-cutter-choke
j kata-juji-jime
n A classic Gracie-style knee-on-belly attack. When they push the knee away to defend, the far-side armbar opens up.

@family omoplata | Omoplata & the -platas | Shoulder locks where your legs do the work of your arms: the omoplata and the variations named after it.
@family wristlock | Wrist locks | Bending the wrist past its limit: quick, sneaky and legal at IBJJF from blue belt.
@family slicer | Slicers | Crushing a muscle against a bone with your shin or forearm as the wedge.
@family gogoplata | Gogoplata | Chokes with your shin across the throat from the guard, the heart of 10th Planet's rubber guard.

@ omoplata-closed-guard | Omoplata from closed guard
f omoplata
k submission / shoulder
p closed-guard
s classic
g both
l blue
a Omoplata | Ashi-sankaku-garami | Leg kimura | Leg shoulder lock
= Swing your leg over their shoulder from guard, turn to face their legs and sit up, then turn their trapped arm like a kimura using your legs and hips.
1 closed-guard | Control one wrist and push it toward the mat beside your hip. Open your guard and put the foot on that side on their hip.
2 guard-broken | Shrimp out to that side and swing your other leg over their shoulder, the back of your knee behind their elbow. Turn your body to face their legs.
3 omoplata | Keep your leg heavy on their back so they flatten out on their stomach. Reach your near arm over their back and grab their far hip or belt so they can't roll forward.
4 omoplata | Sit up, scoot your hips away from their head and bend your top leg over your other foot (triangle your feet) to keep the arm pinned.
5 omoplata | Lean forward toward their head, keeping their wrist pinned against your hip. Their shoulder turns, as in a kimura.
+ Flatten them before you sit up: hip on the mat, belt grip | Your shin goes behind their elbow, foot at their face | Scoot away from their head before you lean forward | Their hand stays against your hip
- Leaning forward before they're flat, so they roll out | Staying on your back instead of sitting up | Forgetting the belt or hip grip that stops the forward roll
x Roll forward over the trapped shoulder before you flatten them | Posture up and step the near leg over your head | Grab their own belt or leg to keep the arm bent | Sit back toward your legs and stack you
v kimura-closed-guard, monoplata, tarikoplata, triangle-closed-guard, armbar-closed-guard
n Omoplata is Portuguese for "shoulder blade". Judo knows the lock as ashi-sankaku-garami, but bans it in competition. It also sweeps: if they roll, you come up on top.

@ monoplata | Monoplata
f omoplata
k submission / shoulder
p closed-guard
s modern
g both
l purple
a Mono-plata | One-leg omoplata | Single-leg omoplata
= When they defend the omoplata by posturing up or leaning into you, keep one leg over their shoulder, grab their wrist with both hands and turn their arm up behind them without needing to sit all the way up.
1 closed-guard | Start the omoplata: control a wrist, angle out and swing your leg over their shoulder.
2 omoplata | They block it by posturing up or driving into you, so you can't flatten them and sit up.
3 kimura-guard | Keep that leg locked over their shoulder. Grab their wrist with both hands (or a figure-four grip) on the trapped arm.
4 kimura-guard | Pin their elbow with your leg and pull the wrist up toward their head, turning the shoulder with your arms and the leg together.
+ The leg over the shoulder keeps the elbow from escaping | Both hands on the wrist so the arm can't straighten | Turn the arm the same way as the kimura | It's a way to finish when the full omoplata stalls
- Losing the leg over the shoulder while you switch grips | Pulling the hand away from their back instead of up toward their head
x Straighten the arm and pull it out the bottom | Stack you onto your shoulders | Grab their own belt or lapel to keep the elbow in
v omoplata-closed-guard, kimura-closed-guard, tarikoplata
n The name is used for a few related one-leg shoulder locks, so instructors show slightly different finishes. There's no drawing for it; the kimura picture is the closest match.

@ tarikoplata | Tarikoplata
f omoplata
k submission / shoulder
p closed-guard
s modern
g both
l purple
a Tarik-plata | Tarikoplata shoulder lock
= From the omoplata, when they bend their arm and hide the hand by their back, trap their wrist behind them and lift their elbow up and over with your arm, cranking the shoulder.
1 omoplata | You've gone for the omoplata, but they bent the arm and hid their hand to defend.
2 omoplata | Keep your leg over their shoulder. Push their hand behind their back with your near hand.
3 kimura-guard | Bring your far arm under their elbow and lock it, trapping their wrist between your ribs (or armpit) and their back.
4 kimura-guard | Lift their elbow up and over, using your whole body. The trapped wrist and the lifted elbow turn the shoulder.
+ Their wrist stays pinned against their own back | The lift comes from your body, not your biceps | The leg over the shoulder keeps them from rolling out | It's the answer when they bend the arm to stop the omoplata
- Letting the wrist slip away from the back | Lifting before the elbow is locked
x Roll forward over the shoulder | Straighten the arm and clear it | Posture up out of the leg before the elbow is caught
v omoplata-closed-guard, monoplata, kimura-closed-guard
n Named after Tarik Hopstock, a Norwegian black belt who made it popular around 2015. The drawings can't show the finish, so the kimura picture stands in.

@ gogoplata-rubber-guard | Gogoplata
f gogoplata
k submission / choke
p rubber-guard
s 10p
g both
l purple
a Gogo | Gogo choke | Gogoplata from rubber guard | Shin choke | Kung Fu Move into gogoplata
= From rubber guard, slip your foot under their chin so your shin is across their throat, then pull the back of their head down onto it.
1 closed-guard | Break their posture and hold their head down. Clamp one leg high on their back.
2 rubber-guard | Go to mission control: bring that leg up across their back and hold your own ankle with your arm. Your other hand controls their head.
3 rubber-guard | Move to New York: hold their head and wrist with your hand and leg so their arm is pinned on your chest and their head stays low.
4 rubber-guard | Do the Kung Fu Move: grab your own ankle and push your foot under their chin and out, so your shin crosses their throat.
5 rubber-guard | Grab the back of their head with both hands (or one hand and your toes) and pull it down onto your shin.
+ The shin crosses the throat, not the chin | Keep their head down the whole time | Pull the head down; don't push the shin up | Needs flexible hips: warm up before trying it
- Letting their head come up before the shin is in | Putting the foot across the jaw, which hurts but doesn't choke | Forcing it if your hips don't bend that far
x Posture up and keep the head high | Turn the head toward your shin to relieve the pressure | Pull your foot out from under the chin | Stack you onto your shoulders
v triangle-closed-guard, omoplata-closed-guard, guillotine-closed-guard
n Popularized in MMA in the 2000s by Nick Diaz and Shinya Aoki and taught as part of Eddie Bravo's rubber guard. Most rulebooks treat it as a choke, but some referees call a shin across the jaw a crank, so check the event.

@ mounted-triangle | Mounted triangle
f triangle
k submission / choke
p mount
s classic
g both
l blue
a Triangle from mount | Top triangle | Sankaku-jime from mount
= From high mount, trap one arm and step your knee over that shoulder, then lock a triangle around their head and arm and sit back to choke.
1 mount | Climb to a high mount, knees up under their armpits.
2 s-mount | Push one arm across their body and step your knee up over that shoulder, your shin across their neck.
3 s-mount | Bring your other leg up over their head and lock your ankle behind the knee: a triangle on top. One arm in, one arm out.
4 triangle | Sit back, pull their head up toward you and squeeze your knees together.
5 armbar | If they straighten the arm to defend, the armbar is right there: lean back and lift.
+ Push the arm across first, then lift the knee | Lock the triangle on top, then sit back | Cup the head and pull it up as you sit back | You keep mount the whole time, so there's no escape
- Locking the triangle with both arms in | Sitting back before the lock is tight | Letting them bridge you off while one leg is up
x Bridge as you lift the knee | Pull the trapped arm out | Turn into you and come to your knees
v triangle-closed-guard, armbar-mount, armbar-from-triangle, reverse-triangle
j sankaku-jime
n The drawing for the finish shows a triangle from guard. On top, the lock and squeeze are the same.

@ armbar-from-triangle | Armbar from triangle
f armbar
k submission / elbow
p closed-guard
s classic
g both
l white
a Triangle armbar | Triangle to armbar | Juji-gatame from sankaku
= When the triangle won't finish, the arm inside it is already trapped: straighten it across your hips and lift.
1 triangle | You have the triangle locked, but they defend by posturing or hiding the neck.
2 triangle | Grab their trapped wrist with both hands and pull it across your belly so the elbow points up.
3 guard-broken | Open the triangle slightly and shift your hips to keep the elbow tight to your belt.
4 armbar !~ | Swing your leg over their face, pinch your knees and lift your hips. Their thumb points up.
+ Keep the wrist and the elbow tight to your hips | You don't need to unlock fully: shift to armbar position | Thumb up, hips up
- Letting the arm slip out as you change | Unlocking the triangle before the wrist is under control
x Keep the elbow bent and tight to their body | Stack you and drive forward | Pull the arm out as the legs move
v triangle-closed-guard, armbar-closed-guard, overhook-armbar, biceps-slicer-triangle
j ude-hishigi-juji-gatame

@ overhook-armbar | Armbar from overhook
f armbar
k submission / elbow
p closed-guard
s classic
g both
l blue
a Overhook armbar | Climbing armbar | Whizzer armbar
= From closed guard, wrap their arm deep in an overhook, climb your legs high on their back and swing over the head to straighten the arm.
1 closed-guard | Wrap one of their arms over the top with your arm (an overhook), hugging it tight against your side.
2 closed-guard | Pull them down and climb your legs high on their back, close to their armpits.
3 guard-broken | Put the foot on the overhook side on their hip and turn your body to face the trapped arm.
4 armbar !~ | Swing your leg over their face, pinch your knees and lift your hips. Their thumb points up.
+ The overhook keeps the arm tight against you | High guard before the swing | Turn to face the arm, then swing the leg
- A loose overhook that lets them pull the arm out | Swinging the leg from a low guard
x Pull the arm out as they climb | Posture up before the climb | Stack you onto your shoulders
v armbar-closed-guard, armbar-from-triangle, triangle-closed-guard
j ude-hishigi-juji-gatame

@ kimura-half-guard | Kimura from half guard
f kimura
k submission / shoulder
p half-guard
s classic
g both
l blue
a Half-guard kimura | Ude-garami from half guard | Kimura trap
= When they post a hand on the mat in your half guard, sit up, catch their wrist and wrap a figure four over their arm, then fall back and turn the shoulder.
1 half-guard | Hold half guard with your knee shield or underhook. Wait for them to post the hand on the mat, near your hip.
2 knee-shield | Sit up on your elbow and grab their wrist with your near hand.
3 kimura-guard | Reach over their shoulder with your other arm and grab your own wrist: a figure four.
4 kimura-guard | Fall back to your side, keep the elbow bent at 90 degrees and turn their hand up toward their head.
5 mount | If they roll forward to escape, follow them over and come up on top.
+ Sit up toward the arm | Keep their elbow bent at 90 degrees | Turn the arm with your whole body | The kimura grip also sweeps and takes the back
- Letting the elbow straighten | Staying flat so they lean on you
x Grab their own belt or leg to hide the arm | Roll forward over the shoulder | Flatten you back down before you grip
v kimura-closed-guard, hip-bump, omoplata-closed-guard
j ude-garami

@ wristlock-closed-guard | Wristlock from closed guard
f wristlock
k submission / wrist
p closed-guard
s classic
g both
l blue
r wristlock
a Wrist lock | Lapel-grip wristlock | Chest wristlock | Wrist lock from guard
= When they grip your lapel or push on your chest, trap their hand flat, sit up into it and bend their wrist back toward their forearm.
1 closed-guard | They grip your lapel or push on your chest with one hand.
2 closed-guard | Pin their hand flat to your chest with both hands, palm on their knuckles.
3 kimura-guard | Sit up into them, bending their wrist back. Their forearm turns toward your chest.
4 kimura-guard | Push your chest forward into their hand while you hold it in place. It finishes quickly.
+ Trap the hand flat so they can't let go | Sit up into the wrist; use your chest, not your hands | Go slowly in training: wrists break fast
- Bending the hand without pinning it | Yanking it in training
x Let go of the grip and pull the hand back | Straighten the elbow
v kimura-closed-guard, armbar-closed-guard
n Wristlocks are legal at IBJJF from blue belt. They're quick and painful, so go slowly in training.

@ biceps-slicer-triangle | Biceps slicer from triangle
f slicer
k submission / compression
p closed-guard
s modern
g both
l purple
r bicepslicer
a Biceps slicer | Biceps crusher | Triangle biceps slicer
= When they defend your triangle by bending their arm, put your calf in their elbow pit and pull their wrist toward you, crushing the biceps against your shin.
1 triangle | You've locked a triangle, but they bend their arm and hide the elbow.
2 triangle | Open the lock and put your calf in the crease of their elbow.
3 guard-broken | Grab their wrist with both hands and pull it toward you, closing the elbow on your calf.
4 triangle | Keep pulling until the biceps is crushed against your shin.
+ Calf in the elbow pit | Pull the wrist toward you | Slowly: it tears muscle before it hurts
- Squeezing the forearm instead of the elbow pit | Yanking it fast
x Straighten the arm | Pull the arm out before the leg moves in
v triangle-closed-guard, armbar-from-triangle
n Legal only for brown and black belts at IBJJF. A slicer crushes the muscle against bone, so apply it slowly.

@ reverse-triangle | Reverse triangle
f triangle
k submission / choke
p side-control
s modern
g both
l purple
a Reverse sankaku | Ura-sankaku | North-south triangle
= From side control, step your leg over their head toward north-south and lock the triangle facing their legs, trapping one arm in.
1 side-control | From side control, they hug your back or underhook the far arm.
2 north-south | Walk toward their head and step your far leg over their head, so their near arm stays in.
3 triangle | Lock your legs facing their legs, ankle behind knee.
4 kimura-side | Squeeze your knees. If it won't choke, take the trapped arm with a kimura.
+ One arm in, one arm out | Lock tight before you sit back | The trapped arm is open for a kimura
- Locking both arms in | Leaving space for them to turn in
x Pull the trapped arm out | Turn into you
v triangle-closed-guard, mounted-triangle, sankaku-turnover
n The triangle drawing shows the lock from guard. In the reverse triangle you face the other way.

@ sankaku-turnover | Side triangle (sankaku turnover)
f triangle
k submission / choke
p turtle-top
s judo
g both
l purple
a Sankaku turnover | Side triangle | Yoko-sankaku | Judo triangle
= From the turtle, hook a leg into their near arm and roll them onto their side, then lock the triangle and choke or armbar.
1 turtle | Kneel by their head. Push your shin into the gap between their neck and near arm.
2 turtle | Hook your foot under their far armpit and hold their belt or far arm.
3 triangle | Roll to your side, bringing them over with you onto their side.
4 triangle | Lock your legs and squeeze. If they straighten the arm, take the armbar.
+ The shin goes deep before the roll | Roll toward your shin side | Lock tight once they're on their side
- Rolling before the shin is deep | Letting them sit back out of it
x Keep the elbows tight so no shin gets in | Sit back into guard as they roll
v triangle-closed-guard, reverse-triangle, clock-choke, crucifix-choke
j sankaku-jime
n A judo favorite against a turtled opponent. The triangle drawing shows it from guard, the closest match.

@family anklelock | Ankle & foot locks | Locks on the foot and ankle: the straight ankle lock everyone learns, and the bent-foot locks (Estima, Aoki) that hurt in different directions.
@family toehold | Toe hold | A figure-four grip on the foot that twists it inward. Catch wrestling's classic foot lock.
@family kneebar | Kneebar | An armbar on the leg: the knee straightened backward over your hips.
@family slicer | Slicers & compressions | Crushing a joint by wedging something (your shin, your forearm) behind it and folding the limb closed.
@family legpos | Leg entanglements | The leg-lock positions themselves. Win the position, then the submission: control of their knee decides everything.

@ straight-ankle-lock | Straight ankle lock
f anklelock
k submission / leg
p ashi
s classic
g both
l white
a Straight footlock | Achilles lock | Ankle lock | Chave de pé | Ashi-garami ankle lock | Straight foot lock
= Trap one of their legs between yours in ashi garami, wrap the ankle under your armpit with your forearm under the Achilles, and arch back to bend the foot.
1 x-guard | From open guard or single-leg X, get under one of their legs with both of your legs on it.
2 straight-ankle | Settle into ashi garami: your inside foot on their hip, your outside leg across the back of their thigh, their foot in your armpit on the same side.
3 straight-ankle | Slide your forearm under their Achilles tendon, the hard bone of your wrist against it, and grab your other wrist or their shin (an S-grip or figure four). Keep their toes in your armpit.
4 straight-ankle | Pinch your knees to hold their leg, push their hip away with your inside foot, and arch your back while your forearm lifts into the Achilles.
5 straight-ankle | Turn slightly toward the side of the trapped leg (your "outside" side) to make it tighter. They tap from the ankle and the Achilles.
+ Wrist bone under the Achilles, low on the ankle, not up the calf | Toes jammed in your armpit | Foot on the hip pushes them away: that's half the lock | Arch the back, don't just pull with the arms
- Gripping too high, on the calf | Letting their knee slip past your legs so they can sit up | Leaving their toes free so they point them out of the grip
x Point the toes and turn the heel out of the grip (boot) | Sit up, grab the collar or head, and push the foot on their hip off | Step over and stand up | Counter with your own foot lock from the same position
v estima-lock, aoki-lock, ashi-garami-position, toe-hold, inside-heel-hook
n Legal for every belt under IBJJF and almost everywhere else, so it's the first leg lock most people learn. Judo bans all leg locks. The drawing shows a seated version; in ashi garami your legs are tangled on theirs.

@ estima-lock | Estima lock
f anklelock
k submission / leg
p top-open
s modern
g both
l purple
r toehold
a Estima foot lock | Estima | Reverse toe hold from the top | Foot lock on the hip
= When they plant a foot on your hip from guard, pin it there with your hand on the toes, wrap your other arm around the ankle into a figure four and bend the foot sideways with your hip.
1 open-guard ! | You're passing their open guard. They put a foot on your hip to keep you away.
2 open-guard ! | Trap that foot to your hip: the hand on the same side covers the top of their foot, fingers on the toes.
3 open-guard ! | Bring your other arm around the outside of their ankle, under the heel, and grab your own wrist in a figure four.
4 straight-ankle | Keep the foot glued to your hip and turn your body toward the outside of their leg (or step back). The foot bends and twists against your hip until they tap.
+ The foot stays flat on your hip: your hip is the lever | Grip on the toes, figure four around the ankle | Turn your whole body; it comes on fast | Works from standing, kneeling, or from inside their half guard
- Peeling the foot off your hip first, so there's no lever | Cranking fast: the ankle ligaments go before the pain | Leaving your head down where they can sweep
x Take the foot off the hip the moment a hand covers it | Point the toes and turn the knee out toward the pressure | Sit up and grab the attacker's arm
v toe-hold, straight-ankle-lock, aoki-lock
n Named for brothers Victor and Braulio Estima. Braulio used it to tap Victor in training, and it became famous in the early 2010s. IBJJF treats it like a toe hold: brown and black belt only. There's no drawing of the hip finish; the last picture shows a foot lock from sitting.

@ toe-hold | Toe hold
f toehold
k submission / leg
p top-half
s classic
g both
l purple
r toehold
a Figure-four foot lock | Kimura on the foot | Catch toe hold | Toehold
= Grab their foot by the toes, wrap your other arm around the ankle into a figure four, and turn the foot inward, like a kimura on their ankle.
1 half-guard ! | From top half guard (or any position where you're near their foot), the far foot or the trapped foot comes within reach. Grab the top of their foot at the toes with the hand on that side.
2 half-guard ! | Bend their knee so the foot comes up. Thread your other arm behind the ankle, under the Achilles, and grab your own wrist: a figure four.
3 straight-ankle | Keep the foot tight to your chest, their knee bent, so the leg can't straighten.
4 straight-ankle | Turn their toes toward the inside of their body (toward their other foot), like turning a kimura, using your whole upper body. They tap from the ankle and the knee.
+ Grip the toes and the knuckles of the foot, not the ankle | Keep their knee bent; a straight leg escapes | Pull the foot to your chest and turn it, don't just twist with the wrists | Works from half guard, from ashi garami and from 50/50
- Gripping the middle of the foot, where it slips | Twisting before the figure four is tight | Letting the knee line come free so they can roll with it
x Point the toes and straighten the leg | Roll in the direction of the twist | Push the attacker's head or hips away and pull the foot out
v estima-lock, straight-ankle-lock, fifty-fifty-position, kneebar-top
n Catch wrestlers used it a century ago. The pressure goes into the ankle and the knee, which is why IBJJF keeps it for brown and black belts.

@ kneebar-top | Kneebar
f kneebar
k submission / leg
p top-half
s classic
g both
l purple
r kneebar
a Knee bar | Chave de joelho | Hiza-juji-gatame | Leg bar | Straight kneelock
= Trap one of their legs between yours with your hips just above their knee, hug the foot to your chest and straighten the knee backward over your hips, just like an armbar.
1 half-guard ! | From top half guard, or as they turn away while you pass, get control of one leg. Hug it with both arms.
2 kneebar | Step your leg across their hips and slide to the side, so your hips sit just above their knee and their leg is between your thighs.
3 kneebar | Hug their foot to your chest or shoulder, their heel by your neck, toes pointing outward.
4 kneebar | Pinch your knees together, cross your feet if you can, and lift your hips into the back of their knee while you pull the foot back.
+ Your hips go above the knee: below it and there's no lever | Knees squeezed together around the leg | Heel to your neck, hold it like an armbar | Lift the hips slowly
- Sitting on the lower leg instead of the thigh | Leaving room so they bend the knee | Pulling with the arms only
x Turn and face the attacker, bending the leg | Grab their foot and attack back (toe hold or heel hook) | Push the hips down off your knee and turn in
v toe-hold, inside-heel-hook, saddle-position, straight-ankle-lock
n The finish drawing shows the kneebar after you've rolled through. The same lock is available from the saddle, 50/50, and the back.

@ inside-heel-hook | Inside heel hook
f heelhook
k submission / leg
p saddle
s leglock
g nogi
l brown
r heelhook, reap
a Inside heel hook from the saddle | Inside heel | Honey hole heel hook | 411 heel hook | Inside sankaku heel hook
= From the saddle, trap their knee between your legs, wrap the heel in the crook of your elbow and turn your body so their heel goes toward their other leg.
1 saddle | Get to the saddle (inside sankaku): one leg across their hips, your legs triangled around their trapped leg, their knee pinched between your thighs.
2 saddle | Make the knee line yours. Pinch your knees together above their knee and keep their hips close to yours.
3 heel-hook | Hide their heel under your arm on the side of their foot, the toes in your armpit, and catch the heel in the crook of your elbow.
4 heel-hook | Lock your hands together (a gable grip or a figure four), with the blade of the forearm on the heel.
5 heel-hook | Turn your shoulders slowly toward the outside of their body, so the heel rotates toward their other leg. Stop as soon as they tap.
+ Control the knee line first, the heel second | Grip the heel, not the ankle | Turn your shoulders and hips, not just your arms | Apply it slowly: the knee gets injured before it hurts
- Letting their knee slide out past your legs | Grabbing the heel without hiding the toes, so they slip the foot out | Yanking it in training
x Hide the heel: point the toes and push the heel to the mat | Grab the attacker's foot and fight the triangle open | Turn toward the heel hook to take the pressure off, carefully | Get the knee out past the attacker's hips
v saddle-position, heel-hook-outside, heel-hook-fifty-fifty, kneebar-top, aoki-lock
n The submission at the heart of the leg-lock era (Danaher's "Death Squad", Garry Tonon, Gordon Ryan, Eddie Cummings). Never legal in IBJJF gi divisions. 10th Planet students call the saddle the "honey hole".

@ heel-hook-fifty-fifty | 50/50 heel hook
f heelhook
k submission / leg
p fifty
s leglock
g nogi
l brown
r heelhook
a 50/50 inside heel hook | Fifty-fifty heel hook | Inside heel from 50/50
= In 50/50 your legs and theirs mirror each other; hide their heel under your arm and turn the inside heel hook before they can attack your foot.
1 saddle | Get into 50/50: your outside leg wraps over their hip, their outside leg wraps over yours. Each of you has one of the other's legs trapped.
2 saddle | Hide your own heel first: point your toes, keep your foot on their far side and turn your knee away.
3 heel-hook | Bring their heel under your arm on the inside and lock your hands around it, the blade of your forearm on the heel.
4 heel-hook | Keep your outside leg squeezing their hip, then turn your shoulders away from their body, rotating the heel toward their other leg.
+ Hide your own heel before you attack theirs | Keep the knee line: their knee must not get past your hips | Lock the grip tight to the heel, not the calf | It's a race: whoever is safer attacks first
- Attacking while your own heel is exposed | Loose legs that let them turn out of the position | Leaning back so far that they come up on top
x Hide the heel and attack back | Turn to face the attacker and pull the knee out | Use the free leg to push their knee and clear the 50/50 lock
v fifty-fifty-position, inside-heel-hook, toe-hold, heel-hook-outside
n There's no drawing of 50/50 itself: the saddle drawing is the closest picture of the tangled legs.

@ aoki-lock | Aoki lock
f anklelock
k submission / leg
p ashi
s leglock
g both
l brown
r heelhook
a Aoki foot lock | Aoki heel hook | Twisting straight footlock
= From straight ashi garami, grip the foot as for a straight ankle lock but cup the heel and twist it, so the pressure goes to the knee like a heel hook.
1 x-guard | Enter ashi garami from single-leg X or open guard, with one of their legs between yours.
2 straight-ankle | Settle their foot under your armpit as for a straight ankle lock, your inside foot on their hip.
3 heel-hook | Instead of lifting into the Achilles, cup the back of the heel with your forearm and grab your own hand or wrist.
4 heel-hook | Pinch your knees around their leg and turn your body to rotate the heel inward while your foot on the hip keeps them away. Go slowly.
+ Control the knee with your legs before you turn | It's a twisting lock: treat it like a heel hook | Keep the foot on their hip pushing them away | Turn slowly
- Treating it like a straight ankle lock and cranking hard | Letting their knee slip out | Trying it in a ruleset that bans heel hooks
x Point the toes and pull the heel out | Sit up and turn in the same direction as the twist | Step over and clear the legs
v straight-ankle-lock, inside-heel-hook, estima-lock, ashi-garami-position
n Named for Shinya Aoki, the Japanese submission artist known for unusual leg locks. Rulebooks treat any twisting heel attack as a heel hook, so check the event before you use it.

@ calf-slicer | Calf slicer
f slicer
k submission / compression
p truck
s 10p
g both
l purple
r calfslicer
a Calf crusher | Calf crank | Truck calf slicer | Leg slicer | Calf compression
= Wedge your shin behind their knee, then fold their leg closed over it by pulling the foot toward their butt; the shin crushes the calf.
1 turtle | From the turtle or from the back, get one of their legs: your leg goes over and under it so your shin sits behind their knee.
2 back | Roll to the truck: their trapped leg is triangled in your legs, and you're beside or behind them with their hips turned.
3 kneebar | Grab their foot with both hands (or under your arm) and make sure your shin, not your knee, is in the bend of their knee.
4 kneebar | Lock your legs tight and pull their foot toward their butt. The knee folds over your shin and the calf is crushed.
+ The shin bone goes deep in the back of the knee | Lock the legs first, then fold the foot | Pull the foot in a straight line toward their hips | Slow: the knee ligaments are under pressure too
- Your knee in the bend instead of the shin, so nothing crushes | Twisting the foot sideways | Rushing before the legs are locked
x Straighten the leg before the shin gets in | Turn toward the attacker and face them | Grab the foot and fight the hands off
v kneebar-top, inside-heel-hook, saddle-position
n A 10th Planet staple from the truck, where Eddie Bravo's students also hit the twister and the banana split. IBJJF allows it only for brown and black belts. There's no truck drawing: the steps show the turtle, the back, and the kneebar picture as the closest finish.

@ ashi-garami-position | Ashi garami (straight ashi)
f legpos
k transition
p ashi
s leglock
g both
l blue
a Straight ashi | Single-leg X | Standard ashi garami | SLX | Ashi
= The basic leg entanglement: their leg between yours, your outside leg behind their thigh, your inside foot on their hip. Every leg lock starts here.
1 open-guard | From open or butterfly guard, get under one of their legs.
2 x-guard | Pull their foot to your armpit and put your outside leg behind their thigh, the knee wrapped around it.
3 straight-ankle | Put your inside foot on their hip, toes pointing out, and pinch your knees together.
4 straight-ankle | Keep their hips away with the foot on the hip and their knee pinned with your legs. From here: the straight ankle lock, the Aoki lock, or move to outside ashi or the saddle.
+ Inside foot on the hip keeps them from sitting up into you | Knees pinched: if their knee slips out, you've lost it | Their toes in your armpit | Legal for everyone: no reaping, no twisting
- Feet crossed over their leg, so they can't be broken free but you've no control | Letting them stand tall and walk away | Your foot falling off the hip
x Step over and stand up | Sit up and grab the attacker's head or arms | Point the toes and pull the foot out
v straight-ankle-lock, aoki-lock, outside-ashi-position, saddle-position, fifty-fifty-position
n "Single-leg X" is the gi name for almost the same position, used for sweeps: one foot on the hip, the other leg hooked behind the knee. Leg-lockers use it to finish instead.

@ saddle-position | Saddle (inside sankaku)
f legpos
k transition
p saddle
s leglock
g nogi
l brown
r reap
a Inside sankaku | Honey hole | 411 | 4-11 | Inside ashi | Saddle
= Your legs triangle around one of their legs from the inside, with one leg across their hips. It's the strongest leg-lock position: inside heel hook, kneebar and toe hold are all there.
1 x-guard | From single-leg X or straight ashi, get one of their legs between yours.
2 saddle | Swing your outside leg across their hips, from the outside in, so it lies between their legs.
3 saddle | Triangle your legs: the foot of your top leg behind the knee of your bottom leg. Their knee is trapped between your thighs.
4 saddle | Sit your hips close to theirs and pinch your knees. Their other leg is free but can't reach you. Attack the inside heel hook.
+ Knees pinched, hips close: the knee must not slide out | Your triangle is behind their knee, not on the shin | Control their free leg with a hand or your other leg | This position reaps the knee: illegal in IBJJF below brown belt, and never in the gi
- Loose legs that let the knee out | Triangling too low on their leg | Reaching for the heel before the position is set
x Hide the heel and get the knee out past the attacker's hips | Use the free foot to push the attacker's knee and break the triangle | Turn and face the attacker, then clear the knee
v inside-heel-hook, kneebar-top, ashi-garami-position, outside-ashi-position, fifty-fifty-position
n Called the "411" or "honey hole" in 10th Planet and catch circles. Danaher's name, inside sankaku, means "inside triangle". Because one leg crosses their body, it's a reap under IBJJF.

@ outside-ashi-position | Outside ashi garami
f legpos
k transition
p outside-ashi
s leglock
g nogi
l purple
r reap
a Outside ashi | Outside single-leg X | Outside ashi garami
= Like straight ashi, but your outside leg crosses over the top of their hip; it's where the outside heel hook lives.
1 x-guard | From straight ashi or single-leg X, keep their leg trapped between yours.
2 heel-hook | Lift your outside leg and cross it over the front of their hip, so your foot comes to the far side of their body.
3 heel-hook | Lock your feet (or triangle them) on the outside of the leg and pinch their knee.
4 heel-hook | Hide their heel under your arm and attack the outside heel hook, turning away from them. Or swing the top leg back inside for the saddle.
+ Knee line first: their knee must stay between your thighs | Lock your feet on the outside for control | It's a reaping position under IBJJF | Bridges to the saddle and to 50/50
- Locking your feet where they can push them apart | Leaving their knee free to turn out
x Turn the knee away and hide the heel | Clear the top leg off the hip with your hands | Spin out with the heel hook to take the pressure off
v heel-hook-outside, ashi-garami-position, saddle-position, fifty-fifty-position
n Not to be confused with cross ashi, a different position where your legs cross over their body toward the saddle. Names vary a lot between schools, so learn the position by where your legs are.

@ fifty-fifty-position | 50/50 guard
f legpos
k transition
p fifty
s modern
g both
l purple
a 50/50 | Fifty-fifty | 50/50 guard | Mirrored leg entanglement
= Both of you have the other's leg wrapped the same way, a mirror image. In the gi it's a sweeping and stalling position; in no-gi it's a heel-hook race.
1 x-guard | From open guard, a single-leg X or a de la Riva, get one of their legs between yours.
2 saddle | Swing your outside leg over their hip and lock it behind their leg, while they do the same to yours. Your legs mirror theirs.
3 saddle | Lock your feet together (triangle) or cross them, pinch your knees, and hide your heel.
4 saddle | In the gi: grab their collar or sleeve, come up to your knees and sweep. In no-gi: hide your heel and race for theirs (50/50 heel hook, toe hold).
+ Hide your heel first | Knees pinched to control their knee | In the gi it's legal for all belts and good for sweeps | Know whether the event allows heel hooks before you pull it
- Leaning back and leaving your heel exposed | Loose legs, so the knee slides out | Stalling until you're penalized
x Hide the heel and attack back | Push the knee out with the free leg | Stand up and back out before the legs lock
v heel-hook-fifty-fifty, toe-hold, saddle-position, ashi-garami-position
n Made famous in the gi by the Mendes brothers and Ryan Hall in the late 2000s. There's no 50/50 drawing: the saddle is the closest picture.

@family butterfly-sweeps | Butterfly guard sweeps | Sweeps from sitting up with your feet hooked inside their thighs: you lift them with a hook while your arms take away the post on one side.
@family open-guard-sweeps | Open-guard sweeps | Sweeps from open and sitting guard, many of them against an opponent who stands up: take a foot (or both) away and push the hips, and they fall like a tree.

@ scissor-sweep | Scissor sweep
f scissor
k sweep
p closed-guard
s classic
g both
l white
a Tesoura | Scissors sweep | Knee-shield scissor | Shin-across sweep
= Get on your side, put your shin across their belly like a bar, and chop their knee out with your bottom leg while your grips pull them over the shin.
1 closed-guard | Grip their sleeve with one hand and their collar (or the back of the neck in no-gi) with the other. Break their posture a little so their weight comes forward.
2 guard-broken | Open your guard and hip out to the side of your collar hand so you're on your hip, not flat on your back.
3 scissor-sweep | Slide your top shin across their belly, knee pointing out past their hip, foot hooked at their far side. Drop your bottom leg to the mat against the outside of their near knee.
4 scissor-sweep | Pull with both grips to load their weight onto your shin, then kick the top leg over and chop the bottom leg back at the same time, like closing scissors.
5 mount | They fall onto the side of the arm you're holding. Follow them over and come up in mount, still holding the sleeve.
+ Hip out first: done flat on your back it has no power | Hold the sleeve on the side they fall to, so they can't post a hand | Pull them onto the shin before you chop; their weight has to be on you | Chop low, at the knee or ankle, not the thigh
- Staying square with no angle | Kicking with the top leg while they still sit back on their heels | Letting go of the sleeve, so they post and stop it
x Keep the posture tall so the shin can't load their weight | Post the free hand or step the near leg up | Pass over the shin before it's set (knee cut)
v flower-sweep, hip-bump, push-sweep, knee-shield-sweep
n In no-gi, swap the sleeve for an overhook or a wrist grip and the collar for a hand behind the neck.

@ flower-sweep | Flower sweep
f scissor
k sweep
p closed-guard
s classic
g both
l white
a Pendulum sweep | Pêndulo | Pendulum | Flower
= Trap one of their arms to your chest, scoop their opposite leg with your other arm, then swing your leg like a pendulum to roll them over the side they can't post.
1 closed-guard | Trap one of their arms: grab the sleeve (or the wrist in no-gi) and pin it to your chest so they can't post with it.
2 guard-broken | Open your guard and hip out a little toward the leg on the far side. Reach your free arm under that leg and grab the pants at the knee or ankle (or cup behind the knee).
3 flower-sweep | Kick the leg on the trapped-arm side high up across their back, then swing it down hard like a pendulum while your other leg pushes on their hip.
4 flower-sweep | At the same time lift the leg you're holding. They tip toward the trapped arm with nothing to post on.
5 mount | Ride the momentum over and come up in mount. Keep the arm trapped as you land.
+ The arm you trap and the side they fall to are the same | Swing the leg with power, like a pendulum: the momentum does the work | Lift the far leg as you swing; that's what takes away their base | Do it as soon as they lean onto that arm
- Not trapping the arm, so they post and stop the sweep | Holding the leg too low, at the foot, so it slips | Swinging slowly with no hip movement
x Widen the base and lean back toward the far leg | Free the trapped arm and post it | Stay heavy and pass as the guard opens
v scissor-sweep, hip-bump, armbar-closed-guard, triangle-closed-guard
n The swing threatens the same things as the armbar and triangle from closed guard, so mixing them makes all three better.

@ butterfly-sweep | Butterfly sweep
f butterfly-sweeps
k sweep
p butterfly
s classic
g both
l white
a Hook sweep | Elevator sweep | Butterfly hook sweep | Basic butterfly sweep
= Sit up with an underhook and both hooks in, trap their other arm, then fall to the trapped-arm side and lift them over with the hook on the underhook side.
1 butterfly | Sit up tall with both feet hooked inside their thighs. Get one underhook deep around their back and put your head on their chest on that side.
2 butterfly | With your other hand, trap their opposite arm: an overhook, or a grip on the sleeve or triceps, so they can't post on that side.
3 butterfly-sweep | Fall sideways onto the shoulder of your trapping side, pulling them on top of you with the underhook.
4 butterfly-sweep | Lift with the hook on your underhook side, elevating their leg up and over. They tip over onto the trapped arm.
5 mount | Follow them over, take the hook out and come up in mount or side control.
+ Sit up, head on their chest: from flat on your back the hooks have no lift | Fall to the side of the arm you trap | The lifting hook is on the underhook side | Pull them onto you before you lift; their hips have to be over yours
- Leaning back and lifting with both legs straight up | Not trapping the arm, so they post and base out | Underhook too shallow to pull them in
x Flatten them with chest pressure before they sit up | Post the far hand and widen the free leg | Whizzer the underhook and push their head down
v x-guard-entry, arm-drag-to-back, collar-drag
j sumi-gaeshi
n Judo's sumi-gaeshi ("corner reversal") is the same lifting hook on a standing opponent.

@ tripod-sweep | Tripod sweep
f open-guard-sweeps
k sweep
p open-guard
s classic
g both
l blue
a Tripé | Ankle-hook sweep | Foot-on-hip sweep
= When they stand in your open guard, catch one ankle with your hand and your foot behind the heel, push their far hip with your other foot, and they fall straight back.
1 open-guard | They stand up in your open guard. Grab behind one of their ankles (the pants cuff in the gi) and pull it tight to your hip.
2 open-guard | Hook the foot on that same side behind their heel, so the ankle is held from the back by both your hand and your foot.
3 open-guard | Put your other foot on their hip on the far side. That's the tripod: hand, heel hook and foot on the hip.
4 ankle-pick | Pull the ankle toward you and push the hip away hard. They can't step back with the trapped leg, so they fall straight back.
5 mount | Come up as they fall: technical stand-up into a pass, or sit up and follow into the top position.
+ The trapped heel can't move: hand and foot both behind it | Push the hip, don't just kick at it | Keep them close; too far away and the push has nothing to work with | If they lean forward to stop it, switch to the sickle sweep
- Grabbing the ankle but leaving the heel free to step back | Pushing on the stomach instead of the hip | Being too far away for the foot to push
x Lean forward into the push | Step the free leg back early to widen the base | Pull the trapped leg free and pass
v sickle-sweep, push-sweep, technical-stand-up
n The drawings don't have a standing-opponent open guard; the ankle pick is the closest picture of taking the trapped ankle as they fall.

@ sickle-sweep | Sickle sweep
f open-guard-sweeps
k sweep
p open-guard
s classic
g both
l blue
a Foice | Sickle | Ankle-chop sweep
= The partner of the tripod: when they lean forward against the push, hold their near ankle and chop the back of their other ankle with your leg like a sickle.
1 open-guard | You have the tripod grips: one ankle held by your hand, your foot behind that heel. They lean forward to stop you pushing them back.
2 open-guard | Keep the ankle tight to your side. Take the foot off their hip and drop that leg to the mat.
3 ankle-pick | Swing the leg along the mat and chop it into the back of their other ankle, like a sickle blade, while you pull the held ankle.
4 ankle-pick | With both feet taken out from under them they sit down hard on their back.
5 mount | Sit up and come forward on top before they recover their guard.
+ Pair it with the tripod: one goes back, one goes forward | Chop low, at the heel, not the calf | Keep the held ankle tight; that leg can't step | Do it the moment they lean in
- Chopping too high, where the leg just bends | Letting go of the held ankle | Chopping slowly, so they step away
x Step the chopped leg back over your leg | Drop the weight low and pass | Free the held ankle first
v tripod-sweep, push-sweep, technical-stand-up
n Foice is Portuguese for sickle. There's no drawing of the standing open guard; the ankle pick is the closest picture of the legs being taken out.

@ push-sweep | Push sweep (double ankle sweep)
f open-guard-sweeps
k sweep
p open-guard
s classic
g both
l white
a Double ankle sweep | Ankle-grab push sweep | Push sweep
= When they stand up in your guard, cup both heels, put your feet on their hips and push them over backward with your legs.
1 closed-guard | They stand up in your closed guard to open it. Keep your legs locked until they're up.
2 open-guard | Reach both hands behind their heels and cup them tight (pants cuffs in the gi) so neither foot can step back.
3 open-guard | Open your legs and put both feet on their hips, or their thighs just above the knees.
4 ankle-pick | Pull the heels toward you and push with both legs. With no foot free to step back, they fall straight back.
5 mount | Follow them up: technical stand-up into a pass, or come forward and settle on top.
+ Heels first, push second | Push with both legs at the same time | Hold the heels until they hit the mat | Come up right away so they can't sit up into guard
- Pushing before both heels are trapped | Feet on the stomach instead of the hips | Lying there after the sweep instead of following them
x Drop the hips low and step back before the heels are cupped | Stay low and pin your legs as they open | Push the knee down and pass
v lumberjack-sweep, tripod-sweep, sickle-sweep, technical-stand-up
n A self-defense staple, taught early in the Gracie basics. The drawings don't have a standing-opponent open guard; the ankle pick is the closest picture of their feet being taken.

@ lumberjack-sweep | Lumberjack sweep
f open-guard-sweeps
k sweep
p closed-guard
s classic
g both
l blue
a Timber sweep | Double heel sweep from closed guard | Roger Gracie lumberjack
= When they stand up in your closed guard, keep it locked, grab both heels and sit up into their hips: they fall back like a chopped tree and you land in mount.
1 closed-guard | They stand up in your closed guard. Keep your legs locked tight around their waist.
2 closed-guard | Let go of the grips and reach behind both heels, cupping them (pants cuffs in the gi).
3 hip-bump | Sit up into them and drive your hips forward into their hips, pulling the heels toward you.
4 hip-bump | With their feet held, they can't step back: they fall straight back, carrying you with them.
5 mount | Land on top already in mount, legs still around them until you settle.
+ Keep the closed guard locked: it ties your hips to theirs | Drive the hips forward, not up | Hold the heels the whole way down | Do it as they stand, before they find their base
- Opening the guard too early so they step back | Grabbing only one heel | Leaning back instead of driving forward
x Stay low and don't stand all the way up | Step back and break the guard before the heels are cupped | Push the head down as they sit up
v push-sweep, hip-bump, scissor-sweep
n Roger Gracie made it famous in the gi. The hip bump drawing is the closest picture of sitting up into them.

@ collar-drag | Collar drag
f open-guard-sweeps
k backtake
p seated
s classic
g gi
l blue
a Collar drag to the back | Drag down | Collar pull
= From sitting guard, grab the back of their collar, pull their head down and to the side as you slide your hips out, and their momentum carries them past you so you take the back.
1 open-guard | Sit up in front of them, one foot on their knee or hip, and grab the collar behind their neck on the near side, deep.
2 open-guard | With your other hand control the opposite sleeve or elbow, or put that hand on the mat to post.
3 butterfly-sweep | Pull the collar down hard toward the mat while you slide your hips out to the opposite side. They stumble forward past you.
4 turtle | As their head goes past, come up on your knees beside them, chest on their back.
5 back | Get a hook in and a seatbelt grip, or follow the turtle and take the back.
+ Pull down and across, not just toward you | Move your hips out of the way; they need room to fall | It works best when they step forward or lean in | Follow straight to the back before they recover
- Pulling straight back so they land on you | Shallow grip that slips off the collar | Not moving your hips
x Keep posture and the head up | Step back as the drag starts | Turn to face you after the first pull
v arm-drag-to-back, butterfly-sweep, technical-stand-up
n In no-gi the same idea is the snap-down or arm drag. There's no drawing of the drag itself; the butterfly sweep is the closest picture of them going past you.

@ omoplata-sweep | Omoplata sweep
f omoplata
k sweep
p closed-guard
s classic
g both
l blue
a Omoplata roll | Omoplata to top
= When they keep their weight back to stop the omoplata, sit up, reach over their back to the far hip, and roll them over the trapped shoulder to end on top.
1 omoplata | You have the omoplata set, their arm trapped under your legs, but they posture back and keep their weight off the shoulder.
2 omoplata | Sit up and reach your arm over their back to grab the far hip or the belt so they can't roll forward out of it.
3 omoplata | Walk your hips away from their head and keep your legs heavy on the trapped shoulder.
4 omoplata | Drive your weight across their back. With the arm trapped they can't post on that side and roll onto their back.
5 side-control | Come up on top in side control, or keep the legs on the shoulder and finish the omoplata there.
+ Grab the far hip so they can't forward roll out | Walk the hips out before you drive | Keep your legs heavy on the shoulder the whole time | The sweep and the submission threaten each other
- Leaving their far hip free so they roll forward | Not sitting up, so you stay under them | Letting the legs loosen
x Forward roll out before the far hip is caught | Pull the trapped arm out and stack | Posture up hard
v omoplata-closed-guard, kimura-closed-guard, hip-bump
n The omoplata drawing is the best match for the whole sequence.

@ technical-stand-up | Technical stand-up
f open-guard-sweeps
k transition
p seated
s classic
g both
l white
a Technical lift | Self-defense stand-up | Base stand-up | Get-up
= From sitting on the mat, post one hand behind you and the opposite foot, lift your hips and swing the other leg back through to come up in a fighting stance, out of reach.
1 open-guard | You're sitting on the mat. Post one hand behind you and the opposite foot in front of you, sole flat.
2 open-guard | Keep the other hand in front of your face or on their knee, and your free leg ready to kick.
3 stand | Lift your hips off the mat on the hand and foot, and swing the free leg back between them, behind you.
4 stand | Step back to your base, hands up, and face them in a stance.
+ Post on the hand and the opposite foot | Swing the leg back, not forward | Keep the other hand up until you're standing | Come up out of range
- Standing up straight forward into them | Leaning on the free hand so the face is open | Bringing the leg forward and kneeling
x Close the distance while they're posting | Grab the posted leg | Push them back down
v push-sweep, tripod-sweep, collar-drag
n A Gracie self-defense basic: the safest way to stand up when someone's in front of you. The drawings start from the open guard and end standing.

@ balloon-sweep | Balloon sweep
f open-guard-sweeps
k sweep
p open-guard
s classic
g both
l blue
a Overhead sweep | Tomoe-nage sweep | Balloon
= With both feet on their hips and grips on the arms, pull them in over you and extend your legs to float them overhead, then roll back into mount.
1 open-guard | Get both feet on their hips and grip their sleeves (no-gi: the wrists or behind the neck).
2 open-guard | Pull them in so their weight comes forward over your knees.
3 j-tomoe | Extend your legs straight up as you pull, floating their hips over your head.
4 j-tomoe | Keep the grips and let them pass over you.
5 mount | Roll back over your shoulder and come up in mount as they land.
+ Pull first, lift second | Feet on the hips, not the stomach | Keep the grips through the roll | Commit and follow them over
- Lifting before their weight is over you | Feet too low so they slide | Letting go of the grips
x Drop the hips and pull back | Step a foot forward to base | Break a grip before they're lifted
v push-sweep, butterfly-sweep
j tomoe-nage
n The judo throw tomoe-nage is the same idea from standing.

@family dlr-game | De La Riva & berimbolo | Sweeps and back takes from the De La Riva hook (outside the leg) and the reverse De La Riva hook (inside the leg).
@family x-guard-game | X-guard & single-leg X | Getting under their hips with your legs scissored on one of their legs, then standing up or kicking them over.
@family spider-lasso | Spider, lasso & lapel guards | Gi guards that control the sleeves and lapels with your feet and legs so they can't pass or posture.
@family modern-entry | K-guard & the inside-leg game | The leg-lock-era guard that sweeps, takes the back and enters leg locks from the same inside position.

@ dlr-backward-sweep | De La Riva sweep (ankle grab, push the far hip)
f dlr-game
k sweep
p dlr
s modern
g both
l blue
a Classic De La Riva sweep | DLR trip | De La Riva back sweep | DLR push sweep
= With the De La Riva hook in, hold their near ankle and a sleeve, put your free foot on their far hip and push it away while you pull, so they fall backward over the leg they can't step with.
1 dlr | Hook your outside leg around their lead leg from the outside, foot behind their thigh. Grab their ankle on that side and their opposite sleeve (wrist in no-gi). Your other foot is on their far hip.
2 dlr | Pull the sleeve across toward you and down so their weight shifts onto the hooked leg. Their posture breaks forward.
3 dlr | Kick the far hip away with your free foot while the DLR hook lifts their lead leg. Keep the ankle grip tight to the mat so that foot can't step back.
4 j-landed | They fall to their back. Let go of the sleeve, keep the ankle and technical-stand-up (or come up on your knees) on top, then pass.
5 side-control | Settle into side control or knee on belly to score the sweep.
+ The ankle grip is the anchor: that foot must not move | Pull the sleeve first so their weight goes onto the hooked leg | Push the hip, don't just kick at the knee | Come up fast before they recover guard
- Grabbing the pants high instead of the ankle, so they step free | Pushing before their weight is on the hooked leg | Lying flat while they fall, so they end up in your guard instead of you on top
x Step the hooked leg back and kneel to kill the hook | Strip the sleeve grip and posture | Drop the knee inside the DLR hook (knee cut)
v berimbolo, dlr-to-x-guard, kiss-of-the-dragon, x-guard-back-sweep
n Named for Ricardo De La Riva, who built the guard in the 1980s at Carlson Gracie's academy and used it to beat Royler Gracie.

@ dlr-to-x-guard | De La Riva to X-guard
f dlr-game
k transition
p dlr
s modern
g both
l blue
a DLR to X | Kick-under to X-guard | Marcelo X-guard entry
= From De La Riva, kick their far leg forward to bring their weight over you, slide under their hips and scissor your legs around their lead leg to enter X-guard.
1 dlr | Start in De La Riva with the hook on their lead leg, gripping the ankle and the far sleeve.
2 dlr | Drop your free foot to the inside of their far knee or hip and pull the sleeve so they lean over you.
3 butterfly | Swim underneath: shoulders under their hips, your far arm hugging their lead leg high on the thigh.
4 x-guard | Put the DLR foot behind their far knee and the other foot on their hip crease of the same leg. That's the X: one leg pushing, one leg hooking.
5 x-guard | Keep the near leg hugged to your shoulder. Now stand up or sweep them backward.
+ Their weight must come forward over you before you slide under | Hug the leg high, near the hip, not at the shin | Your head stays close to their knee | Feet stretch apart in opposite directions to keep the X tight
- Sliding under when they're leaning back, so they just sit on you | Hugging the ankle instead of the thigh | Leaving space so they kneel on your face
x Back-step away from the hook before you get under | Drop the knee to the mat and crossface | Sprawl the hips back and flatten you
v x-guard-technical-standup, x-guard-back-sweep, dlr-backward-sweep, slx-technical-standup
n Marcelo Garcia made X-guard famous in the early 2000s with sweeps to set up his back takes. There's no drawing for the slide under; the butterfly picture is the closest.

@ berimbolo | Berimbolo
f dlr-game
k backtake
p dlr
s modern
g both
l purple
a Bolo | DLR inversion back take | Berimbolo roll
= From De La Riva, grab the belt or pants, off-balance them onto their butt, then invert underneath and spin to their back while your DLR hook stays wrapped around their leg.
1 dlr | Lock the De La Riva hook and grab their far pant leg or belt (in no-gi, the far leg or a seatbelt-style grip on the hip). Your other foot pushes their far hip.
2 dlr | Pull them onto your hook and kick the far leg out, so they sit down to the side. Follow them down, staying tight.
3 dlr | Keep the DLR hook in and invert: roll over your shoulders, hips over your head, looking to their back. Pull yourself under them with the belt grip.
4 back | Your DLR leg swings behind their hips and becomes the first hook. Bring your chest around to their back.
5 back | Get the second hook in and grab the seatbelt. If they spin out, take the leg instead (to the crab ride or a heel hook in no-gi).
+ Get them to sit down first: you can't berimbolo someone standing tall | The DLR hook never comes off | Roll over your shoulder, not your neck | Pull yourself under with the grip, don't wait for them to fall onto you
- Inverting while they're still standing on the far leg | Losing the DLR hook during the spin | Rolling straight onto your neck
x Sit back on the hip and keep your back pressed to the mat | Step the near leg over and back-step the other way | Grip the inverting player's pants and follow the spin to their back (the double berimbolo)
v dlr-backward-sweep, kiss-of-the-dragon, rnc-from-back, matrix
n Named after a Brazilian musical instrument, the berimbau. Made famous by the Mendes brothers and Miyao brothers around 2010; it changed sport jiu-jitsu. The drawings have no inverted picture, so step 3 shows De La Riva as the closest match.

@ kiss-of-the-dragon | Kiss of the dragon
f dlr-game
k backtake
p dlr
s modern
g both
l brown
a Reverse DLR back take | Inverted back take | RDLR to back | Rolling back take
= From reverse De La Riva, invert under their hips, roll between their legs and come out behind them with hooks in, without passing their hips the long way around.
1 dlr ~ | Hook your leg inside their lead leg from the inside (reverse De La Riva). Grab their far ankle or pant leg, and their belt from behind if you can reach.
2 dlr ~ | Off-balance them forward, toward your head, so their hips come over your face.
3 dlr ~ | Invert: kick your legs over your head, rolling over your far shoulder between their legs. Keep the reverse hook on their lead leg.
4 back | Come out behind them. The reverse hook becomes your hook on that leg; grab the belt or hip to pull yourself in.
5 back | Get both hooks in and take the seatbelt before they can sit back on you.
+ Bring their hips over your head before you roll | Roll over your shoulder, not your neck | The belt grip pulls you through between their legs | Look at their back, not the ceiling
- Rolling when they're sitting back, which drops their weight on your neck | Letting the reverse hook slip as you invert | Coming out with no grip, so they turn and face you
x Sit back and sit on the inverting head | Step over and pass as they invert | Turn and face them before the hooks are in
v berimbolo, dlr-backward-sweep, rnc-from-back
n The name comes from a 2001 Jet Li film. Invert only with partners who know it; the neck takes the risk. The drawings have no reverse De La Riva or inverted pose, so the mirrored De La Riva picture is the closest.

@ x-guard-technical-standup | X-guard technical stand-up sweep
f x-guard-game
k sweep
p x-guard
s modern
g both
l blue
a X-guard stand-up | Stand-up sweep | X-guard to single leg
= From X-guard, push their far leg away so they do the splits, then technically stand up while hugging their leg and come up into a single-leg finish.
1 x-guard | In X-guard: your near arm hugs their leg high, your feet are on their far knee and hip.
2 x-guard | Kick both legs out to stretch them. Their far leg is pushed away and their base splits.
3 x-guard | Post your free hand behind you and lift your hips while you keep the leg hugged.
4 single-leg | Technically stand up into a single leg. Their leg is trapped against your chest.
5 j-landed | Run the pipe or drive forward to put them down, then pass.
+ Hug the leg tight with your head close | Stand up while their legs are split, not after they recover | Plant your hand far behind you to lift your hips | Stand up into them, not away from them
- Standing up before their base is stretched | Letting go of the leg as you stand | Standing up away from them, so they just step out
x Step over the leg to get out of the X | Sprawl and drop the weight on you | Grab your far sleeve or post on your head to stop the stand-up
v x-guard-back-sweep, dlr-to-x-guard, slx-technical-standup
n This is the sweep Marcelo Garcia used most to get on top.

@ x-guard-back-sweep | X-guard back sweep
f x-guard-game
k sweep
p x-guard
s modern
g both
l blue
a X-guard kick sweep | X-guard to the back | Overhead X sweep
= From X-guard, extend your legs to push their far leg back and their hips up, then pull the near leg so they fall over their heel to their back.
1 x-guard | Hold the leg at the knee, your feet in the X on their far knee and hip.
2 x-guard | Pull the near leg in to you and extend your legs to push their hips backward.
3 j-landed | They fall to their back. Come up behind your hug as they land.
4 side-control | Pass their legs and settle into side control.
+ Pull the trapped leg toward you as you kick | Extend fully: legs straight, hips pushing out | Come up as they land, before they can sit back up
- Kicking without pulling the near leg | Letting the hugged leg slip as you kick | Staying on your back after they fall
x Drop the knee down into you and flatten your legs | Stay heavy with weight on the trapped leg | Grab your collar and stay on top
v x-guard-technical-standup, dlr-to-x-guard
n When they lean forward to stop the stand-up, go this way instead: the two sweeps work as a pair.

@ slx-technical-standup | Single-leg X stand-up sweep
f x-guard-game
k sweep
p ashi
s modern
g both
l blue
a SLX sweep | Single X stand-up | Ashi garami sweep | Single-leg X elevator
= From single-leg X, hug their foot, kick their hip so they have to post forward, then technically stand up holding the leg and finish like a single leg.
1 x-guard | Get to single-leg X: their foot tucked on your hip or under your armpit, one foot on their hip, your other leg hooked behind their knee. Hug the leg with both arms.
2 x-guard | Push the foot on their hip and pull with the knee hook to stretch them out. They're balancing on one leg.
3 x-guard | When they lean forward to stop falling, post your hand behind you, keep the foot hugged and lift your hips.
4 single-leg | Technically stand up into a single leg, their foot still trapped against your chest or hip.
5 j-landed | Run the pipe or trip the standing leg to put them down, then pass.
+ Their foot stays clamped to you the whole time | Make them lean forward first, then stand up into that lean | Stand up into them, not away from them | Head up and posture straight once you're standing
- Standing up while they're still balanced | Letting go of the foot to post | Standing up far from them, so they just hop out
x Back-step to free the leg before you stand | Post on your head or shoulders to stop the stand-up | Sit back into a straight ankle lock (no-gi) or a guard pull
v slx-kick-sweep, x-guard-technical-standup, ashi-garami-position, dlr-to-x-guard
n Single-leg X and leg lockers' "ashi garami" are almost the same position: the gi player sweeps from it, the no-gi player also attacks the ankle. There's no single-leg X drawing, so the X-guard picture is the closest.

@ slx-kick-sweep | Single-leg X kick sweep
f x-guard-game
k sweep
p ashi
s modern
g both
l blue
a SLX back sweep | Single X elevator | Kick-back sweep
= From single-leg X, clamp their foot, push their hip away and pull the back of their knee so the standing leg buckles and they sit down behind them.
1 x-guard | In single-leg X, hug their foot tight to your hip or into your armpit.
2 x-guard | Pull their foot in so their weight shifts back onto the heel of their standing leg.
3 x-guard | Kick the foot on their hip away while your hooking leg pulls behind the knee. They can't step back, so they sit down.
4 j-landed | Come up as they land: technical stand-up and step around their legs, or follow them into a leg lock in no-gi.
+ Keep the foot clamped: if it escapes there's no sweep | Kick their hip back and pull the knee hook at the same time | Come up before they can recover guard
- Kicking without first pulling the foot in | Holding the foot loosely so it slips out | Staying on your back after they sit down
x Lean forward into you and keep the weight on the hips | Step the free leg over and back-step out | Free the foot by turning it out of the grip
v slx-technical-standup, ashi-garami-position, straight-ankle-lock, x-guard-back-sweep
n The kick sweep and the stand-up are a pair: if they lean forward, stand up; if they lean back, kick.

@ k-guard-entry | K-guard entry
f modern-entry
k transition
p open-guard
s modern
g both
l purple
a K-guard | Inside K | Matrix guard
= Turn onto your side facing their lead leg, slide your bottom leg between their legs behind the knee, put your top shin across the front of that thigh, and grab their heel: your legs make a K.
1 open-guard | From seated guard, turn onto your hip so you face their lead leg instead of their chest.
2 open-guard | Thread your bottom leg between their legs, your knee behind their lead knee and your foot near their far hip.
3 x-guard | Put your top leg's shin across the front of their lead thigh, near the hip. Grab their lead ankle or heel with your bottom hand.
4 x-guard | From the K: back-step them over, invert into the matrix, or turn into outside ashi for a leg lock.
+ Turn sideways; square-on, it doesn't work | Control their heel so the leg can't step away | Your bottom knee behind theirs is the hook | Stay close to their leg, not far away
- Lying flat on your back | Letting their knee slip out from between your legs | Holding the ankle with no leg control
x Step the lead leg back out of the K | Knee cut through over the inside leg | Drop down and smash your hips flat
v matrix, ashi-garami-position, heel-hook-outside, berimbolo
n The K-guard spread in the 2020s through coaches like Lachlan Giles. It sits halfway between the berimbolo world and the leg-lock world. There's no K-guard drawing; the open guard and X-guard pictures are the closest.

@ matrix | The matrix
f modern-entry
k backtake
p open-guard
s modern
g both
l brown
a Matrix back take | Rolling back take from K-guard | Matrix roll
= From K-guard, reach your top arm behind their far leg, invert under them and spin so you end up behind their hips with your legs on their back.
1 x-guard | In K-guard, holding their lead heel, with your bottom knee behind their lead knee.
2 x-guard | Reach your top arm between their legs and grab behind their far leg (or their belt in the gi).
3 x-guard | Invert: roll over your shoulder, hips over your head, swinging your legs toward their back. Keep the K hook on the lead leg.
4 back | Come out behind them, your hooking leg already around their waist. Grab the seatbelt.
5 back | Get the second hook in and take the back before they sit back.
+ Roll over your shoulder, never straight onto your neck | Keep the far-leg grip as you roll | Look at their back the whole time | Use the K hook to keep their hips over you
- Rolling with no grip on the far leg | Losing the K hook during the roll | Rolling when they're sitting back on their butt
x Sit back and sit on the inverting player | Turn and face them before the hooks are in | Back-step out before the roll starts
v k-guard-entry, berimbolo, kiss-of-the-dragon, rnc-from-back
n Named because the spin looks like a move from The Matrix. It's a modern back take popular in the 2020s. There's no inverted drawing; the X-guard picture is the closest.

@ lasso-sweep | Lasso guard sweep
f spider-lasso
k sweep
p spider
s modern
g gi
l blue
a Lasso sweep | Laço sweep | Lasso and ankle sweep
= Wrap your leg around their arm (the lasso), grab their far ankle with your free hand, push their hip and swing the lasso leg up and over so they fall over the ankle they can't move.
1 spider | Wrap one leg around their arm from the outside: shin across the back of their arm, foot on their chest or hip. Hold that sleeve tight.
2 spider | Your other foot is on their far hip. With your free hand, grab their far ankle or the pants at the ankle.
3 spider | Push the hip with your free foot while the lasso leg swings up and across, pulling their shoulder over.
4 mount | They roll over the blocked ankle. Come up on top and settle into mount or side control.
+ The lasso arm is trapped: they can't post with it | Block the ankle so they can't step | Push the hip and swing the lasso leg together | Sweep toward the blocked ankle
- A loose lasso that slips off | Pushing the hip without pulling the arm over | Letting the ankle grip go
x Pull the lasso arm out | Stand up and back away | Step the blocked ankle back | Pass under the lasso leg
v spider-sweep, worm-guard-sweep
n The lasso guard is a gi guard built on sleeve grips. The drawings have no lasso pose, so the spider guard is the closest picture.

@ spider-sweep | Spider guard sweep
f spider-lasso
k sweep
p spider
s classic
g gi
l blue
a Spider sweep | Biceps push sweep | Push-pull sweep
= From spider guard, drop one foot behind their ankle, pull that sleeve, and kick the other biceps up and over so they roll over the blocked leg.
1 spider | Hold both sleeves, both feet pushing their biceps.
2 spider | Drop one foot off the biceps and hook it behind their ankle on the same side.
3 spider | Pull the sleeve on the hooked side toward you and down. Their weight comes onto the blocked leg.
4 spider | Kick your other foot up and over, pushing that arm up.
5 mount | They roll over the blocked leg. Come up on top and pass.
+ Keep both sleeve grips the whole time | Block the ankle before you kick | Pull and push at the same time
- Letting go of a sleeve | Not hooking the ankle tight | Kicking without pulling
x Pull the sleeves free | Step the blocked leg away | Drop the weight and stack
v lasso-sweep, worm-guard-sweep
n The spider guard needs the gi: you grip the sleeves. In no-gi the same idea uses wrist grips and is far weaker.

@ worm-guard-sweep | Worm guard sweep
f spider-lasso
k sweep
p lapel
s modern
g gi
l purple
a Worm guard | Lapel guard sweep | Keenan's worm guard | Lapel-lasso sweep
= Pull out their own lapel, feed it behind their lead leg and grab it, so their leg is tied to their own jacket; then pull them forward onto the trapped leg and sweep them over it.
1 dlr | From De La Riva or reverse De La Riva, reach up and pull their lapel loose from the belt. Pull out a long tail.
2 dlr | Feed the lapel behind their lead leg from the outside, around the back of the knee, and catch it with the hand on that side. Their leg is now tied to their own jacket.
3 dlr | Get your foot on their far hip, your other leg hooked on the lead leg. Grab their far sleeve with your free hand.
4 dlr | Pull the lapel and the sleeve together to bring their weight forward onto the trapped leg, and kick the hip away. The lead leg can't step to catch them.
5 j-landed | They fall forward and to the side. Come up on top as they land, or take the back if they turn away.
+ Feed a long piece of lapel: a short one won't reach | The lapel ties the leg, so they can't step out to rebalance | Pull them forward first, then kick | Grip the lapel close to their leg to keep it tight
- Pulling out too little lapel | Letting the lapel go slack as you kick | Sweeping before their weight is on the trapped leg
x Strip the lapel grip before it's fed | Back-step the trapped leg out of the loop | Tuck the lapel back into the belt before they can grab it | Knee cut through before the grip is set
v lasso-sweep, spider-sweep, dlr-backward-sweep, berimbolo
n Keenan Cornelius built the worm guard around 2014. Lapel guards were so effective that some gyms tie belts over the lapel. There's no lapel-guard drawing; the De La Riva picture is the closest.

@ fifty-fifty-sweep | 50/50 sweep
f x-guard-game
k sweep
p fifty
s modern
g both
l purple
a 50/50 come-up | Fifty-fifty sweep | 50/50 to top
= From 50/50 guard, sit up, grab their far leg (or collar in the gi), hide your heel and come up to your knees, pushing them flat so you end on top with the legs still tangled.
1 saddle | You're both in 50/50. Hide your heel behind their butt or under your other leg.
2 saddle | Sit up toward them and grab their free leg at the knee (or their collar or sleeve in the gi).
3 saddle | Post your free hand, push off your outside leg and turn your hips over toward them. Come up onto your knees.
4 side-control | Drive them flat on their back while the legs stay locked. Hold top position long enough to score the sweep, then pass or attack the foot.
+ Hide your heel the whole time, especially in no-gi | Sit up first: from flat on your back there's no sweep | Turn your hips into them as you come up | Keep the legs tangled so they can't sit up and re-guard
- Coming up with your heel showing | Pulling back instead of driving forward | Letting go of the far leg and getting pulled back down
x Sit up at the same time and stay chest to chest | Hide your heel and attack the foot instead | Grab the near leg and come up first
v fifty-fifty-position, heel-hook-fifty-fifty, toe-hold
n In the gi it's a sweeping and stalling position; the Mendes brothers and Ryan Hall made the sweep famous. There's no 50/50 drawing; the saddle is the closest picture.

@family half-sweeps | Half-guard sweeps | Sweeps from bottom half guard: get on your side, win the underhook, and come up under them instead of lying flat under the crossface.
@family deep-half | Deep half guard | Sweeps from deep half, where you're all the way under them hugging one leg, so their weight sits on top of you with nothing to push down on.

@ dogfight-knee-tap | Dogfight knee tap
f half-sweeps
k sweep
p half-guard
s modern
g both
l blue
a Dogfight sweep | Underhook knee tap | Up-and-over from the dogfight
= Come up from half guard to your knees with the underhook (the dogfight), block their far knee with your hand and drive your head into them to tip them over.
1 half-guard | Get the underhook on the side of their trapped leg and come up onto your elbow.
2 turtle ! | Keep driving up until you're on your knees beside them, your head tight in their chest and the underhook deep. This is the dogfight.
3 turtle ! | Reach your free hand across and block the outside of their far knee, so that leg can't step out to post.
4 turtle ! | Drive your head and shoulder into them toward the blocked knee. With the far leg held in place they tip over onto their back.
5 side-control | Keep driving and come up on top, passing to side control.
+ The underhook and your head do the pushing | Block the far knee on the outside | Keep your hips under you, close to them | Drive diagonally, toward the blocked leg
- Head too low or outside, so they whizzer you down | Blocking the knee with your arm extended | Reaching before you're on your knees
x Whizzer the underhook and sprawl | Step the far leg back before the block | Grab the far wrist and roll you
v old-school-sweep, dogfight-back-take, half-butterfly-sweep
n No drawing shows the dogfight itself; the turtle with you on the bottom is the closest match.

@ dogfight-back-take | Dogfight to back take
f half-sweeps
k backtake
p half-guard
s modern
g both
l purple
a Dogfight back take | Half guard to back | Underhook to back take
= In the dogfight, when they whizzer and sprawl, walk your knees behind them, take the far hip with your underhook and come out on the back.
1 half-guard | Win the underhook on the side of their trapped leg and come up to your knees in the dogfight.
2 turtle ! | They whizzer your underhook and sprawl their hips back to stop the knee tap.
3 turtle ! | Free your trapped leg and walk your knees around toward their back, keeping your head tight on their side.
4 turtle | Reach the underhook arm across their back to grab the far hip and climb onto their back.
5 back | Insert hooks or set a seatbelt and take the back.
+ The whizzer makes the back open: go with it | Keep your head tight on their side | Hold the far hip, not the near one | Hooks in before they square up
- Fighting straight into the whizzer | Letting them square up to face you | Head on the outside
x Square up and face you | Hard whizzer and roll | Fight the hips away
v dogfight-knee-tap, old-school-sweep, half-butterfly-sweep
n The drawings start from half guard and the turtle, the closest match for the dogfight.

@ half-butterfly-sweep | Half-butterfly sweep
f half-sweeps
k sweep
p half-guard
s classic
g both
l blue
a Half butterfly | Butterfly half sweep | Underhook half-butterfly sweep
= From half guard with the underhook, put your free leg in as a butterfly hook under their thigh, then fall to the other side and lift them over the hook.
1 half-guard | Get the underhook and keep your head in their chest so they can't crossface.
2 butterfly | Swap one leg into a butterfly hook under their thigh on the underhook side. The other leg stays in half guard or hooks the trapped leg.
3 butterfly | Trap their other arm, so they can't post on that side.
4 butterfly-sweep | Fall to the side of the trapped arm and lift with the butterfly hook. They roll over the trapped side.
5 mount | Come up on top in mount or side control.
+ Underhook and head position first | Hook under the thigh, close to the knee | Fall to the trapped-arm side | Lift with the hook as you fall
- Lifting with no underhook | Falling to the wrong side | Letting them post the free hand
x Crossface and flatten you | Whizzer the underhook | Step the free leg out wide
v butterfly-sweep, old-school-sweep, dogfight-knee-tap
j sumi-gaeshi
n The same lifting hook as the butterfly sweep and judo's sumi-gaeshi.

@ knee-shield-sweep | Knee-shield sweep
f half-sweeps
k sweep
p half-guard
s modern
g both
l blue
a Z-guard sweep | Z-guard scissor | Knee-shield scissor sweep | Shield sweep
= With your knee shield across their chest, control the wrist on the shield side, pull them over the shield, and chop their trapped leg out from under them.
1 knee-shield | Keep your top knee across their chest or shoulder as a shield, so they can't flatten you.
2 knee-shield | Grab the wrist or sleeve of the arm on the shield side and pull it across your body.
3 scissor-sweep | Hip out a little and pull them onto the shield, lifting their weight up.
4 scissor-sweep | Chop the bottom leg back against their trapped leg while the shield kicks over. They roll over the side of the arm you hold.
5 mount | Follow them over and come up in mount.
+ Keep the shield angled, knee across their chest | Control the wrist on the shield side | Pull them onto the shield before you chop | It works best when they drive into you
- Letting the shield drop flat | Letting go of the wrist | Lying flat with no angle
x Knee-cut over the shield | Pin the shield to the mat with the hip | Free the wrist and post
v scissor-sweep, old-school-sweep, half-butterfly-sweep
n Z-guard is another name for the knee-shield half guard.

@ deep-half-tip-sweep | Deep half tip sweep
f deep-half
k sweep
p half-guard
s modern
g both
l purple
a Basic deep half sweep | Deep half kick sweep | Tip sweep | Deep half push sweep
= From deep half, hug their leg and kick your legs out to straighten it, so they tip over backward with no leg to stand on and you come up on top.
1 half-guard | Get all the way under one of their legs: head near their hip, both arms hugging the leg to your chest, your legs pinching it (your outside foot can hook their ankle).
2 x-guard | Their weight sits on top of you. When they lean forward to crossface or flatten you, they've given you the angle.
3 x-guard | Kick both legs out straight, pushing their trapped leg back and away while your arms keep the hip tight to you.
4 x-guard | The leg straightens, their hips go up and back, and they tip over onto their back or side.
5 side-control | Follow them as they fall: let go of the leg, come up on top and pass to side control.
+ Hug the leg high, at the hip, tight to your chest | Kick both legs out together | Keep your head off the mat, near their hip, so they can't sit on it | Come up the moment they tip
- Head too far out, where they can sit on it or grab it | Arms loose on the leg so they pull it out | Lying flat after the sweep instead of coming up
x Step the free leg over to the other side | Underhook the near arm and flatten you | Hip back and pull the leg out
v waiter-sweep, homer-simpson-sweep, deep-half-back-door, old-school-sweep
n The drawings don't include deep half; x-guard is the closest match for being under their leg.

@ waiter-sweep | Waiter sweep
f deep-half
k sweep
p half-guard
s modern
g both
l purple
a Waiter | Tray sweep | Waiter lift
= From deep half, slip your free hand under their far foot and lift it like a waiter holding a tray, while your legs kick the trapped leg away; with both legs gone, they fall back.
1 half-guard | Get into deep half, hugging their near leg tight to your chest.
2 x-guard | Let go with your outside arm and reach it under their far leg, cupping the ankle or heel with your palm up like a tray.
3 x-guard | Kick your legs into their trapped leg to push it away, and at the same moment lift the far leg up and over your head.
4 x-guard | With one leg kicked out and the other lifted, they fall back or to the side.
5 side-control | Come up on top and pass to side control before they recover guard.
+ Lift the far foot high, over your head | Kick and lift at the same time | Keep the trapped leg tight to you | Use it when they widen the far leg to base
- Lifting with no kick | Letting the trapped leg go before they fall | Reaching for the foot with your head out in the open
x Step the far leg away before the hand gets under it | Underhook and flatten you | Free the trapped leg and back step
v deep-half-tip-sweep, homer-simpson-sweep, deep-half-back-door
n Named for the grip: the hand under the foot is a waiter carrying a tray. The drawings don't include deep half; x-guard is the closest match.

@ homer-simpson-sweep | Homer Simpson sweep
f deep-half
k sweep
p half-guard
s modern
g both
l purple
a Homer Simpson | Homer | Deep half Homer | Spin-out sweep
= From deep half, when they put their weight back on their trapped leg, turn face down under that leg and spin around toward their back on your knees, so they fall and you come up on top.
1 half-guard | Get into deep half: under one of their legs, hugging it to your chest, head near their hip, legs pinching the leg.
2 x-guard | They sit their weight back onto the trapped leg to flatten you. Keep the hug tight and turn toward the mat under the leg.
3 turtle ! | Come up to your knees with the leg still hugged to your chest and your head tight against their hip.
4 turtle ! | Run your knees in a tight circle around toward their back, carrying the trapped leg with you. Their posted leg can't keep up and they sit down.
5 side-control | As they fall, let go of the leg, come up on top and pass to side control (or take the back if they turtle).
+ Hug the leg high, near the hip, not at the knee | Turn to your knees in one fast movement | Your head stays tight on their hip as you spin | Use it when they sit back; the tip and waiter sweeps work when they lean forward
- Letting go of the leg as you turn | Spinning slowly, so they flatten you or sprawl | Spinning away from their back instead of toward it
x Sprawl the hips and crossface as you turn | Step the trapped leg over your head and out | Grab an underhook and roll with you
v deep-half-tip-sweep, waiter-sweep, deep-half-back-door
n Named after Homer Simpson running in circles on the floor, which is what the spin looks like. The drawings don't include deep half; x-guard and the turtle (you on the bottom) are the closest matches.

@ deep-half-back-door | Deep half back door
f deep-half
k backtake
p half-guard
s modern
g both
l purple
a Back door | Deep half back take | Deep half to back | Backdoor escape
= When they lean back or turn toward your feet in deep half, slip your head out behind their hips, come up on your knees behind them and take the back.
1 half-guard | Get into deep half, hugging their near leg tight, head near their hip.
2 x-guard | They turn toward your legs or sit back to stop the sweeps. Switch your grip so your top arm hugs their leg from behind.
3 x-guard | Walk your shoulders and head out behind their hips, under their butt, so your head comes out on the far side of the trapped leg.
4 turtle | Come up to your knees behind them, chest on their back and hips.
5 back | Grab the far hip, insert hooks or a seatbelt and take the back.
+ Use it when they turn their back toward your head | Keep the leg hugged until your head is out | Climb straight to the hips, not the shoulders | Hooks in before they square up
- Letting go of the leg too early | Bringing your head out in front of them, under their weight | Staying flat once you're out
x Sit down on your head before it comes out | Turn back in to face you | Free the leg and back step away
v deep-half-tip-sweep, waiter-sweep, homer-simpson-sweep, dogfight-back-take
n The drawings don't include deep half; x-guard is the closest match for being under the leg.

@ half-guard-single-leg | Half guard to single leg
f half-sweeps
k sweep
p half-guard
s wrestling
g both
l blue
a Dogfight single leg | Underhook to single | Half guard come-up to single leg | Up to a single
= From the underhook in half guard, come up on your knees, grab their trapped leg and stand up into a single-leg takedown as they sit back.
1 half-guard | Win the underhook on the side of their trapped leg and get your head under their chin.
2 turtle ! | Come up on your elbow, then onto your knees beside them, still holding the underhook (the dogfight).
3 turtle ! | When they sprawl back or sit their weight back, let go of the underhook and wrap both arms around the trapped leg, your head on the inside of their hip.
4 single-leg | Stand up with the leg hugged to your chest, your head pushing into their side.
5 side-control | Finish the single: run the pipe or trip the standing leg, and follow them down into side control.
+ Use it when they whizzer and sprawl back from the knee tap | Head on the inside, pressing into their ribs | Stand up with your legs, not your back | Keep the leg tight to your chest the whole way up
- Head on the outside, where they guillotine you | Standing up slowly, so they sprawl flat on you | Letting the leg go to reach for the other one
x Guillotine the head if it's outside | Whizzer and hop around to face you | Sprawl hard before you stand
v dogfight-knee-tap, dogfight-back-take, old-school-sweep, half-butterfly-sweep
n Half guard and wrestling meet here: the dogfight is the same position wrestlers fight from on their knees. The drawings use the turtle (you on the bottom) for the dogfight.

@family kesa-locks | Armlocks from kesa-gatame | Arm attacks from the scarf hold, where their near arm is already trapped under your armpit and the far arm comes up to push your face.
@family top-wristlock | Wrist locks from the top | Bending the wrist when they frame or push from underneath. Legal from blue belt under IBJJF.

@ americana-side-control | Americana from side control
f kimura
k submission / shoulder
p side-control
s classic
g both
l white
a Keylock | Ude-garami | Paintbrush | Figure-four armlock | Bent armlock | Top keylock
= Pin their far wrist to the mat with their elbow bent like an L, thread your other arm under their upper arm to grab your own wrist, then paint their hand along the mat toward their hips while their elbow lifts.
1 side-control | Get heavy side control with a cross-face. Their far arm will come up to frame on your neck or push your head: that's the arm you want.
2 side-control | Push that wrist down to the mat beside their head with your cross-face hand (the hand by their head). Their elbow stays bent at 90 degrees, the hand pointing toward their head, palm up.
3 americana | Slide your other hand under their triceps and grab your own wrist, your knuckles on top. That's the figure four.
4 americana | Keep your chest heavy on theirs and your elbow by their ear so they can't turn into you.
5 americana | Slide their hand along the mat toward their hip, like a paintbrush, while you lift their elbow a little off the mat. The shoulder turns and they tap.
+ Their wrist never leaves the mat | Elbow bent to about 90 degrees: too straight or too bent and there's no lock | Your chest stays on theirs, weight forward | Lift the elbow and slide the hand at the same time
- Lifting their wrist off the mat as you crank | Working with your arms while your chest floats off them | Trying it while their elbow is tight to their ribs | Cranking fast: the shoulder goes before they feel much
x Straighten the arm as soon as the wrist is pinned | Bridge and turn into the attacker to take the angle away | Grab their own belt, pants or the attacker's leg to stop the arm moving | Swim the elbow down to their ribs
v kimura-side-control, kimura-closed-guard, kimura-north-south, wristlock-top-frame, mounted-triangle-mount
j ude-garami
n The same lock is called the keylock in many Gracie schools. Judo's ude-garami ("entangled arm") covers both the americana and the kimura; only the direction of the hand changes.

@ kimura-side-control | Kimura from side control
f kimura
k submission / shoulder
p side-control
s classic
g both
l white
a Ude-garami | Double wristlock | Reverse keylock | Top kimura | Chicken wing
= When their far arm comes down toward their hips (often when you try the americana), switch to the kimura: figure-four the arm the other way and turn their hand up behind their back.
1 side-control | From side control, attack the far arm. They feel the americana coming and straighten the arm down by their hip.
2 kimura-side | Grab that wrist with your hip-side hand, palm over. Their elbow bends with the hand pointing toward their feet.
3 kimura-side | Reach your head-side arm under their upper arm and grab your own wrist. Pull their elbow tight to your chest.
4 kimura-side | Step your head-side knee up beside their head (or toward north-south) so they can't roll toward you, and lift their elbow off the mat.
5 kimura-side | Keep the elbow tight to you and turn their hand up toward their head, as if putting it behind their back. Turn your body, not just your arms.
+ The elbow stays glued to your chest; space there kills the lock | Hand over the top of their wrist, not under it | Block the roll with your knee by their head | Turn the hand behind them in a slow arc
- Letting their elbow drift away from your body | Cranking with the arms while the rest of you stays still | Leaving room for them to roll over the trapped shoulder
x Grab their own belt, shorts or thigh (the "kimura defense" grip) | Roll toward the trapped arm to unwind the shoulder | Straighten the arm and turn into the attacker
v americana-side-control, kimura-north-south, kimura-closed-guard, mounted-triangle-kimura-trap
j ude-garami
n The Kimura is named for Masahiko Kimura, who broke Hélio Gracie's arm with it in 1951. The same grip is a strong control from the top even when the finish isn't there: you can use it to walk to north-south or step into a mounted triangle.

@ kimura-north-south | North-south kimura
f kimura
k submission / shoulder
p north-south
s classic
g both
l blue
a North-south keylock | Ude-garami from north-south | Kimura from the top of the head
= Walk to north-south with a kimura grip on their near arm, sit back on your hip next to their head and turn the arm up behind them; your knees block the shoulder from rolling.
1 side-control | From side control, their near arm reaches for your hip or tries to underhook. Grab that wrist with your hip-side hand and pin it to their belly or the mat by their hip.
2 north-south | Walk your hips around toward their head, keeping your chest on theirs, until you're in north-south with the trapped arm on your side.
3 kimura-side | Thread your other arm under their upper arm and grab your own wrist: a kimura grip. Pull their elbow up off the mat toward your chest.
4 north-south | Sit back onto the hip nearest the arm and pin their head with your knee or thigh so they can't turn in or roll.
5 kimura-side | Keep the elbow tight to you and turn their hand up toward their head. Rotate your body, as if rowing the arm away from their back.
+ North-south takes away the roll that saves most people from the side-control kimura | Your knee or thigh by their head stops them turning toward you | Elbow tight to your chest | Lift the elbow first, then rotate
- Staying square on top so they can bridge and roll | Finishing with the arms instead of the body | Letting their elbow sink back to the mat
x Grab their own belt or shorts before the elbow lifts | Turn toward the attacker and come up to their knees | Bridge and roll over the trapped shoulder before the hips sit
v kimura-side-control, americana-side-control, kimura-closed-guard
j ude-garami
n There's no drawing of the kimura from north-south itself; the side-control kimura drawing shows the same grip.

@ armbar-side-control | Armbar from side control
f armbar
k submission / elbow
p side-control
s classic
g both
l white
a Step-over armbar | Near-side armbar | Juji-gatame from side control | Spinning armbar from side
= When they push your neck or hip with the near arm, trap that arm against your body, step your leg over their head and sit back into an armbar.
1 side-control | From side control, they frame on your neck or push your hip with their near arm, the arm closest to you.
2 side-control | Pinch that arm tight to your chest or into your armpit with your head-side arm. Push their head away with your hand so it can't follow you.
3 knee-on-belly | Come up with your hip-side knee on their belly, then step your head-side leg over their face, so you're standing over them with the arm still hugged to you.
4 armbar | Sit down as close to their shoulder as you can, the arm between your legs, knees pinched together.
5 armbar | Fall back with their thumb pointing up and lift your hips into their elbow to finish.
+ Sit down right next to their shoulder: no gap between your butt and their armpit | Keep the arm hugged to your chest the whole way round | Control the head while you step over it | Knees pinched, thumb up
- Stepping over before the arm is trapped | Sitting down far from the shoulder, so they pull the elbow out | Letting them turn into you as you step
x Turn into the attacker and get to the knees | Grab the hands together before the fall back | Hitchhiker: turn the thumb down and pull the elbow out | Sit up and stack the attacker
v armbar-knee-on-belly, armbar-mount, armbar-s-mount, armbar-closed-guard
j ude-hishigi-juji-gatame

@ armbar-knee-on-belly | Armbar from knee on belly
f armbar
k submission / elbow
p knee-on-belly
s classic
g both
l blue
a Far-side armbar | Spinning armbar from knee on belly | Juji-gatame from knee on belly
= Knee on belly makes people push your knee away with their far arm; grab that arm, step around their head and sit down into an armbar.
1 knee-on-belly | Get knee on belly, your shin across their stomach and your other foot posted wide. Grab their far collar or far arm and lean your weight on the knee.
2 knee-on-belly | The pressure makes them push your knee or hip with their far hand. Catch that arm at the elbow and pull it up into your chest.
3 s-mount | Step your posted foot around close to their head, so you're standing over their face with the arm hugged to you.
4 armbar | Swing your knee-on-belly leg over their face and sit down close to their shoulder, knees pinched together.
5 armbar | Fall back with the thumb up and lift your hips to finish.
+ Make the knee heavy first; the arm comes when it hurts | Step around the head, not the hips | Sit down tight to their shoulder | Keep the elbow hugged to your chest until you're sitting
- Loosening the knee pressure while you reach for the arm | Letting them shrimp away so you're stepping into space | Sitting far from their shoulder
x Turn into the attacker as you step around and come up to the knees | Push the knee off the belly with the hips, not the arm | Hitchhiker escape once they sit
v armbar-side-control, armbar-s-mount, armbar-mount, americana-side-control
j ude-hishigi-juji-gatame

@ armbar-s-mount | S-mount armbar
f armbar
k submission / elbow
p mount
s modern
g both
l blue
a Armbar from S-mount | Technical mount armbar | High-mount armbar | Juji-gatame from S-mount
= From high mount, isolate one arm, turn into S-mount with your shin behind their head, and the arm is trapped before you fall back; there's no time for them to escape.
1 mount | Climb to high mount, knees up in their armpits. When they frame with their arms, catch one arm and push its elbow across their face.
2 s-mount | Bring your foot up beside their head on the side of the arm, and slide your other knee up behind their head. You're sitting on their chest in an S shape.
3 s-mount | Hug the arm to your chest with both arms. If they grab their hands together, grab your own wrists or their sleeve and pry, or push their head away with your knee.
4 armbar | Swing your shin over their face, sit low and fall back with your knees pinched.
5 armbar | Pull the arm to your chest, thumb up, and lift your hips into the elbow.
+ The knee behind the head stops them turning in | Sit on their chest, not their belly | Break their grip before you fall back, not after | Keep your weight on them until the last moment
- Falling back before their hands come apart | Sitting too far down, where they can bridge you off | Letting the S-mount knee slide off their head
x Clasp the hands tight and turn toward the attacker | Bridge before the S-mount knee gets behind the head | Push the knee off the head and recover half guard
v armbar-mount, armbar-side-control, armbar-knee-on-belly, mounted-triangle-mount
j ude-hishigi-juji-gatame
n S-mount gets its name from the shape your legs make. It's the most reliable way to finish an armbar from the top because the arm is isolated before you leave the pin.

@ armlock-kesa-thigh | Kesa-gatame straight armlock
f kesa-locks
k submission / elbow
p side-control
s judo
g both
l blue
a Kesa armbar | Armlock over the thigh | Scarf-hold armlock | Ude-hishigi-hiza-gatame from kesa
= In kesa-gatame their near arm is already trapped under your armpit; turn that arm thumb up and lever its elbow across your thigh.
1 kesa | Hold kesa-gatame (scarf hold): sitting beside them, your arm around their neck, their near arm clamped under your other armpit.
2 kesa | Pull the trapped arm up across your body and turn their thumb toward the ceiling, so the elbow points down.
3 kesa | Lay the back of their elbow across the thigh of your front leg (the leg near their head).
4 kesa | Pin the wrist under your armpit and push down on the arm while your thigh lifts. The elbow straightens over your leg.
+ Thumb up, elbow on your thigh | Keep the neck wrap tight so they can't sit up into you | Control the wrist under your armpit, not just the upper arm | It works best when they pull the arm to escape the pin
- Locking above the elbow, on the biceps | Loosening the head control while you work the arm | Leaving their thumb pointing sideways, so the elbow just bends
x Bend the elbow and pull it free before it's turned | Bridge into the attacker and roll them over the top | Turn the thumb down and point the elbow at the floor
v armlock-kesa-legs, americana-side-control, kimura-side-control
j kesa-gatame
n The judo side links to kesa-gatame, the pin it starts from. The arm is the same one judo players fight to free from the scarf hold. The drawing is a kesa hold; there's no separate drawing of the lock.

@ armlock-kesa-legs | Kesa-gatame leg armlock
f kesa-locks
k submission / elbow
p side-control
s judo
g both
l blue
a Kesa leg triangle armlock | Scarf-hold leg lock on the arm | Ude-hishigi-ashi-gatame from kesa
= When they push your face away from under kesa-gatame with their free arm, catch that wrist, bring it down and trap it between your legs, then straighten it.
1 kesa | From kesa-gatame, their free (far) arm comes up to push your face or head away.
2 kesa | Grab that wrist with your neck-wrap hand, or catch it in the crook of your elbow, and pull it down past your head toward your legs.
3 kesa | Lift your top leg and lay the arm across your bottom thigh. Hook your top leg over their forearm, so the arm sits between your legs.
4 kesa | Cross or triangle your legs over the arm, thumb up, and squeeze your knees down while you lean back. The elbow straightens across your thigh.
+ Wait for the push; it hands you the arm | Thumb pointing up | Keep your hips heavy so they can't bridge while your legs are busy | Lock the legs over the forearm, not the upper arm
- Lifting your hips off the mat to reach the arm | Trapping the arm with the elbow bent | Letting the neck wrap go
x Don't push the face with a straight arm | Bend the arm and pull it back to the chest | Bridge toward the attacker as their leg lifts
v armlock-kesa-thigh, americana-side-control, kimura-side-control
j kesa-gatame
n An old catch-wrestling and judo trick. The drawing is the kesa hold; there's no picture of the legs on the arm.

@ mounted-triangle-mount | Mounted triangle
f triangle
k submission / choke
p mount
s classic
g both
l blue
a Triangle from mount | Top triangle | Sankaku-jime from the mount | Mount triangle
= From high mount, push one arm across their neck, climb up, slide your shin behind their head and lock a triangle on top of them while they lie flat.
1 mount | From mount, slide up to high mount. When they push on your chest with one arm, push the other arm across their face or trap it to their chest so one arm is in and one is out.
2 s-mount | Walk your knee up behind their head on the side of the trapped arm (the "in" arm), so your shin lies under their neck.
3 s-mount | Lift their head and slide that shin under it, grab the ankle and put it behind the knee of your other leg. Lock the triangle while still sitting on them.
4 s-mount | Sit your weight down on their chest, pull the head up and squeeze your knees together.
5 armbar | If they pull the trapped arm out or turn, the other arm is often hanging free: fall back into the armbar.
+ One arm in, one arm out, same as from guard | Lock it while you're still heavy on top | Pull the head up as you squeeze | Shift your hips toward the trapped arm to tighten it
- Locking with both arms out (it's just a head scissor) | Rolling to your back before it's tight and losing the position | Sitting too far down their body
x Keep elbows tight inside the mount so nothing can be pushed across | Turn into the trapped side and bridge before the lock | Push the shin off the head with both hands
v mounted-triangle-kimura-trap, armbar-s-mount, armbar-mount, triangle-closed-guard
j sankaku-jime
n There's no drawing of a triangle from the top. The S-mount drawing shows how you sit while you lock it.

@ mounted-triangle-kimura-trap | Mounted triangle from the kimura trap
f triangle
k submission / choke
p side-control
s modern
g both
l purple
a Kimura-trap triangle | Step-over triangle from side control | Top triangle from the kimura grip
= Use a kimura grip on their far arm to hold them flat, step your leg over their head and lock a triangle on top, with the arm you're holding already "in".
1 side-control | From side control, get a kimura grip on their far arm: your hand on their wrist, your other arm under their upper arm grabbing your own wrist.
2 kimura-side | Lift their elbow and pull the arm toward you, which turns them onto their side, back toward you.
3 north-south | Step your head-side leg over their head, so you're straddling their head with the trapped arm between your legs.
4 s-mount | Sit down toward their chest and slide your other shin under their head. Lock your ankle behind your knee: a triangle on top of them with their trapped arm inside.
5 s-mount | Keep the kimura grip, squeeze your knees together and pull the head up. If the choke isn't there, finish the kimura or the armbar.
+ The kimura grip keeps the arm in place while your legs move | Turn them onto their side first, so the head is easy to step over | The choke, the kimura and the armbar are all on at once | Lock it before you roll anywhere
- Letting go of the kimura grip to lock the legs | Stepping over before the arm is pulled in | Sitting so far back that they slide the head out
x Grab their own belt to stop the kimura grip pulling the arm | Turn to the knees as the leg steps over | Pull the head out and face the attacker
v kimura-side-control, mounted-triangle-mount, kimura-north-south, armbar-side-control
j sankaku-jime
n A favorite of modern top players who chain the kimura, the triangle and the armbar together. No drawing shows the triangle from the top, so the S-mount is the closest picture.

@ wristlock-top-frame | Wristlock from mount or side control
f top-wristlock
k submission / wrist
p mount
s classic
g both
l blue
r wristlock
a Chest wristlock | Mounted wristlock | Bent-wrist lock | Wrist crank | Chave de pulso
= When they push your chest with a bent arm from underneath, pin their hand flat to your chest and lean forward to fold their wrist back.
1 mount | From mount or side control, they push on your chest or shoulder with a bent arm, their palm flat on you.
2 mount | Cover their hand with both of yours and press it tight to your chest so it can't slide.
3 mount | Lean your chest forward, down toward their face, keeping their hand pinned. Their wrist bends back toward their forearm.
4 mount | Keep their elbow from straightening (keep it close to you) and keep leaning slowly until they tap.
+ The hand must be pinned flat to you | Lean with your whole body, slowly | Keep the elbow bent so the wrist takes the pressure | Wristlocks injure fast: give time to tap
- Letting their elbow straighten, so the bend disappears | Yanking it in training | Trying it on a white belt (illegal for white belts under IBJJF)
x Pull the hand back the moment it's covered | Straighten the arm to take the bend off the wrist | Turn the fingers to the side
v americana-side-control, armbar-s-mount, kimura-side-control
n In the gi you can also catch the wrist with a sleeve grip. Wristlocks are allowed from blue belt up under IBJJF rules, and they work whenever someone frames on you with a bent arm.

@ straight-armlock-mount | Straight armlock from mount (ude-gatame)
f armbar
k submission / elbow
p mount
s judo
g both
l blue
a Ude-gatame | Arm crush | Shoulder armlock | Straight-arm lock | Ude-hishigi-ude-gatame
= When they push straight up at your chest or neck from under mount, trap their straight arm against your shoulder and pull the back of the elbow toward you.
1 mount | From mount, they push straight up on your chest or neck with one arm.
2 mount | Drop your head to the side of their arm and trap the wrist on your shoulder with your head (or clamp it under your jaw).
3 mount | Cup the back of their elbow with both hands, one over the other.
4 mount | Squeeze the wrist to your shoulder and pull the elbow toward your chest while you lean slightly toward that side. The elbow straightens backward.
+ The arm must be straight and the wrist fixed on your shoulder | Pull the elbow in, don't push down | Keep your knees tight so the mount stays | Thumb pointing to the side or up
- Locking a bent arm | Leaning so far that you lose the mount | Holding the wrist with your hands instead of your shoulder
x Bend the elbow at once | Turn the thumb down and pull the arm back in | Bridge toward the trapped arm
v armbar-s-mount, armbar-mount, americana-side-control, wristlock-top-frame
j ude-hishigi-ude-gatame
n Judo's ude-gatame ("arm lock") is one of the Kodokan's official arm locks. It's quick and needs no leg movement, so it's a good attack when they push from under mount.
`;
