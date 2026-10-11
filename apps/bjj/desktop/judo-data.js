// Every judo technique in the app: the Kodokan's 68 throws (nage-waza) and 32 grappling techniques
// (katame-waza). Same format as bjj-data.js, plus:
//   kanji 大外刈            the name in Japanese
//   en Major outer reap     what the name means
//   c nage/ashi             Kodokan class: nage/te nage/koshi nage/ashi nage/ma-sutemi nage/yoko-sutemi,
//                           katame/osaekomi katame/shime katame/kansetsu
//   gk 1                    Gokyo group 1-5, shin (Shinmeisho-no-waza), hab (Habukareta-waza), katame
//   kz back-corner          which way uke is off-balanced: front front-corner side back-corner back
//   ijf legal               legal | shido (leg grab, penalized) | caution (risky) | forbidden (banned)
//   ng works                without a gi: works | adapt | gi
//   b bjj-id                the same idea in jiu-jitsu (opens on the left screen)
window.JUDO_DATA = String.raw`

@ o-soto-gari | O-soto-gari
kanji 大外刈
en Major outer reap
c nage/ashi
gk 1
kz back-corner
ijf legal
ng works
= Break their balance to the back corner, step in beside them and reap their supporting leg out from behind like a scythe.
1 j-grip | Grip sleeve and lapel. Pull the sleeve and push the lapel up to tip them onto their heel.
2 j-push | Step your support foot beside their foot, chest to chest, so their weight is all on that leg.
3 j-osoto | Swing your leg past theirs and reap it back and up with your calf. Your head drives down.
+ Their weight must be on the leg you reap | Chest to chest before you reap | Toes pointed, reap with the back of the thigh
- Reaping from too far away | Leaning back as you reap (they counter with the same throw)
x O-soto-gaeshi: they reap your supporting leg back | Step back and around
v o-uchi-gari, ko-soto-gari
b double-leg

@family reaps | Reaps & hooks | You take one of their legs away with one of yours: reap it with a swing (gari) or hook it and drive (gake), from the outside (soto) or the inside (uchi), big (o) or small (ko). O-soto-gari is the big outside reap.
@family foot-sweeps | Foot sweeps | Timing sweeps with the sole of your foot: catch their foot just as it steps, before their weight lands on it, while your hands lift them off it.
@family leg-blocks | Leg blocks & wheels | Your foot or leg stops one of their legs (at the ankle, the knee or just above it) and your hands wheel them over it like turning a steering wheel.

@ de-ashi-harai | De-ashi-harai
f foot-sweeps
k takedown
p standing
s judo
g both
l blue
kanji 出足払
en Advanced foot sweep
c nage/ashi
gk 1
kz side
ijf legal
ng adapt
a Advancing foot sweep | Forward foot sweep | De-ashi-barai | Foot sweep
= Catch their foot with the sole of yours just as it steps forward, before their weight lands on it, and sweep it on in the direction it was going while your hands tip them over sideways.
1 j-grip | Sleeve and lapel. Get them moving: take a step back so they step toward you.
2 j-pull | Draw them forward a little with the sleeve hand. Watch their right foot as it comes forward.
3 j-deashi | Just before that foot takes their weight, sweep the back of their right heel with the sole of your left foot, in the same direction it's already moving. Leg straight, toes curled up, sole flat on their heel.
4 j-deashi | At the same moment lift with both hands, then turn them down toward the side where their foot was. With nothing under them, they fall on their side.
5 j-landed | Keep the sleeve as they land and follow up to a pin.
+ Timing is everything: sweep as the foot is about to land, not after | Sweep with the sole, low along the mat, from the hip with a straight leg | The hands do half the throw: lift, then turn them down | Stay upright; don't lean in or reach with your body
- Kicking their shin or ankle bone with your toes (it hurts and doesn't throw) | Sweeping too late, when their weight is already on the foot | Sweeping with no hands, so their foot just slides and they stand there | Bending your knee, so the sweep has no reach
x They lift the foot over your sweep and sweep yours back: tsubame-gaeshi | They plant the foot early: the weight is on it now, so go to ko-soto-gari or sasae-tsurikomi-ashi | They step back instead: the same sweep on the retreating foot, or ko-uchi-gari
v okuri-ashi-harai, harai-tsurikomi-ashi, sasae-tsurikomi-ashi, ko-soto-gari, ko-uchi-gari, tsubame-gaeshi, hiza-guruma
n The first throw in the Gokyo and one of the hardest to time. Without a gi, a collar tie and a wrist grip can steer them, but it's easier with sleeve and lapel.
b foot-sweep

@ hiza-guruma | Hiza-guruma
f leg-blocks
k takedown
p standing
s judo
g both
l blue
kanji 膝車
en Knee wheel
c nage/ashi
gk 1
kz front-corner
ijf legal
ng adapt
a Knee wheel | Knee wheel throw
= Pull them toward their front corner, put the sole of your foot on the side of their knee as a block, and wheel them over it with your hands.
1 j-grip | Sleeve and lapel. Step back at an angle so they step forward with their right foot.
2 j-pull | As their right foot comes forward, pull the sleeve up and out and lift with the lapel hand, so their weight goes over their right knee toward their right front corner.
3 j-deashi | Turn your hips a little to your left on the ball of your right foot and put the sole of your left foot on the outside front of their right knee, just below the kneecap. Leg straight, toes turned in. It's a block, not a kick.
4 j-deashi | Turn your hands like a steering wheel: the sleeve pulls down and around to your left hip, the lapel hand pushes up and over. They pivot over the blocked knee.
5 j-landed | Keep the sleeve as they land.
+ Block, don't kick | Sole on the side of the knee, toes turned in | The hands throw: a big steering-wheel turn | Lean back a little and keep your standing knee soft
- Kicking the knee, which can hurt them | Foot too low on the shin (that's sasae-tsurikomi-ashi, done wrong) | No pull, so their weight never comes onto the blocked leg | Standing too close to turn your hands
x They bend the knee and step past your foot: drop the block to the ankle (sasae-tsurikomi-ashi) | They lean back against the pull: ko-soto-gari or o-uchi-gari | You're on one leg: if they reap or sweep your standing leg you go down, so keep it short and quick
v sasae-tsurikomi-ashi, harai-tsurikomi-ashi, ashi-guruma, de-ashi-harai, tai-otoshi
n No drawing of the foot on the knee yet; the foot-sweep drawing is the closest. Without a gi, a wrist grip and a collar tie can steer them, but the wheel is weaker.

@ sasae-tsurikomi-ashi | Sasae-tsurikomi-ashi
f leg-blocks
k takedown
p standing
s judo
g both
l blue
kanji 支釣込足
en Supporting foot lift-pull throw
c nage/ashi
gk 1
kz front-corner
ijf legal
ng adapt
a Propping drawing ankle throw | Lift-pull foot block | Foot block | Sasae
= Lift and pull them onto their front foot, block the front of that ankle with the sole of your foot, and wheel them over it.
1 j-grip | Sleeve and lapel. Step back with your right foot, turning a little to your left, so they step forward with their right foot.
2 j-pull | Lift with the lapel hand and pull the sleeve up and out (that's tsurikomi, lift and pull), so their weight comes onto the toes of their right foot, toward their right front corner.
3 j-deashi | Put the sole of your left foot on the front of their right ankle, just above the instep, leg straight, toes turned in. Do it as the foot lands, before it settles.
4 j-taiotoshi | Lean back a little, turn your shoulders to the left and wheel your hands: the sleeve down to your left hip, the lapel hand up and over. They trip over the blocked ankle and roll forward.
5 j-landed | Keep the sleeve and stay on your feet.
+ Lift first, then turn: the lift is what makes it work | Sole on the front of the ankle, not the shin | Block the foot they're stepping onto | Your weight on your back leg, leaning slightly away from them
- Kicking the ankle instead of blocking it | Pulling straight down without lifting first | Standing square, so your hands can't turn | Blocking a foot that's already planted with their weight back
x They step over your foot: block higher at the knee (hiza-guruma) or turn in for tai-otoshi | They pull back: ko-soto-gari or o-uchi-gari | They lift the blocked foot and step around: harai-tsurikomi-ashi or de-ashi-harai as it comes down
v hiza-guruma, harai-tsurikomi-ashi, tai-otoshi, de-ashi-harai, ashi-guruma
n Part of the leg-throw set in Nage-no-kata. No drawing of the foot block from the front yet; the foot-sweep and body-drop drawings are the closest. It's hiza-guruma lower down, and tai-otoshi without turning in.

@ o-uchi-gari | O-uchi-gari
f reaps
k takedown
p standing
s judo
g both
l white
kanji 大内刈
en Major inner reap
c nage/ashi
gk 1
kz back-corner
ijf legal
ng works
a Major inner reap | Large inner reap | Inside trip | Inside leg reap
= Drive them back so their weight is on their far heel, hook that leg from the inside with yours and reap it out in a wide circle as you push them down onto their back.
1 j-grip | Sleeve and lapel. Get chest to chest and close.
2 j-push | Push them back and a little to their left so their weight sinks onto their left heel. Step your left foot in behind your right heel, close to them.
3 j-ouchi | Slide your right leg in between their legs and hook the inside of their left leg, calf against calf, knee bent, toes pointed.
4 j-ouchi | Reap the leg out and away in a wide half circle along the mat, toward their left back corner, while your chest and hands drive them back and down.
5 j-landed | Follow them down and land on top, ready to pass or pin.
+ Get close: chest in, hips in | Reap along the mat in a circle, not up in the air | Their weight has to be on the leg you reap | Head up, drive with your whole body, not just your arms | Seoi-nage's best partner: they defend one and walk into the other
- Reaping from too far away, so you fall over | Bending forward at the waist | Reaping the leg with no weight on it, so they just lift it | Pulling down with your hands instead of pushing them back
x They lift the reaped leg and step out: switch to ko-uchi-gari on the other foot or o-soto-gari | They turn your reap back on you: o-uchi-gaeshi | They push back hard: they're leaning forward now, so seoi-nage or uchi-mata
v ko-uchi-gari, o-soto-gari, ko-soto-gari, seoi-nage, uchi-mata, o-uchi-gaeshi
n In no-gi it's wrestling's inside trip from a body lock or an underhook, one of the safest jiu-jitsu takedowns because you land on top in their guard or passing it.
b inside-trip

@ ko-soto-gari | Ko-soto-gari
f reaps
k takedown
p standing
s judo
g both
l white
kanji 小外刈
en Minor outer reap
c nage/ashi
gk 2
kz back-corner
ijf legal
ng works
a Minor outer reap | Small outer reap | Outside trip | Outside foot reap
= Push them back onto one heel and reap that heel out from behind with the sole of your foot, in the direction their toes point, so they sit down hard.
1 j-grip | Sleeve and lapel. Wait for them to step forward with their right foot, or circle them so it comes forward.
2 j-push | Push them back and down toward their right back corner so their weight sinks onto their right heel. Step your right foot out a little to the side so your left foot can reach.
3 j-deashi | Reap the back of their right heel with the sole of your left foot, low along the mat, in the direction their toes point.
4 j-deashi | Keep driving with your hands, back and down over that heel, like pushing them into a chair behind them.
5 j-landed | They sit down and roll back. Follow them down on top.
+ Their weight on the heel you reap | Reap with the sole, low, toward their toes | Hands push back and down at the same time as the reap | Best timing: as they step forward onto that foot, or step back
- Reaping high on the calf, which turns it into a weak o-soto-gari | Kicking instead of reaping | No push from the hands, so the foot slides and they stay up | Leaning in so far they can step past you
x They lift the foot and step away: switch to o-soto-gari or o-uchi-gari | They drop their weight forward to stop it: now throw them forward with tai-otoshi or seoi-nage | They counter by sweeping your standing foot: keep your reap short and fast
v ko-soto-gake, ko-uchi-gari, o-soto-gari, o-uchi-gari, de-ashi-harai
n No drawing of the reap from behind the heel yet; the foot-sweep drawing is the closest. In no-gi it's the outside trip from a clinch or body lock.
b outside-trip

@ ko-uchi-gari | Ko-uchi-gari
f reaps
k takedown
p standing
s judo
g both
l white
kanji 小内刈
en Minor inner reap
c nage/ashi
gk 2
kz back-corner
ijf legal
ng works
a Minor inner reap | Small inner reap | Inside foot reap | Ankle reap
= From the inside, reap their near heel with the sole of your foot toward where their toes point, while your hands push them back over it.
1 j-grip | Sleeve and lapel. Square up close to them.
2 j-push | Push them back and down toward their right back corner, so their weight goes onto their right heel. Step your left foot in close, in front of their left foot.
3 j-kouchi | Reach your right foot in between their feet and hook the inside of their right heel with your sole, low on the mat.
4 j-kouchi | Reap the heel toward where their toes point, a short quick scoop along the mat, while your hands drive them back and down. Drop your weight as they sit down.
5 j-landed | Follow them down or stay standing, ready to pass.
+ Small and fast: a short scoop, not a big swing | Sole of the foot, low, toward their toes | Hands push their weight back onto that heel | The classic setup for seoi-nage
- Reaping when their weight is forward on their toes | Lifting your leg high off the mat | Leaning forward so they sprawl or step out | Grabbing their leg with your hand (that's a shido in IJF judo)
x They lift the foot to dodge: their weight comes forward, so seoi-nage or tai-otoshi | They turn your reap into a throw with their hands: ko-uchi-gaeshi | They step back out of it: follow with o-uchi-gari on the other leg
v o-uchi-gari, ko-soto-gari, seoi-nage, ippon-seoi-nage, ko-uchi-gaeshi
n A favorite combination opener: ko-uchi-gari makes them step back, and you turn in for seoi-nage or uchi-mata as they do. In no-gi it works from a clinch or an underhook.
b inside-trip

@ okuri-ashi-harai | Okuri-ashi-harai
f foot-sweeps
k takedown
p standing
s judo
g both
l purple
kanji 送足払
en Sliding foot sweep
c nage/ashi
gk 2
kz side
ijf legal
ng adapt
a Following foot sweep | Side foot sweep | Double foot sweep | Okuri-ashi-barai
= Step sideways together and, as their feet come together, sweep their trailing foot into the other one so both feet fly out and they drop on their side.
1 j-grip | Sleeve and lapel, standing a little more upright than usual.
2 j-pull | Side-step together: you step to your right, so they step to their left. Lift a little with both hands on each step to set the rhythm.
3 j-deashi | On the step where their feet close together, sweep the outside of their right ankle with the sole of your left foot, following it in the direction they're moving, into their other foot.
4 j-deashi | Lift with both hands at the same moment, so both of their feet go out sideways together. They fall on their side.
5 j-landed | Keep the sleeve as they land.
+ Sweep with the sole, leg straight from the hip, in the direction they're moving | Lift with the hands at the moment of the sweep, so their feet are light | Speed them up: your step slightly bigger and faster than theirs | Stay upright and close
- Kicking at the ankle | Sweeping across their legs instead of along with them | Hands that don't lift, so their feet are too heavy to move | Bending forward toward them
x They lift the foot over the sweep and sweep yours: tsubame-gaeshi | They stop moving and widen their feet: switch to de-ashi-harai or ko-soto-gari on the next step | It also works when they step backward: sweep the foot that follows
v de-ashi-harai, harai-tsurikomi-ashi, ko-soto-gari, tsubame-gaeshi
n Part of the leg-throw set in Nage-no-kata. Okuri means sending: you send their trailing foot after the leading one. No sideways drawing yet; the foot-sweep drawing is the closest.
b foot-sweep

@ uchi-mata | Uchi-mata
f hip-sweeps
k takedown
p standing
s judo
g both
l purple
kanji 内股
en Inner thigh throw
c nage/ashi
gk 2
kz front-corner
ijf legal
ng adapt
a Inner thigh throw | Inner thigh reap | Thigh throw
= Pull them onto their toes, turn in on one leg and lift the inside of their far thigh with the back of your leg, wheeling them over your hip and leg.
1 j-grip | Sleeve and lapel, or sleeve and a high collar grip.
2 j-pull | Pull the sleeve out and up and lift with the lapel hand, so their weight comes forward onto their toes.
3 j-turn-in | Step your right foot across in front of theirs, toes pointed in, then swing your left foot back and plant it between their feet. You're turned in, balanced on your left leg, right hip close to them.
4 j-uchimata | Swing your right leg back and up between their legs, the back of your thigh lifting the inside of their left thigh, high up.
5 j-uchimata | At the same time turn your head down and to your left and pull the sleeve around. Your body seesaws, your leg goes up, and they wheel over your hip and leg.
6 j-landed | Keep the sleeve and stay on your feet as they land.
+ Balance on one leg: bend the standing knee, then drive up off it | Back of your thigh high on their inner thigh, not at the knee | Hands lift and turn the whole time | Swing your leg up and back like a scorpion kick
- Diving head-first into the mat (dangerous, and an instant loss in IJF judo) | Sweeping low at their knee | Turning in with no kuzushi, so they just step around | Bending forward too early, with your hips far away from theirs
x They slip the leg and you fall forward: uchi-mata-sukashi | They lift you off the mat and counter: uchi-mata-gaeshi | They push their hips forward to block: ko-uchi-gari or o-uchi-gari
v harai-goshi, hane-goshi, o-uchi-gari, ko-uchi-gari, uchi-mata-sukashi, uchi-mata-gaeshi
n The most common winning throw in competition judo. Without a gi, use an overhook or underhook and a wrist grip; the leg action is the same. Kodokan files it under leg techniques even though the hip helps.

@ ko-soto-gake | Ko-soto-gake
f reaps
k takedown
p standing
s judo
g both
l blue
kanji 小外掛
en Minor outer hook
c nage/ashi
gk 3
kz back-corner
ijf legal
ng works
a Minor outer hook | Small outer hook | Outside hook | Outside trip
= Hook the back of their heel from the outside and hold it there, then drive them back over it with your body. They can't step back, so they fall straight back.
1 j-grip | Sleeve and lapel, or a body lock. Get close.
2 j-push | Push them back toward their right back corner so their weight sinks onto their right heel.
3 j-deashi | Hook the back of their right ankle from the outside with your left foot, your sole curled behind their heel, and hold it there. No swing.
4 j-push | Keep the hook and drive forward and down with your chest and hands. Their heel is trapped, so they can't step back to catch themselves.
5 j-landed | They fall straight back. Land on top.
+ Hook and hold, then drive: no swinging | Close the distance first; hips in | Their weight on the hooked heel | Drive with your chest, back and down
- Hooking high at the calf | Swinging the leg like a sweep (that's ko-soto-gari) | Hooking from too far, so you fall too | Driving straight down instead of back
x They pull the heel out of the hook: follow with o-uchi-gari on the other leg | They turn and lift the hooked leg: switch to o-soto-gari | You're on one leg while you hook: if they turn in for a hip throw, put the foot down and lower your hips
v ko-soto-gari, o-soto-gari, o-uchi-gari, ko-uchi-gari
n Gake means hook: ko-soto-gari reaps the heel away, ko-soto-gake holds it and drives the body over it. No drawing of the outside hook yet; the foot-sweep drawing is the closest. From a body lock in no-gi it's one of the best outside trips.
b outside-trip

@ ashi-guruma | Ashi-guruma
f leg-blocks
k takedown
p standing
s judo
g both
l purple
kanji 足車
en Leg wheel
c nage/ashi
gk 3
kz front-corner
ijf legal
ng adapt
a Leg wheel | Leg wheel throw
= Turn half in and stretch your straight leg across the front of their knee as an axle, then wheel them over it with your hands.
1 j-grip | Sleeve and lapel.
2 j-pull | Pull them up and forward toward their right front corner, onto the toes of their right foot.
3 j-turn-in | Step your left foot in front of their left foot and turn to your left, half your back toward them. Your hips stay out in front of them, not under them.
4 j-taiotoshi | Stretch your right leg straight across the front of their right knee, just above it. It's an axle they turn over, not a sweep.
5 j-taiotoshi | Twist your shoulders to the left and wheel your hands, the sleeve down and around, the lapel hand up and over. They wheel over your leg.
6 j-landed | Keep the sleeve as they land.
+ Leg straight, across the front of the knee or just above it | The hands do the throw: a big wheel | Hips don't load them; you turn and wheel | Lift them onto their toes first
- Sweeping the leg back (that's harai-goshi) | Leg down at the shin (that's tai-otoshi) | Leg up across their hips (that's o-guruma) | No kuzushi, so they just step over your leg
x They step over the leg: tai-otoshi on the next step, or harai-goshi | They lean back: o-uchi-gari or ko-uchi-gari | They sag their hips and grab you from behind: ura-nage or ushiro-goshi, so keep your hips out
v o-guruma, hiza-guruma, tai-otoshi, harai-goshi, harai-tsurikomi-ashi
n No drawing of the leg at knee height yet; the body-drop drawing (the same block lower, at the shin) is the closest. Ashi-guruma, o-guruma and harai-goshi look alike; the difference is where your leg goes and whether it sweeps.

@ harai-tsurikomi-ashi | Harai-tsurikomi-ashi
f foot-sweeps
k takedown
p standing
s judo
g both
l purple
kanji 払釣込足
en Lift-pull foot sweep
c nage/ashi
gk 3
kz front-corner
ijf legal
ng adapt
a Lift-pull foot sweep | Sweeping drawing ankle throw | Harai-tsurikomi
= Lift and pull them forward onto their front foot, then sweep that foot out from the front of the ankle so their legs go back as their body pitches forward and over.
1 j-grip | Sleeve and lapel. Step back so they step forward with their left foot.
2 j-pull | Lift with both hands and draw them forward toward their left front corner, so their weight comes up onto the toes of their left foot.
3 j-deashi | Sweep the front of their left ankle with the sole of your right foot, leg straight, sending their foot back the way their heel points.
4 j-taiotoshi | Turn your hands to your right like a steering wheel as the foot goes. Their legs go out behind them and their body tips forward and over.
5 j-landed | Keep the sleeve as they land.
+ It's sasae-tsurikomi-ashi with a sweep: the foot moves, it isn't blocked | Lift first, then sweep | Sole flat on the front of the ankle, leg straight | Lean back a little; don't reach in with your body
- Sweeping before they're lifted, so the foot is too heavy to move | Sweeping across the shin | Hands that pull down but don't turn | Kicking with your toes
x They step forward over your foot: switch to sasae-tsurikomi-ashi, hiza-guruma or tai-otoshi | They sit back: ko-soto-gari or o-uchi-gari | They lift the foot and sweep yours: keep your standing leg bent and the sweep quick
v sasae-tsurikomi-ashi, hiza-guruma, de-ashi-harai, okuri-ashi-harai, ashi-guruma
n The Kodokan shows it to their left front corner, with your right foot; it works to either side. No drawing of the sweep from the front yet; the foot-sweep and body-drop drawings are the closest.

@family leg-counters | Leg counters | The Kodokan's foot-and-leg counters (gaeshi means "turned back"): they attack with a reap, a foot sweep or a hip sweep, you take the power out of it and throw them with your own leg, usually onto their back.

@ o-guruma | O-guruma
f leg-blocks
k takedown
p standing
s judo
g both
l purple
kanji 大車
en Large wheel
c nage/ashi
gk 4
kz front-corner
ijf legal
ng adapt
a Large wheel | Major wheel | Big wheel
= Pull them up onto their toes, turn half in and stretch your straight leg across the front of their hips or upper thigh as an axle, then wheel them over it with your hands.
1 j-grip | Sleeve and lapel. Best as they step forward with their right foot, a bit upright, hips out toward you.
2 j-pull | Pull the sleeve up and out and lift hard with the lapel hand, so their weight comes forward and up onto their toes, toward their right front corner.
3 j-turn-in | Step your left foot back and across in front of their left foot and turn to your left. Leave some space between your back and their chest: your hips stay out, not deep under them.
4 j-taiotoshi | Stretch your right leg straight across the front of their lower belly or the top of their right thigh, toes off the mat. It's an axle, not a big sweep.
5 j-harai | Turn your head and shoulders to the left and wheel your hands down and around. They rotate over your leg and land on their back in front of you.
6 j-landed | Keep the sleeve as they land.
+ The leg stays straight and mostly still: it's an axle, they turn over it | Leg high, across the lower belly or top of the thigh; lower is ashi-guruma | The lift with the lapel hand is what gets them over | Best when they're tall, upright, or stepping forward with their hips out
- Swinging the leg up and back hard (that's harai-goshi) | Leg too low, at the knee or shin | Pulling down without lifting first, so they sit on your leg | Turning in too deep so your hip loads them (then it's a hip throw done badly)
x They lower their hips and push their belly into your back: you can't wheel, so switch to o-uchi-gari or ko-uchi-gari | They step around your leg: harai-goshi as they come | They grab around your waist from behind: ushiro-goshi or ura-nage, so keep your hips out and your turn quick
v ashi-guruma, harai-goshi, hiza-guruma, tai-otoshi, harai-tsurikomi-ashi, uchi-mata
n No drawing of the leg barred across their hips yet; the body-drop and sweeping-hip drawings are the closest. O-guruma, ashi-guruma and tai-otoshi are the same wheel at three heights: hip, knee, shin. Without a gi, an overhook and a wrist grip work for the wheel.

@ o-soto-guruma | O-soto-guruma
f reaps
k takedown
p standing
s judo
g both
l brown
kanji 大外車
en Large outer wheel
c nage/ashi
gk 5
kz back-corner
ijf legal
ng adapt
a Large outer wheel | Major outer wheel | Big outer wheel
= Drive them back onto their heels, put your one long leg behind BOTH their legs under their hips, and wheel them backward over it.
1 j-grip | Sleeve and lapel, chest close. Good when their feet are close together, or when they shift their weight to escape your o-soto-gari.
2 j-push | Pull the sleeve and drive them back toward their right back corner with the lapel hand, so their weight sinks onto both heels.
3 j-osoto | Step your left foot in close, outside their right foot. Bend your right knee and swing that leg deep behind them, so the back of your thigh lies across the back of both their legs, under their hips.
4 j-osoto | Use the leg as the axle: your chest and hands drive them back and down, and they wheel over your thigh onto their back.
5 j-landed | Keep pulling the sleeve as they land, so their head doesn't hit the mat hard.
+ Get deep: your leg has to reach past both of their legs | Their weight back on both heels | Chest to chest, drive back and down | The leg is a wheel's axle under their hips; the upper body does the turning
- Not stepping deep enough, so you only catch one leg (that's o-soto-gari) | Leaning back as you go, so they counter | Trying it when their feet are wide apart | Letting go of the sleeve, so they land on their head
x They reap your leg back before you finish: o-soto-gaeshi | They step one leg out of it: finish with o-soto-gari on the leg that's still caught | They lower their hips and bend forward: switch to a forward throw such as tai-otoshi
v o-soto-gari, o-soto-otoshi, o-soto-gaeshi, ko-soto-gari
n No drawing of the leg behind both their legs yet; the big outer reap drawing is the closest. A weak o-soto-gari makes a good fake: when they shift away from it, both legs are lined up for o-soto-guruma.

@ o-soto-otoshi | O-soto-otoshi
f reaps
k takedown
p standing
s judo
g both
l blue
kanji 大外落
en Large outer drop
c nage/ashi
gk hab
kz back-corner
ijf legal
ng works
a Large outer drop | Major outer drop | Outside trip
= Step in close, slide your leg down the back of theirs to the mat and drop them straight down backward over it, without reaping.
1 j-grip | Sleeve and lapel, or an underhook in no-gi. Get chest to chest.
2 j-push | Push them back toward their right back corner so their weight is on their right heel.
3 j-osoto | Step your left foot beside their right foot. Lift your right leg and slide your calf down the back of their right thigh until your foot is planted on the mat behind them.
4 j-push | Don't reap. Keep both feet on the mat and drive them straight back and down with your chest and hands, so they fall back over your leg.
5 j-landed | Land on top of them or stay standing over them.
+ The leg comes down behind theirs and stays planted; it's a block, not a swing | Both your feet on the mat; your upper body does the drop | Drive back and down, your head over their shoulder | Their weight on the blocked leg
- Swinging the leg (then it's o-soto-gari) | Standing too far away | Leaning back as you step in | Dropping your weight before their balance is broken
x They catch your leg in the air and reap it back: o-soto-gaeshi | They step back with the blocked leg: switch to o-uchi-gari on the other leg | They lean into you to stop it: turn in for a forward throw
v o-soto-gari, o-soto-guruma, ko-soto-gake, o-uchi-gari
n One of the Habukareta-waza: dropped from the Gokyo in 1920 and put back on the official list in 1982. No drawing of the planted leg yet; the big outer reap drawing is the closest. Even referees mix up o-soto-gari, o-soto-otoshi and o-soto-guruma: reap, drop, or wheel. In wrestling and no-gi it's the outside trip.
b outside-trip

@ tsubame-gaeshi | Tsubame-gaeshi
f leg-counters
k takedown
p standing
s judo
g both
l brown
kanji 燕返
en Swallow counter
c nage/ashi
gk shin
kz side
ijf legal
ng adapt
a Swallow counter | Counter foot sweep | Swallow reversal
= When they try to sweep your foot, lift it so their foot misses, then sweep their sweeping foot with the same foot of yours.
1 j-grip | Sleeve and lapel, moving around. They watch for your step, waiting to sweep it.
2 j-deashi ! | They sweep at your right foot with de-ashi-harai. Feel it coming.
3 j-grip | Shift your weight onto your left leg and bend your right knee, lifting that foot just enough that their sweep passes under it, like a swallow dodging.
4 j-deashi | Bring the same foot straight back down and sweep the back of their sweeping foot with your sole, in the direction it was already going, while your hands lift and turn them.
5 j-landed | Their foot keeps going with nothing under them and they drop on their side. Keep the sleeve.
+ Lift, don't step back: the foot comes back down onto theirs | Sweep in the same direction their foot was already moving | Lift with your hands at the moment you sweep | Relaxed legs; it's pure timing
- Lifting the foot too high, so you're off balance | Pausing between the dodge and the sweep | Sweeping across their foot instead of along with it | Trying it before they've committed to the sweep
x They pull their foot back quickly: you're fine, start again | They fake the sweep to make you lift the foot, then throw you with o-uchi-gari | They sweep with their hands lifting you: keep your knees bent
v de-ashi-harai, okuri-ashi-harai, harai-tsurikomi-ashi, o-soto-gaeshi
n One of the Shinmeisho-no-waza the Kodokan added in 1982. The "!" picture shows them sweeping you. It's your own de-ashi-harai, done the moment theirs misses. Mostly seen against foot-sweep specialists; without a gi a collar tie and wrist grip give you the control.

@ o-soto-gaeshi | O-soto-gaeshi
f leg-counters
k takedown
p standing
s judo
g both
l purple
kanji 大外返
en Large outer counter
c nage/ashi
gk shin
kz back-corner
ijf legal
ng works
a Large outer counter | Major outer counter | O-soto counter | Counter outer reap
= They swing their leg in to reap you with o-soto-gari; you stay heavy, pull them chest to chest and reap their reaping leg back with your own o-soto-gari.
1 j-grip | Sleeve and lapel, square up.
2 j-osoto ! | They step in beside you and swing their right leg to reap your right leg.
3 j-pull | Stiffen the leg they're after and keep it heavy on the mat. Step your other foot forward and pull hard with the lapel hand, bringing their chest tight to yours so their balance goes back.
4 j-osoto | Their reaping leg is in the air. Reap it with your right leg: back of your thigh against the back of theirs, swinging back and up while your chest drives them back.
5 j-osoto | Keep the reap going until the sole of your foot points at the ceiling. They're on one leg, so they go straight back.
6 j-landed | Land on top or stay standing, ready to follow up.
+ Stay heavy first: a planted leg takes the power out of their reap | Pull them in chest to chest so their weight goes back | Reap their floating leg, and keep reaping all the way up | Your head drives forward and down; don't lean back
- Leaning back, so they finish their throw | Trying to reap while your own leg is already off the mat | Stopping the reap halfway, so they put the foot down | Letting go with the hands
x They switch from the reap to o-soto-guruma or ko-soto-gake on your other leg | They pull their reaping leg back and step out | They turn in for a hip throw as you lean forward
v o-soto-gari, o-soto-guruma, o-soto-otoshi, o-uchi-gaeshi, ko-uchi-gaeshi
n One of the Shinmeisho-no-waza added in 1982. The "!" picture shows their reap on you. It only works when their o-soto-gari hasn't broken your balance first, so it's a battle of posture: both of you reap with the same leg and whoever is more upright wins. It works the same from an underhook in no-gi.
b outside-trip

@ o-uchi-gaeshi | O-uchi-gaeshi
f leg-counters
k takedown
p standing
s judo
g both
l purple
kanji 大内返
en Large inner counter
c nage/ashi
gk shin
kz back-corner
ijf legal
ng works
a Large inner counter | Major inner counter | O-uchi counter | Counter inner reap
= They hook your leg from the inside for o-uchi-gari; you turn with the reap so it pushes nothing, then sweep their reaping leg out from under them and twist them onto their back.
1 j-grip | Sleeve and lapel. Works best when their o-uchi-gari doesn't get them chest to chest with you.
2 j-ouchi ! | They hook the inside of your left leg with their right leg and start to reap it.
3 j-pull | Don't stiffen. Turn your body toward their reaping foot and let your hooked leg go with the reap, so its power goes off to the side. Now they're stuck on one leg.
4 j-deashi | Sweep their reaping leg with your left leg, in the direction their toes point, so it carries on out from under them.
5 j-pull | Keep turning: pull them back with the sleeve hand and push with the lapel hand the same way, so their upper body twists down.
6 j-landed | They fall on their back. Keep the sleeve and follow up to a pin.
+ Turn with the reap, don't fight it | Sweep along the line their toes point | Both hands turn them the same way as your sweep | Do it the moment they hook, while they're on one leg
- Stiffening the hooked leg, so it's a fight of strength | Leaning back while they reap, so their throw works | Hands and legs going different ways | Waiting too long, after they've finished the reap
x They pull the reaping leg out and switch to ko-uchi-gari or seoi-nage | They drive you back hard, chest to chest: then their o-uchi-gari wins, so don't let them close the space | They follow your turn with o-soto-gari
v o-uchi-gari, ko-uchi-gaeshi, ko-uchi-gari, o-soto-gaeshi
n One of the Shinmeisho-no-waza added in 1982, and common in competition. The "!" picture shows their reap on you; no drawing of the counter itself yet, so the foot-sweep and steering-hands drawings stand in. It's the same idea as ko-uchi-gaeshi, against the big inside reap.

@ hane-goshi-gaeshi | Hane-goshi-gaeshi
f leg-counters
k takedown
p standing
s judo
g both
l brown
kanji 跳腰返
en Spring hip counter
c nage/ashi
gk shin
kz back
ijf legal
ng adapt
a Spring hip counter | Hip spring counter | Hane-goshi counter
= As they turn in for hane-goshi and bring their bent leg up, you refuse to go onto their hip, tip them back, and sweep the leg they're standing on out from behind.
1 j-grip | Sleeve and lapel.
2 j-hip-throw ! | They turn in, press their hip against you and bring their bent leg up against the inside of your leg to spring you over.
3 j-pull | Don't get loaded: sink your hips and push your belly into their back. Pull them back toward you so their balance tips backward onto their standing leg.
4 j-deashi | Hook your left leg around the outside of their standing (left) leg, low, between the knee and the shin, and sweep it inward, to your right.
5 j-landed | Their standing leg goes and they fall backward onto their back. Keep the sleeve and stay balanced.
+ Kill their lift first: hips low, belly into their back | Sweep the leg they're standing on, not the one in the air | Sweep low, between knee and shin, from the outside in | Fast, while they're still on one leg
- Countering after they've already loaded you on their hip | Leaning forward over their back, which feeds their throw | Reaching for their springing leg instead of the standing one | Standing tall, with your hips above theirs
x They switch from hane-goshi to o-uchi-gari or ko-uchi-gari when you sit back | They finish with hane-makikomi, wrapping your arm as they fall | They pull the leg back and turn in again
v hane-goshi, harai-goshi-gaeshi, uchi-mata-gaeshi, utsuri-goshi, ushiro-goshi
n One of the Shinmeisho-no-waza added in 1982. The "!" picture shows them turning in on you; the foot-sweep drawing is the closest to the counter-sweep. The IJF also shows a second way: lift them and reap their leg to your left with your right leg. It only works if their hane-goshi didn't break your balance first.

@ harai-goshi-gaeshi | Harai-goshi-gaeshi
f leg-counters
k takedown
p standing
s judo
g both
l brown
kanji 払腰返
en Sweeping hip counter
c nage/ashi
gk shin
kz back
ijf legal
ng adapt
a Sweeping hip counter | Hip sweep counter | Harai-goshi counter
= As they turn in for harai-goshi and swing their leg up, you refuse to go onto their hip, push them back onto their standing leg and sweep it out from behind.
1 j-grip | Sleeve and lapel.
2 j-harai ! | They turn in, their hip across yours, and swing their straight leg up to sweep yours.
3 j-pull | Don't get pulled onto their hip: sink your hips, push their chin or collar back with your lapel hand and pull with the sleeve hand, so their weight tips back onto their standing leg.
4 j-deashi | Hook your left leg around the outside of their standing (left) leg from behind, between the knee and the shin, and sweep it inward, to your right.
5 j-landed | Their standing leg goes and they fall backward onto their back. Keep the sleeve as they land.
+ Stop their hip first: hips low, push them back | Sweep the leg they're standing on, from behind | Sweep low, between knee and shin, from the outside in | Quick, while their sweeping leg is still in the air
- Leaning forward over their hip, which feeds their throw | Sweeping the leg that's in the air | Countering before you've stopped their turn | Standing tall, with your hips above theirs
x They switch their sweep into harai-makikomi and fall with you | They change to o-uchi-gari or ko-uchi-gari as you sit back | They turn the other way into a hip throw on the other side
v harai-goshi, hane-goshi-gaeshi, uchi-mata-gaeshi, o-soto-gaeshi, utsuri-goshi, ushiro-goshi
n One of the Shinmeisho-no-waza added in 1982. The "!" picture shows their sweep on you; the foot-sweep drawing is the closest to the counter-sweep. Harai-goshi-gaeshi, hane-goshi-gaeshi and uchi-mata-gaeshi finish the same way: stop the hip, then sweep the leg they're standing on.

@ uchi-mata-gaeshi | Uchi-mata-gaeshi
f leg-counters
k takedown
p standing
s judo
g both
l brown
kanji 内股返
en Inner thigh counter
c nage/ashi
gk shin
kz back
ijf legal
ng adapt
a Inner thigh counter | Inner thigh reaping counter | Uchi-mata counter
= As they hop onto one leg to swing up between your legs for uchi-mata, you hold your ground, push them back, and reap the leg they're standing on out from behind.
1 j-grip | Sleeve and lapel.
2 j-uchimata ! | They turn in on one leg and swing their leg up between your legs to lift your thigh.
3 j-pull | Hold your ground: weight back, hips low. Pull them in close with both hands and push their upper body back, so their balance tips onto their heel.
4 j-deashi | Hook your left leg around their standing (left) leg from behind and reap it to your right.
5 j-landed | They fall backward onto their back. Stay upright and keep the sleeve.
+ Don't let them lift you: weight back, hips low | Reap the leg they're standing on, not the one in the air | Push them back with your hands as you reap | Stay upright as you reap; long legs help
- Leaning forward over their back, which feeds the throw | Countering late, when they've already lifted you | Pushing them away so they can step out, instead of pulling them close | Falling down with them (then it's tani-otoshi)
x They switch to ko-uchi-gari or o-uchi-gari when you sit back | They finish with uchi-mata-makikomi, wrapping your arm and rolling | They pull the leg back and turn in again
v uchi-mata, uchi-mata-sukashi, hane-goshi-gaeshi, harai-goshi-gaeshi, tani-otoshi
n One of the Shinmeisho-no-waza added in 1982. Uchi-mata-sukashi waits for their leg and lets it miss, then throws you with your hands (a te-waza); uchi-mata-gaeshi beats their uchi-mata before it gets going and uses your leg on their standing leg. If you lose your posture and sit down as you reap, it turns into tani-otoshi. The "!" picture shows their attack on you; the foot-sweep drawing stands in for the reap.

@family kan-bent | Bent-arm lock | Ude-garami: the figure-four lock on a bent arm, both ways (jiu-jitsu's americana and kimura).
@family kan-legs | Straight armlocks with the legs | Ude-hishigi locks where your legs trap and straighten the arm: juji-gatame, ashi-gatame and the triangle armlock.
@family kan-body | Straight armlocks with the hands and body | Ude-hishigi locks that straighten the elbow against your hands, knee, armpit or stomach.
@family kan-ashi | Leg entanglement | Ashi-garami: the knee lock that judo has banned.

@ ude-garami | Ude-garami
f kan-bent
k submission / shoulder
p side-control
s judo
g both
l white
kanji 腕緘
en Arm entanglement
c katame/kansetsu
gk katame
ijf legal
ng works
a Arm entanglement | Entangled armlock | Americana | Keylock | Paintbrush | Kimura | Gyaku ude-garami | Double wristlock | Figure-four armlock
= A figure-four lock on a bent arm: one hand holds their wrist, your other arm threads under their arm to grab your own wrist, and you turn the arm like a key. Palm up toward their head is the americana; behind their back is the kimura.
1 side-control | From side control (yoko-shiho or kesa), wait for their far arm to come up, elbow bent.
2 americana | Pin their wrist to the mat with your near-side hand (the hand closest to their head), their elbow bent at a right angle.
3 americana | Thread your other hand under their upper arm and grab your own wrist: the figure four.
4 americana | Keep their elbow pinned to the mat and slide their wrist down toward their hip, lifting the elbow slightly, like painting the mat. The shoulder twists.
5 kimura-side | The reverse: if their arm points down by their hip, grip the wrist, figure-four over the top and crank their hand up behind their back.
+ Elbow at a right angle | Wrist pinned to the mat for the americana | Chest heavy on theirs so they can't turn | Slide the wrist and lift the elbow at the same time
- Lifting the wrist off the mat | A straight arm, which takes the twist out | Cranking fast: the shoulder goes suddenly
x Straighten the arm, or grab your own belt or gi | Turn into the attacker before the grip is set | Bridge and turn toward the trapped arm
v ude-hishigi-juji-gatame, yoko-shiho-gatame, kesa-gatame
b americana-side-control, kimura-side-control, kimura-closed-guard, kimura-north-south, kimura-half-guard
n The Kodokan name covers both directions: "ude-garami" (arm up, the americana) and "gyaku ude-garami" (arm behind the back, the kimura). Masahiko Kimura used the second one to beat Hélio Gracie in 1951, which is why jiu-jitsu named it after him.

@ ude-hishigi-juji-gatame | Ude-hishigi-juji-gatame
f kan-legs
k submission / elbow
p mount
s judo
g both
l white
kanji 腕挫十字固
en Cross armlock
c katame/kansetsu
gk katame
ijf legal
ng works
a Cross armlock | Juji-gatame | Armbar | Straight armbar | Juji | Cross-body armlock
= Their arm between your legs, your hips under their elbow and your legs across their chest and neck: hold the wrist to your chest and lift your hips to straighten the arm.
1 mount | From mount, side control or uki-gatame, trap one of their arms against your chest with both arms.
2 s-mount | Shift your weight onto the trapped arm side and bring your knee up by their head.
3 armbar | Swing your other leg over their face and sit down close to their shoulder, your knees pinching their arm.
4 armbar | Turn their thumb up toward the ceiling, hug the wrist to your chest and lift your hips. The elbow goes over your hips.
+ Sit close to their shoulder: no space between your bottom and their armpit | Knees pinched | Thumb pointing up | Lift the hips slowly
- Sitting far from the shoulder | Letting the elbow slide out past your hips | Jerking the arm (in practice)
x Clasp your hands together or grab your own lapel | Turn your thumb down and pull the elbow out | Stack the attacker and turn into them
v ude-garami, ude-hishigi-sankaku-gatame, uki-gatame, ude-hishigi-ude-gatame
b armbar-mount, armbar-closed-guard, armbar-side-control, armbar-knee-on-belly, armbar-s-mount
n The most-used armlock in judo, often hit with a roll (the "juji-gatame roll") from the turtle.

@ ude-hishigi-ude-gatame | Ude-hishigi-ude-gatame
f kan-body
k submission / elbow
p closed-guard
s judo
g both
l blue
kanji 腕挫腕固
en Arm armlock
c katame/kansetsu
gk katame
ijf legal
ng works
a Arm armlock | Ude-gatame | Straight armlock | Arm crush | Shoulder armlock | Pressure armbar
= Trap their straight arm with the wrist against your shoulder or neck, both hands cupped on the outside of the elbow, and press the elbow in toward you.
1 closed-guard | From guard, side control or standing, their arm reaches straight toward your neck or shoulder.
2 closed-guard | Pin their wrist against your shoulder or neck with your head.
3 closed-guard | Cup both hands over the outside of their elbow, one on top of the other.
4 closed-guard | Pull the elbow toward you and in while your shoulder pushes the wrist away. Turn your body to the side to add pressure.
+ Their wrist trapped tight against you | Both hands on the elbow, just above the joint | Their palm up | Turn your body to the side
- Pressing on the forearm, not the elbow | Letting the wrist slide off your shoulder | A bent arm, where nothing happens
x Bend the arm | Pull your wrist off their shoulder and back | Turn your thumb down and the elbow in
v ude-hishigi-te-gatame, ude-hishigi-juji-gatame, ude-hishigi-waki-gatame
b straight-armlock-mount
n In Katame-no-kata you kneel beside them as they reach up from their back; the steps show it from guard, where it works the same way (angle your body out to the side of the trapped arm). The guard drawing is the closest picture.

@ ude-hishigi-hiza-gatame | Ude-hishigi-hiza-gatame
f kan-body
k submission / elbow
p closed-guard
s judo
g both
l blue
kanji 腕挫膝固
en Knee armlock
c katame/kansetsu
gk katame
ijf legal
ng works
a Knee armlock | Hiza-gatame | Knee bar to the arm | Guard knee armlock
= From your back, trap their arm under your armpit, put a foot on their hip and press your knee against their elbow to straighten it.
1 closed-guard | From guard, catch their right wrist and trap it under your right armpit.
2 omoplata | Open your guard, put your right foot on their left hip and turn onto your right side.
3 omoplata | Bring your left knee onto the outside of their right elbow.
4 omoplata | Push your knee into the elbow and pull the trapped wrist tight to your chest. The elbow straightens over your knee.
+ Wrist trapped high in the armpit | Foot on the hip keeps them from driving forward | Your knee is just above the elbow | Turn your hips into the knee
- Knee on the forearm instead of the elbow | Letting the wrist slip out of the armpit | Lying flat on your back with no angle
x Bend the arm and drive it out | Stack forward into the attacker | Posture up and pull the wrist back
v ude-hishigi-waki-gatame, ude-hishigi-juji-gatame, ude-hishigi-ashi-gatame
b overhook-armbar, armbar-closed-guard
n In Katame-no-kata both people sit, but it works from guard and from the turtle too. The drawing shows the omoplata, the closest picture.

@ ude-hishigi-waki-gatame | Ude-hishigi-waki-gatame
f kan-body
k submission / elbow
p standing
s judo
g both
l blue
kanji 腕挫腋固
en Armpit armlock
c katame/kansetsu
gk katame
ijf caution
ng works
a Armpit armlock | Waki-gatame | Armpit lock | Fujiwara armbar | Fujiwara | Crossface armbar
= Trap their straight arm under your armpit, thumb down, your hand holding their wrist, and press down on the elbow with your armpit and body weight.
1 j-grip | Standing, or with them on their stomach or turtle, grab their wrist with your opposite hand.
2 waki-gatame | Step to the outside of the arm, stretch it straight and pin their wrist against your side.
3 waki-gatame | Lay your armpit on the back of their elbow, their thumb pointing down.
4 waki-gatame | Lower your chest toward the mat and drive the elbow down with your armpit while your hand pulls the wrist up.
+ Thumb pointing down | Armpit just above the elbow | Your body is the weight, not your arms | From a turtle: sprawl your weight onto the elbow
- Falling straight down onto the mat while you apply it in judo (an instant disqualification) | Armpit on the forearm | Letting them bend the elbow
x Bend the arm and turn into the attacker | Roll forward with the arm (a judo roll) | Turn the thumb up
v ude-hishigi-hiza-gatame, ude-hishigi-hara-gatame, ude-hishigi-te-gatame
n Use with care: the IJF gives hansoku-make (disqualification) for falling directly to the mat while applying it standing, because it breaks elbows. On the ground it's fine. Jiu-jitsu calls the ground version the Fujiwara armbar.

@ ude-hishigi-hara-gatame | Ude-hishigi-hara-gatame
f kan-body
k submission / elbow
p turtle-top
s judo
g both
l purple
kanji 腕挫腹固
en Stomach armlock
c katame/kansetsu
gk katame
ijf legal
ng works
a Stomach armlock | Hara-gatame | Belly armlock | Turtle armlock
= Trap their straight arm with your hands and lay your stomach on the back of their elbow, then press down with your body.
1 turtle | They're in the turtle with an arm out; you're at their side.
2 turtle | Grab their wrist and pull the arm out straight to the side, thumb down.
3 waki-gatame | Kneel and drop your stomach onto the back of their elbow, holding the wrist to your body.
4 waki-gatame | Press down with your stomach while your hands pull the wrist up. The elbow straightens over your belly.
+ Thumb down | Your stomach just above the elbow | Pull the wrist up as the belly goes down | Fast: they pull the arm back in quickly
- Lying across the forearm | Letting them bend the elbow | Losing the position on the turtle while you try it
x Pull the arm back under the body | Roll forward with the arm | Turn to face the attacker
v ude-hishigi-waki-gatame, ude-hishigi-ashi-gatame
n The drawing shows waki-gatame, the closest picture; in hara-gatame the stomach does the pressing instead of the armpit.

@ ude-hishigi-ashi-gatame | Ude-hishigi-ashi-gatame
f kan-legs
k submission / elbow
p closed-guard
s judo
g both
l purple
kanji 腕挫脚固
en Leg armlock
c katame/kansetsu
gk katame
ijf legal
ng works
a Leg armlock | Ashi-gatame | Leg armbar | Monoplata-style armlock
= Trap their arm straight and hook your leg over their elbow, then push down with the leg while your hands pull the wrist up.
1 closed-guard | From guard, catch one of their wrists with both hands as they post or reach.
2 omoplata | Open your guard and swing your leg on the same side over their shoulder and arm.
3 omoplata | Hook the back of your knee or calf over the elbow joint and straighten their arm.
4 omoplata | Push down with the leg and pull the wrist up toward your chest. The elbow bends backward.
+ Their arm straight before you push | Your leg right on the elbow | Pull the wrist up as the leg goes down | Works from the turtle too: kick your leg over their arm and roll
- Leg on the shoulder, which turns into the omoplata instead | Letting them bend the arm | Loose grip on the wrist
x Bend the arm and posture | Roll forward over the shoulder | Pull the arm back in
v ude-hishigi-juji-gatame, ude-hishigi-hiza-gatame, ude-hishigi-sankaku-gatame
b monoplata, omoplata-closed-guard
n Descriptions vary: any armlock where your leg is the lever on a straight arm falls under this name.

@ ude-hishigi-te-gatame | Ude-hishigi-te-gatame
f kan-body
k submission / elbow
p standing
s judo
g both
l blue
kanji 腕挫手固
en Hand armlock
c katame/kansetsu
gk katame
ijf legal
ng works
a Hand armlock | Te-gatame | Hand lock armbar | Straight arm lock with the hands
= Pin their wrist against your body with one hand and lever the elbow straight with your other hand or forearm.
1 j-grip | Standing or on the ground, they reach toward you with a straight arm.
2 j-grip | Grab their wrist and pin it against your hip or ribs, their palm up.
3 waki-gatame | Put your other hand or forearm on the back of their elbow.
4 waki-gatame | Push the elbow while holding the wrist tight to your body. Turn your body away from the arm for more pressure.
+ Wrist pinned to your body | Hand just above the elbow | Palm up | Turn your body, not just your arm
- Holding the wrist out in space | Pushing on the forearm | Letting them bend the arm
x Bend the arm | Step in close to the attacker | Turn the thumb down
v ude-hishigi-ude-gatame, ude-hishigi-waki-gatame
b straight-armlock-mount, wristlock-top-frame
n The drawing shows waki-gatame, the closest picture; here the hand, not the armpit, levers the elbow.

@ ude-hishigi-sankaku-gatame | Ude-hishigi-sankaku-gatame
f kan-legs
k submission / elbow
p closed-guard
s judo
g both
l blue
kanji 腕挫三角固
en Triangle armlock
c katame/kansetsu
gk katame
ijf legal
ng works
a Triangle armlock | Sankaku-gatame | Armbar from triangle | Triangle armbar
= With their head and arm locked in your leg triangle, grab the trapped wrist and pull it across your belly to straighten the elbow.
1 closed-guard | From guard, get the triangle: one arm in, one arm out.
2 triangle | Lock the triangle and pull their head down.
3 triangle | Grab the trapped wrist with both hands.
4 triangle | Pull the wrist across your stomach toward the free-arm side, thumb up, and lift your hips into the elbow.
+ The triangle stops them escaping while you work the arm | Thumb up | Lift the hips | If they defend the arm, finish the choke instead
- Letting go of the triangle squeeze | Pulling the wrist toward your head | Their thumb down
x Bend the arm and grab your own gi | Posture up and stack | Pull the arm free and step out
v sankaku-jime, ude-hishigi-juji-gatame, ude-hishigi-ashi-gatame
b armbar-from-triangle, triangle-closed-guard
n Judo files this under armlocks: the same triangle is also sankaku-jime (the choke) and sankaku-osae (pinning with it).

@ ashi-garami | Ashi-garami
f kan-ashi
k submission / leg
p standing
s judo
g both
l brown
r kneebar, reap
kanji 足緘
en Leg entanglement
c katame/kansetsu
gk katame
ijf forbidden
ng works
a Leg entanglement | Knee lock | Kodokan ashi-garami | Leg tangle
= Drop under them as if for tomoe-nage, wrap your leg around their leg from the outside and use both legs to straighten and twist their knee. FORBIDDEN in judo: it's on the Kodokan list but banned in all judo competition.
1 j-grip | Grip their lapel and sleeve, as you would for tomoe-nage.
2 j-tomoe | Put one foot on their hip and sit back as if for tomoe-nage. They plant their feet and don't go over.
3 straight-ankle | Wrap your other leg around their leg from the outside, your foot hooking in on the inside of their thigh.
4 kneebar | Pull with your hands, push their hip away with the first foot and squeeze with the wrapped leg. Their knee straightens and twists.
+ It's forbidden in judo: never use it in a judo match | Control their leg before you twist | Go slowly in training: knees break without warning
- Using it in a judo match (instant disqualification) | Cranking fast in training | Letting the knee slip free before the lock
x Step back out before their leg wraps around yours | Bend the trapped knee and drop your weight onto them | Pull the foot free, toes pointed
v ude-hishigi-ashi-gatame, do-jime
b kneebar-top, heel-hook-outside, ashi-garami-position, outside-ashi-position
n Forbidden in judo; you see it only in Katame-no-kata, where it starts like tomoe-nage. Jiu-jitsu's "ashi garami" leg position is named after it, and the idea lives on in the leg-lock system (kneebars, heel hooks, reaping the knee), which has its own rules by belt and ruleset.

@family hip-throws | Hip throws | The classic hip throws: your hips across in front of theirs and one arm around their waist, neck or belt, so they roll over your hip.
@family tsurikomi | Lift-pull hip throws | "Tsurikomi" means lift and pull: one hand lifts them onto their toes, the other pulls them forward, and you turn in low under them without wrapping them up.
@family hip-sweeps | Hip sweeps | Your hip loads them and your leg takes their leg away: a straight-leg sweep in harai-goshi, a bent-leg spring in hane-goshi. Uchi-mata is the close cousin.
@family hip-counters | Hip counters from behind | When they turn in for a hip throw and stall, hug their waist from behind and lift: drop them straight down (ushiro-goshi) or switch your hip in front of them (utsuri-goshi).

@ uki-goshi | Uki-goshi
f hip-throws
k takedown
p standing
s judo
g both
l white
kanji 浮腰
en Floating hip
c nage/koshi
gk 1
kz front-corner
ijf legal
ng works
a Floating hip | Floating hip throw | Half hip throw
= Hug them around the waist, put your hip halfway across the front of theirs and twist, so they float around your hip and fall without being lifted.
1 j-grip | Your left hand grips their right sleeve. Your right arm reaches under their left arm and around their back, hand flat on their back or holding the belt.
2 j-pull | Pull the sleeve forward and up toward their right front corner so they lean onto their right toes. Hug them in with the back arm.
3 j-turn-in | Step your right foot in front of their right foot and turn to your left, so your right hip slides across the front of their belly. Only halfway: your hip goes in, not your whole body.
4 j-hip-throw | Twist your shoulders hard to the left, pulling the sleeve around and down while the back arm hugs them tight to your hip. Keep your knees soft; you don't lift.
5 j-landed | They float around your hip and land on their back in front of you. Keep the sleeve.
+ No lift: you twist, you don't straighten your legs | Hip only halfway across; all the way is o-goshi | Hug them tight to your hip with the back arm | Big twist of the shoulders, the sleeve pulled around like a steering wheel
- Lifting with the legs, which turns it into a poor o-goshi | A gap between your hip and their belly | Turning in with no pull, so they're still flat-footed | Bending forward at the waist instead of twisting
x They step around in front of your hip: sweep the stepping leg and it becomes harai-goshi | They sag their hips and push their belly forward: ushiro-goshi or utsuri-goshi | They step behind your hip and sit down: tani-otoshi
v o-goshi, harai-goshi, koshi-guruma, tsuri-goshi, utsuri-goshi, ushiro-goshi
n Kano's own favorite throw and the first of the hip set in Nage-no-kata. Without a gi, hug the waist and grip the wrist or triceps; it works the same.
b hip-throw

@ o-goshi | O-goshi
f hip-throws
k takedown
p standing
s judo
g both
l white
kanji 大腰
en Major hip throw
c nage/koshi
gk 1
kz front
ijf legal
ng works
a Major hip throw | Big hip throw | Hip throw | Full hip throw | Hip toss
= Wrap an arm around their waist, turn in with your hips lower than theirs and all the way across, then lift them with your legs and roll them over your hip.
1 j-grip | Your left hand grips their right sleeve. Your right hand starts on their lapel or collar.
2 j-pull | Pull the sleeve forward and up so their weight comes onto their toes.
3 j-turn-in | Step your right foot in front of their right foot and turn, swinging your left foot back so your feet end up inside theirs. At the same time slide your right arm under their left arm and around their waist.
4 j-hip-throw | Bend your knees so your belt is below theirs and pull them tight against your back. Your hips go all the way across, past the middle of their body.
5 j-hip-throw | Straighten your legs to lift them off the mat, then bend forward and turn to your left, pulling the sleeve down to your left hip. They roll over your right hip.
6 j-landed | Keep the sleeve as they land and stay on your feet, ready to follow to a pin.
+ Hips lower than theirs before you lift | Hips all the way across; halfway is uki-goshi | Lift with your legs, then turn and bend: in that order | Hug them tight to your back with no gap | Pull the sleeve the whole way through
- Turning in with straight legs, so there's nothing to lift with | Hips too short, so they slide off the side | Wrapping the neck instead of the waist (that's koshi-guruma, and easier to counter) | Turning in with no pull, so they just sit back
x They drop their hips and push their belly forward: ushiro-goshi or utsuri-goshi | They step behind your hip and sit down: tani-otoshi | They block your hip with their free hand: switch to o-uchi-gari or ko-uchi-gari | No-gi: turn in without control of their arm and they take your back
v uki-goshi, koshi-guruma, tsuri-goshi, tsurikomi-goshi, harai-goshi, seoi-nage, ushiro-goshi, utsuri-goshi
n The first hip throw in judo and a staple of self-defense jiu-jitsu. Without a gi, grab the wrist or triceps instead of the sleeve and hug the waist with an underhook; nothing else changes.
b hip-throw

@ koshi-guruma | Koshi-guruma
f hip-throws
k takedown
p standing
s judo
g both
l blue
kanji 腰車
en Hip wheel
c nage/koshi
gk 2
kz front
ijf legal
ng works
a Hip wheel | Headlock hip throw | Headlock throw | Hip toss with a headlock
= Wrap their neck instead of their waist, slide your hips farther across than for o-goshi, and wheel them over your hip by pulling the head down and around.
1 j-grip | Your left hand grips their right sleeve, your right hand their lapel or collar.
2 j-pull | Pull the sleeve forward and up so they lean onto their toes, head out over their feet.
3 j-turn-in | Step in and turn, feet inside theirs, and wrap your right arm around the back of their neck, your armpit against the side of their head.
4 j-hip-throw | Drop your hips below theirs and slide them farther across than for o-goshi, until your right hip sticks out past their right hip.
5 j-hip-throw | Pull their head down and around with your neck arm, pull the sleeve to your left hip and bend forward. They wheel over your hip, legs flying over the top.
6 j-landed | Keep the sleeve as they land. In jiu-jitsu, keep the head too and you're straight into kesa-gatame.
+ Hips deep, past their far hip: that's what makes it a wheel | Pull the sleeve; the neck arm alone won't throw them | Neck arm hugs tight, armpit against their ear | Bend forward and turn your head the way they're going
- Wrapping the neck with your hips still beside them: they step behind you and take your back | Squeezing the neck like a choke instead of throwing | Hips too high | Letting go of the sleeve, so you fall on top of them
x They step behind your hip: ushiro-goshi, ura-nage or a back take | They pull their head out and square up: o-uchi-gari or ko-uchi-gari | In jiu-jitsu a missed headlock throw often ends with them on your back, so commit or don't start it
v o-goshi, uki-goshi, harai-goshi, ippon-seoi-nage, ura-nage, ushiro-goshi
n No drawing of the neck wrap yet; the hip-throw drawing shows the finish. Wrestlers call the same move a headlock or a hip toss. Without a gi, grip the wrist or triceps instead of the sleeve.
b hip-throw

@ tsurikomi-goshi | Tsurikomi-goshi
f tsurikomi
k takedown
p standing
s judo
g both
l blue
kanji 釣込腰
en Lift-pull hip throw
c nage/koshi
gk 2
kz front
ijf legal
ng adapt
a Lift-pull hip throw | Lifting-pulling hip throw | Drawing hip throw | O-tsurikomi-goshi | Ko-tsurikomi-goshi
= Lift with the lapel hand and pull with the sleeve hand so they rise onto their toes, then drop your hips well under theirs and throw them over your hips without wrapping them up.
1 j-grip | Sleeve and lapel: your left hand on their right sleeve, your right hand on their left lapel at chest height.
2 j-pull | Lift up and forward with the lapel hand, like reeling in a fish, while the sleeve hand pulls forward and up. They rise onto their toes.
3 j-turn-in | Step in and turn, feet inside theirs, and drop your hips well below their belt. Your lapel hand stays bent, lifting up under their armpit and chest.
4 j-hip-throw | Slide your hips across past theirs so your back and hips are glued to their front.
5 j-hip-throw | Straighten your legs, lift the lapel up and over, pull the sleeve to your left hip and turn to your left. They roll over your hips.
6 j-landed | Keep the sleeve as they land.
+ "Tsuri" is lifting like a fishing rod: the lapel hand lifts before and during the turn | Hips far below theirs; tall people have to bend their knees a lot | Lapel elbow bent and close, lifting, not pushing them away | Turn your head toward your sleeve hand
- Hips too high, so it's a weak o-goshi with no arm around them | Lapel elbow flaring out, so there's no lift | Turning in before they're up on their toes | Pushing with the lapel hand instead of lifting
x They sag their hips and lean back: ushiro-goshi, or switch to o-uchi-gari | They step behind your hip and sit down: tani-otoshi or ura-nage | They break the lapel grip before you can turn in
v sode-tsurikomi-goshi, o-goshi, tsuri-goshi, seoi-nage, harai-goshi, sasae-tsurikomi-ashi
n The last of the three hip throws in Nage-no-kata. Two versions: o-tsurikomi-goshi lifts them high, ko-tsurikomi-goshi drops your hips almost to your knees. Without a gi, grip behind the neck or the triceps instead of the lapel.

@ sode-tsurikomi-goshi | Sode-tsurikomi-goshi
f tsurikomi
k takedown
p standing
s judo
g gi
l purple
kanji 袖釣込腰
en Sleeve lift-pull hip throw
c nage/koshi
gk shin
kz front
ijf legal
ng adapt
a Sleeve lift-pull hip throw | Sleeve hip throw | Sode | Drop sode
= Hold both sleeves, drive one of their arms straight up toward the ceiling, turn in low under it and throw them over your hips.
1 j-grip | Grip both sleeves: your left hand on their right sleeve, your right hand on their left sleeve just below the elbow.
2 j-pull | Drive their left sleeve straight up, elbow toward the ceiling, while your left hand pulls their right sleeve forward. They rise onto their toes.
3 j-turn-in | Turn in under the lifted arm, feet inside theirs, hips dropping lower than theirs, your back to their chest.
4 j-seoi | Keep their left arm straight up beside your head and pull their right sleeve down toward your left hip. They're loaded on your back with no arm free to post.
5 j-hip-throw | Straighten your legs, bend forward and turn to your left, pushing the high arm up and over. They go over your hips.
6 j-landed | Keep the right sleeve as they land.
+ Push the sleeve straight up, not out to the side | Turn in fast, before they can pull the arm back down | Get very low: it's a favorite of shorter players | Good against someone who stiff-arms you or holds your collar high
- Lifting the arm but not turning in under it | Hips higher than theirs | Letting the lifted arm drop, so they wrap your head | Standing up straight as you turn
x They pull the lifted arm down and clamp it to their side | They sag their hips and step around: ura-nage or a back take | Grip fighting: they never let you hold both sleeves
v tsurikomi-goshi, seoi-nage, ippon-seoi-nage, seoi-otoshi, o-goshi
n A Kodokan Shinmeisho technique (1982). In competition it's often done dropping onto the knees. No drawing of the lifted arm yet; the seoi and hip-throw drawings show the load and the finish. Without a gi a wrist grip can do it, but the wrist slips.

@ harai-goshi | Harai-goshi
f hip-sweeps
k takedown
p standing
s judo
g both
l blue
kanji 払腰
en Sweeping hip throw
c nage/koshi
gk 2
kz front-corner
ijf legal
ng adapt
a Sweeping hip throw | Sweeping hip | Hip sweep | Sweeping loin
= Pull them onto their right front corner, turn your hip against theirs and sweep their thigh away with your straight leg so they spin over your hip.
1 j-grip | Sleeve and lapel, or sleeve and a grip over their back or shoulder.
2 j-pull | Pull the sleeve up and toward their right front corner so their weight goes onto their right toes.
3 j-turn-in | Step in and turn on your left foot, putting your right hip and side tight against the front of their body. You're side-on, not as deep as o-goshi.
4 j-harai | Sweep your straight right leg back against the front of their right thigh, high up near the hip, while you pull the sleeve around and down and turn your head to the left.
5 j-landed | They spin over your hip and leg and land in front of you. Keep the sleeve.
+ Their weight must be on the leg you sweep | Body tight to theirs before the leg moves | Sweep high on their thigh with the back of your thigh, leg straight, toes pointed | The hands start the throw, the leg finishes it
- Sweeping too low, at the knee or shin | A gap between your hip and theirs | Leaning back or standing up straight on the support leg | Sweeping before they're up on their toes
x Harai-goshi-gaeshi: they reap your standing leg from behind as you sweep | They step over or around the sweeping leg: tani-otoshi or ushiro-goshi | They sag their hips and block with a hand on your hip
v uchi-mata, hane-goshi, uki-goshi, o-goshi, tai-otoshi, yama-arashi, harai-makikomi, harai-goshi-gaeshi
n The middle throw of the hip set in Nage-no-kata. The story goes that Kano added the leg sweep to uki-goshi when his partners learned to step around his hip. Without a gi, use an overhook or a grip over the back instead of the lapel.

@ tsuri-goshi | Tsuri-goshi
f hip-throws
k takedown
p standing
s judo
g gi
l blue
kanji 釣腰
en Lifting hip throw
c nage/koshi
gk 3
kz front
ijf legal
ng gi
a Lifting hip throw | Belt hip throw | O-tsuri-goshi | Ko-tsuri-goshi
= Grab their belt behind their back, lift them by it onto their toes, turn in low and throw them over your hips as in o-goshi.
1 j-grip | Your left hand grips their right sleeve. Reach your right arm over their left arm and grab their belt at the back (o-tsuri-goshi), or go under the arm (ko-tsuri-goshi).
2 j-pull | Pull up on the belt and forward on the sleeve, lifting them like a fish on a line, so they rise onto their toes.
3 j-turn-in | Turn in fast, feet inside theirs, hips dropped well below their belt and across in front of them.
4 j-hip-throw | Keep lifting with the belt hand, straighten your legs and turn to your left as you pull the sleeve down to your hip. They roll over your hips.
5 j-landed | Keep the sleeve as they land.
+ The belt hand lifts; it doesn't just hold on | Hips lower than their belt | Turn in as soon as you have the belt, before they break it or turn their hips away | Keep the sleeve pulling all the way through
- Holding the belt and waiting | Hips too high, so you're lifting with your arm alone | Bending forward with straight legs | Belt grip too far round their side, so you can't turn in
x They sag their hips and lean back: ushiro-goshi or utsuri-goshi | They break the belt grip or post a hand on your hip | They step behind your hip and sit down: tani-otoshi
v o-goshi, uki-goshi, tsurikomi-goshi, obi-otoshi, ushiro-goshi, utsuri-goshi
n Two versions: o-tsuri-goshi (big) reaches over their arm to the belt, ko-tsuri-goshi (small) goes under it. Without a gi there's no belt: hug the waist and it becomes o-goshi.

@ hane-goshi | Hane-goshi
f hip-sweeps
k takedown
p standing
s judo
g both
l purple
kanji 跳腰
en Spring hip throw
c nage/koshi
gk 3
kz front-corner
ijf legal
ng adapt
a Spring hip throw | Springing hip | Spring hip
= Turn your hip against theirs, bend your leg against the inside of their leg and spring them up and over with your hip and leg together.
1 j-grip | Sleeve and lapel, or sleeve and a high collar grip.
2 j-pull | Pull the sleeve up and toward their right front corner so they lean onto their right toes.
3 j-turn-in | Step in and turn on your left foot, your right hip and side tight against the front of their body, leaning slightly forward.
4 j-harai | Lift your bent right leg so the outside of your knee and shin press against the inside of their right leg, around their knee. Your knee stays bent and your foot hangs down.
5 j-harai | Spring them up with the bent leg and your hip at the same moment, pulling the sleeve down and around and turning your head to the left. They're lifted and wheeled over your hip.
6 j-landed | Keep the sleeve as they land.
+ The leg is a bent spring, not a straight sweep | Hip and leg lift together | Stay glued to them from chest to knee | Pull them onto the front corner first
- Straightening the leg (that's harai-goshi) | Kicking into space with no contact | Leaning back on the support leg | Turning in too deep, so your leg can't get across
x Hane-goshi-gaeshi: they catch your springing leg and sweep your standing leg | They sag their hips and lean back: ushiro-goshi or utsuri-goshi | They step around your hip
v harai-goshi, uchi-mata, o-goshi, hane-makikomi, hane-goshi-gaeshi
n No drawing of the bent spring leg yet; the harai drawing (a straight-leg sweep) is the closest. Hane-goshi sits between harai-goshi and uchi-mata. Without a gi, use an overhook or a grip over the back.

@ utsuri-goshi | Utsuri-goshi
f hip-counters
k takedown
p standing
s judo
g both
l brown
kanji 移腰
en Shifting hip throw
c nage/koshi
gk 4
kz back
ijf legal
ng works
a Shifting hip throw | Changing hip throw | Hip shift | Hip switch
= When they turn in for a hip throw, hug their waist, lift them off the mat with your hips and, while they're in the air, switch your hip in front of them and throw them over it.
1 j-grip | Normal grips. Wait for them to turn their back to you for a right-handed hip throw, especially a slow or shallow one.
2 j-turn-in ! | As they turn in, sag your hips lower than theirs so their throw stalls on your belly.
3 body-lock | Hug their waist tight with your left arm (or grab their belt at the back), belly pressed into their lower back.
4 j-lift | Thrust your belly forward and up and straighten your legs, lifting them off the mat so their legs swing up in front of them.
5 j-hip-throw | While they're in the air, step your left foot forward and swing your left hip in front of them, under their hips, so they come down across your hip instead of on their feet. Bend forward and turn, and they roll over it.
6 j-landed | They land on their back in front of you. Follow to a pin.
+ Hips below theirs first, or you can't lift them | Lift with a hip bump and your legs, never your back | Switch your hip while their feet are still off the mat | Best against a hip throw that comes in short or with no kuzushi
- Bending your back to lift | Switching too late, after their feet are back down | Letting the waist hug go slack, so they slide down and finish their throw | Standing too far away to get your hip under them
x They break your balance properly before turning in, so you can't get behind their hips | They hook a leg around yours as you lift | They turn back to face you before you lock the waist
v ushiro-goshi, o-goshi, uki-goshi, tsuri-goshi, harai-goshi, hane-goshi, ura-nage, sukui-nage
n No drawing of the hip switch in the air yet; the hip-throw drawing shows the finish. It works the same without a gi: a waist hug and a hip throw, and a good answer when someone turns their back on you in a clinch.

@ ushiro-goshi | Ushiro-goshi
f hip-counters
k takedown
p standing
s judo
g both
l purple
kanji 後腰
en Rear hip throw
c nage/koshi
gk 5
kz back
ijf legal
ng works
a Rear hip throw | Back hip throw | Back lift | Rear waist lift
= When they turn in for a hip throw, hug their waist from behind, pop them straight up with your hips and drop them flat on their back in front of you.
1 j-grip | Normal grips. Wait for them to turn in for a right-handed hip throw.
2 j-turn-in ! | As they turn their back to you, sag your hips lower than theirs so their throw stalls on you.
3 body-lock | Hug their waist tight with your left arm (or both arms), belly pressed into their lower back.
4 j-lift | Bend your knees, then snap your hips forward and up as you straighten your legs, so their feet leave the mat.
5 j-lift | At the top, pull your hips back and bend your knees so they drop straight down, back first, in front of you. Steer them with your arms so they land flat.
6 j-landed | They land on their back at your feet. Follow straight into a pin.
+ Hips lower than theirs before you lift | Lift with a hip bump and your legs, not your back | Drop them on their back, never on their head or neck | Catch them while they're still turning in
- Lifting with your back bent, or with straight legs | Lifting them and then walking around with them | Dropping them onto their head | Waiting until their throw is already working
x They hook a leg around yours as you lift | They break your balance properly before turning in, so you can't get behind their hips | They bend forward and sink their weight before the lift
v utsuri-goshi, ura-nage, sukui-nage, obi-otoshi, o-goshi, koshi-guruma
n In jiu-jitsu, put them down under control: lifting someone and driving them into the mat is a slam, a disqualification almost everywhere (see the rules). It works the same without a gi.

@family osae-kesa | Kesa-gatame family | Scarf holds: you sit beside them, hip to their ribs, and wrap the head or the arm. The basic version, the broken (kuzure) version and the reverse one that faces their legs.
@family osae-shiho | Shiho-gatame family | The four-quarter holds: you lie chest to chest and cover them from the head (kami), the side (yoko) or on top (tate).
@family osae-other | Other Kodokan pins | Holds outside the two big families: the shoulder hold, the floating hold and the back hold.

@ kesa-gatame | Kesa-gatame
f osae-kesa
k transition
p side-control
s judo
g both
l white
kanji 袈裟固
en Scarf hold
c katame/osaekomi
gk katame
ijf legal
ng works
a Scarf hold | Kesa | Head-and-arm scarf hold | Kesa gatame | Headlock side control
= Sit beside them facing their head, your hip jammed into their ribs, one arm around their neck and their near arm trapped under your armpit.
1 side-control | From the side, catch their near arm by the sleeve or the triceps and pull it across your body.
2 kesa | Clamp that arm tight under your armpit and sit your hip into their ribs, facing their head.
3 kesa | Wrap your other arm around their neck and grab your own pants, gi or wrist under the head. Pull the head up off the mat.
4 kesa | Shoot your bottom leg forward and your top leg back, wide like a tripod, your front knee bent up close to their shoulder.
5 kesa | Sag your weight onto their chest through your ribs, not your hips. Move your hips and legs with them as they try to bridge and turn.
+ Their arm clamped high in your armpit, almost to the shoulder | Your hip in their ribs: no space between you | Legs wide: front leg forward, back leg back | Head low and close to theirs so they can't roll you over the top | Lift their head off the mat: it kills the bridge
- Sitting up straight with your weight on your hip, so they bridge you over | Legs together, so you have no base | Letting the trapped arm slide out of your armpit | Leaning too far over their head
x Pull your trapped arm free, then turn in to your knees | Bridge into them and roll them over your chest | Hook their front leg with your leg and work to half guard | Push their head away with your free hand and back-step out
v kuzure-kesa-gatame, ushiro-kesa-gatame, yoko-shiho-gatame, kata-gatame
b armlock-kesa-thigh, armlock-kesa-legs
n In jiu-jitsu this is "kesa gatame" or headlock side control. Wrestlers know the same grip as a headlock. Without a gi, grab your own wrist or thigh under the head.

@ kuzure-kesa-gatame | Kuzure-kesa-gatame
f osae-kesa
k transition
p side-control
s judo
g both
l white
kanji 崩袈裟固
en Modified scarf hold
c katame/osaekomi
gk katame
ijf legal
ng works
a Modified scarf hold | Broken scarf hold | Underhook kesa | Kesa with the underhook | Kuzure kesa
= Kesa-gatame without wrapping the neck: your arm goes under their far armpit instead (or posts on the mat), so it's harder for them to roll you over the head.
1 side-control | From the side, trap their near arm under your armpit the same way as kesa-gatame.
2 kesa | Sit your hip into their ribs, facing their head.
3 kesa | Instead of going around the neck, slide your other arm under their far armpit and grip the back of their collar, or post the palm on the mat above their shoulder.
4 kesa | Spread your legs wide, front leg forward, back leg back, and lower your chest onto theirs.
5 kesa | Drive your shoulder into their jaw and chest. When they bridge, follow with your hips and post the hand to stop the roll.
+ The underhook (or the posted hand) blocks the roll over your head that beats basic kesa | Arm clamped in your armpit | Legs wide and your weight on their chest | Shoulder pressure into the face keeps them looking away
- Leaving the head free and letting them turn in to you | Weight sitting on your hip, not on their chest | Letting the far arm come back under your armpit
x Pull the trapped arm free and turn in | Bridge and roll toward your head end | Hook a leg for half guard
v kesa-gatame, ushiro-kesa-gatame, kata-gatame, yoko-shiho-gatame
b armlock-kesa-legs, armlock-kesa-thigh
n This is the scarf hold most judoka actually use in randori: the true kesa grip around the head is easy to roll out of. Many jiu-jitsu gyms just call it kesa gatame or "underhook kesa."

@ ushiro-kesa-gatame | Ushiro-kesa-gatame
f osae-kesa
k transition
p side-control
s judo
g both
l blue
kanji 後袈裟固
en Reverse scarf hold
c katame/osaekomi
gk katame
ijf legal
ng works
a Reverse scarf hold | Reverse kesa | Reverse kesa gatame | Backward scarf hold
= Sit beside their shoulder facing their legs instead of their head, your hip against their armpit, trapping their near arm and reaching across their body to grab the belt or far side.
1 side-control | From side control, switch your hips: turn to face their legs, your hip against their near armpit.
2 kesa ~ | Sit your hip down beside their shoulder, facing their feet. Your bottom leg goes forward toward their hips, your top leg back.
3 kesa ~ | Trap their near arm under your armpit or over your thigh, and reach across with your other hand to grab their belt or the far side of their gi or hip.
4 kesa ~ | Lower your weight onto their chest and keep your legs wide. Follow them with your hips if they bridge toward you.
+ Your weight across their chest and shoulder, not sitting on the mat | Near arm trapped so they can't frame | Legs wide | Good transition from kesa when they turn in, and into kimura or armlocks on the near arm
- Sitting too far down by their belly, so they bridge you off | Leaving the near arm free to frame on your hip | Legs together
x Get the near arm out and turn toward the attacker | Bridge and shrimp away to recover guard | Grab the back of their belt and roll them over
v kesa-gatame, kuzure-kesa-gatame, kami-shiho-gatame, ura-gatame
b kimura-side-control, armlock-kesa-legs
n The Kodokan added this hold to its official list in 2017. The drawing shows ordinary kesa-gatame; picture the person on top turned around to face the feet.

@ kata-gatame | Kata-gatame
f osae-other
k transition
p side-control
s judo
g both
l white
kanji 肩固
en Shoulder hold
c katame/osaekomi
gk katame
ijf legal
ng works
a Shoulder hold | Arm triangle position | Head and arm pin | Kata gatame | Arm-in headlock
= From the side, push their near arm across their face and wrap it and their head together with your arms, your head pinning the arm in place.
1 side-control | From side control or after kesa-gatame, push their near elbow up and across so their arm crosses their own face.
2 arm-triangle | Drop your head down beside their arm, pinning it against their neck with your head and shoulder.
3 arm-triangle | Wrap your arm under their neck and clasp your hands palm to palm over their arm.
4 arm-triangle | Spread your legs wide or kneel with your near knee in their ribs and your far leg stretched back. Drive your weight through your shoulder.
5 arm-triangle | To hold, keep the shoulder pressure. To finish, step around toward their head side and squeeze: it becomes the arm-triangle choke.
+ Their arm pinned against their neck by your head | Hands clasped tight, palm to palm | Knee in their ribs, the other leg out for base | Shoulder pressure on the arm side of their face
- Leaving space between your head and their arm, so the arm pulls back | Staying on your knees close together, so they roll you | Squeezing too early before the position is tight
x Turn in to your attacker and push their head away from the trapped arm before the hands lock | Get the trapped elbow back down to the hip | Bridge and roll toward the trapped arm side
v kesa-gatame, kuzure-kesa-gatame, yoko-shiho-gatame
b arm-triangle-side, arm-triangle-mount
n Judo scores it as a pin, but it's also a strangle if you squeeze, so judoka often win with it either way. Jiu-jitsu calls the finish the arm-triangle (or kata-gatame) choke.

@ kami-shiho-gatame | Kami-shiho-gatame
f osae-shiho
k transition
p north-south
s judo
g both
l white
kanji 上四方固
en Upper four-quarter hold
c katame/osaekomi
gk katame
ijf legal
ng adapt
a Upper four-quarter hold | North-south | North-south pin | Kami shiho | Four-corner hold from the head
= Come in from their head, chest on chest, slide both arms under their shoulders and grab their belt at the sides, and press them flat.
1 side-control | From side control, walk around past their head, keeping your chest on theirs the whole way.
2 north-south | Lie on them from above the head, your chest on their chest and your stomach over their face.
3 north-south | Reach both arms around the outside of their arms and under their shoulders, and grab their belt on both sides (or their lats without a gi).
4 north-south | Clamp their arms with your elbows tight to their sides. Knees bent and spread wide, or legs straight out with your toes digging in.
5 north-south | Sink your hips low and keep your weight on their chest. When they bridge, move your hips with them to stay square.
+ Elbows tight against their arms so they can't get them free | Hips low: no space under your belly | Knees wide for base | Head turned to one side, ear on their stomach
- Hips high in the air, so they turn you over | Gripping the belt with your arms wide and their elbows free | Staying square while they slide their hips to the side
x Get one elbow free and turn to your side to shrimp | Bridge and slide your hips out to one side to bring a leg back | Push on their head or shoulder and walk your feet around to turn in
v kuzure-kami-shiho-gatame, yoko-shiho-gatame, tate-shiho-gatame, ushiro-kesa-gatame
b north-south-choke, kimura-north-south
n Without a gi, grab their lats or your own wrists under their armpits. Jiu-jitsu calls this north-south.

@ kuzure-kami-shiho-gatame | Kuzure-kami-shiho-gatame
f osae-shiho
k transition
p north-south
s judo
g both
l white
kanji 崩上四方固
en Modified upper four-quarter hold
c katame/osaekomi
gk katame
ijf legal
ng adapt
a Modified upper four-quarter hold | Broken north-south | Kuzure kami shiho | Kimura-grip north-south
= A twisted version of kami-shiho: you come in from one corner, one arm under their far armpit to the collar and the other over their near arm to the belt, chest on chest.
1 side-control | From side control, trap their near arm by taking it under your armpit or over your shoulder.
2 north-south | Swing your hips toward their head so you lie diagonally across their chest, between side control and north-south.
3 north-south | Wrap your near arm under their trapped arm and grab the back of their collar. Your other arm goes under their far shoulder to grab their belt.
4 north-south | Sprawl your legs wide and low, and keep your chest heavy on theirs. Turn with them when they try to escape.
+ The trapped near arm takes away their best frame | Diagonal angle: harder to roll than straight north-south | Hips low and legs wide | The kimura is often right there on the trapped arm
- Coming in square from the head, which is just kami-shiho done badly | Hips high | Letting the near arm out
x Free the trapped arm and turn into the hold | Bridge and turn toward the side you're facing | Shrimp out and recover guard
v kami-shiho-gatame, yoko-shiho-gatame, kesa-gatame
b kimura-north-south, north-south-choke
n The most common form of kami-shiho in competition, because it's both stronger and easier to get into from side control.

@ yoko-shiho-gatame | Yoko-shiho-gatame
f osae-shiho
k transition
p side-control
s judo
g both
l white
kanji 横四方固
en Side four-quarter hold
c katame/osaekomi
gk katame
ijf legal
ng adapt
a Side four-quarter hold | Side control | Cross-side | Hundred kilos | Cem quilos | Side mount
= Lie across them at a right angle, chest on chest, one arm under their head grabbing the collar and the other between their legs grabbing the belt or pants.
1 side-control | Come to their side, chest on their chest, at a right angle to them.
2 side-control | Reach your head-side arm under their neck and grab their far collar, or grip your own wrist under their head.
3 side-control | Reach your other arm between their legs and grab their belt or their far pant leg.
4 side-control | Kneel with your knees tight against their side (one at the shoulder, one at the hip), or sprawl your legs back with your toes digging in.
5 side-control | Drive your chest and shoulder down. Keep your head low on their far side so they can't push it away.
+ Knees tight to their body: no space for a knee to come in | Chest heavy on their chest | Head on their far side | Switch between knees and sprawled legs as they try to escape
- Space under your hips, so a knee gets in | Head on the near side where they push it | Gripping the belt so they can't sit up but leaving their hip free to turn
x Frame on the neck and hip, shrimp and put a knee in | Turn in to your knees | Bridge, then shrimp back to half guard
v kami-shiho-gatame, tate-shiho-gatame, kesa-gatame, kata-gatame
b americana-side-control, kimura-side-control, armbar-side-control
n Jiu-jitsu's side control. Without a gi, the hand that went between the legs grips the far hip or the near thigh instead.

@ tate-shiho-gatame | Tate-shiho-gatame
f osae-shiho
k transition
p mount
s judo
g both
l white
kanji 縦四方固
en Vertical four-quarter hold
c katame/osaekomi
gk katame
ijf legal
ng works
a Vertical four-quarter hold | Mount | Full mount | Arm-in mount | Head and arm mount
= Sit on top of them, astride their body, and wrap one arm and their head together (or hold the collar), with your legs hooking their legs.
1 mount | Climb onto their stomach and sit astride, knees tight to their sides.
2 mount | Push one of their arms across their face, drop your head beside it and wrap your arm under their neck to trap the head and arm together.
3 mount | Hook your feet under their legs or pin your knees high up by their armpits, so they can't bridge you off.
4 mount | Keep your hips heavy and your head low. When they bridge, spread your free hand on the mat for base.
+ Feet hooked under their legs or knees high: low mount is harder to bridge | Head and arm trapped together | Your free hand posts when they bridge | Hips heavy, chest low
- Sitting up tall with no base, so the upa bridge rolls you | Knees wide open, so they shrimp out | Leaving the arm free to push your hip
x Upa: trap an arm and a foot on the same side, bridge and roll | Elbow-knee escape: frame on the hip, shrimp and put the knee back in | Push on the head-and-arm and turn toward the trapped side
v yoko-shiho-gatame, kata-gatame, kami-shiho-gatame
b armbar-mount, arm-triangle-mount, cross-collar-mount, ezekiel-gi-mount
n It's jiu-jitsu's mount. Judo scores the pin; jiu-jitsu scores 4 points for it and keeps attacking.

@ uki-gatame | Uki-gatame
f osae-other
k transition
p knee-on-belly
s judo
g both
l blue
kanji 浮固
en Floating hold
c katame/osaekomi
gk katame
ijf legal
ng works
a Floating hold | Uki gatame | Knee-on-arm pin
= From their side, pull their near arm across your chest and lean on them, one knee by their side and the other leg stretched wide, your hips floating off the mat.
1 side-control | From the side, catch their near arm and pull it up across your chest, wrist under your armpit.
2 knee-on-belly | Come up on your knee next to their ribs and post your other leg out wide and back.
3 knee-on-belly | Lean your chest over theirs, holding the trapped arm tight with both hands at the elbow.
4 knee-on-belly | Keep your hips up and mobile, so you can float with them when they turn. The trapped arm stops them turning in.
+ The trapped arm is the whole hold: never let go of it | Far leg wide for base | Weight on your chest, hips light | Ready to step over into juji-gatame if they push
- Loose grip on the arm, so they pull it out and turn in | Kneeling with both knees close together, so you get rolled | Sitting your hips down and losing mobility
x Pull the arm free and turn in to your knees | Bridge toward the attacker and roll them over the trapped arm | Shrimp away and put a knee in
v yoko-shiho-gatame, kesa-gatame, ude-hishigi-juji-gatame
b armbar-knee-on-belly, knee-on-belly-collar-choke
n Added to the Kodokan list in 2017. The drawing shows knee on belly; in uki-gatame the knee is beside their ribs and their arm is trapped in your armpit.

@ ura-gatame | Ura-gatame
f osae-other
k transition
p side-control
s judo
g both
l purple
kanji 裏固
en Back hold
c katame/osaekomi
gk katame
ijf legal
ng works
a Back hold | Rear hold | Ura gatame | Reverse back pin
= Lie on your back across their chest, perpendicular to them, using your back and shoulders to pin them while you control their near arm and leg.
1 side-control | From side control, or when they turn into you, trap their near arm under your arm.
2 kesa ~ | Turn your back toward them and lower it across their chest, hips beside their far side, facing up.
3 kesa ~ | Keep their near arm trapped against your body and hook their far leg or grab their belt with your other arm.
4 kesa ~ | Spread your legs wide on the mat and press your weight back into their chest. Walk your feet to stay perpendicular as they move.
+ Your back stays heavy across the chest, at a right angle | Near arm controlled the whole time | Legs wide for base | A quick hold to keep when a scramble leaves you facing up across them
- Lying parallel to them, so they roll you off | Letting go of the near arm | Feet close together
x Push the attacker's back up and turn into them | Bridge and roll them over your far side | Take the back if they stay too long
v ushiro-kesa-gatame, kesa-gatame, yoko-shiho-gatame
n Added to the Kodokan list in 2017 and rarely seen in jiu-jitsu, where giving your back like this is unusual. No pose shows it exactly: picture the person on top lying face up across the other's chest.

@family shime-juji | Cross strangles | The three judo cross-collar chokes: both hands in their collar, arms crossed, wrists cutting into the sides of the neck. They differ only in which way your palms face.
@family shime-rear | Strangles from behind | Chokes from the back: the naked choke, the sliding collar and the single wing.
@family shime-front | Strangles with the hands from the front | One- and two-hand collar chokes, the sleeve wheel and the thrust choke.
@family shime-legs | Strangles and squeezes with the legs | The leg triangle, and the trunk squeeze judo has banned.

@ nami-juji-jime | Nami-juji-jime
f shime-juji
k submission / choke
p closed-guard
s judo
g gi
l white
kanji 並十字絞
en Normal cross strangle
c katame/shime
gk katame
ijf legal
ng gi
a Normal cross strangle | Cross collar choke (thumbs in) | Thumbs-in cross choke | Palms-down cross choke | X-choke
= Both hands deep in their collar with your thumbs inside and your palms facing them (palms down, seen from mount), arms crossed, then flare your elbows out and down so your wrists cut into both sides of the neck.
1 closed-guard | From closed guard (or mount), break their posture down with your legs and open their collar with one hand.
2 closed-guard | Feed your first hand deep into the far side of their collar, thumb inside and fingers outside, palm facing them, knuckles reaching behind their neck.
3 guard-broken | Pull them down, then cross your second arm over the first and grab the other side of the collar the same way, thumb inside.
4 guard-broken | Pull your elbows out wide and down toward the mat, like rowing, while your legs pull them in. Your wrists turn in and cut into the sides of the neck.
+ First grip as deep as you can get it: knuckles behind the ear | Both thumbs inside, both palms facing them | Elbows go out and down, not just pulling | Keep their posture broken with your legs the whole time
- Shallow grips at the front of the throat | Pulling them up toward you instead of flaring the elbows | Letting them posture up once the first grip is in
x Posture up and keep your head high before the second hand gets in | Push the second elbow across so it can't cross | Stack and pass while their hands are busy
v gyaku-juji-jime, kata-juji-jime, okuri-eri-jime
b cross-collar-closed-guard, cross-collar-mount
n The three cross strangles only differ in the grips: nami-juji is both thumbs in, gyaku-juji both fingers in, kata-juji one of each. Works the same from mount and from guard.

@ gyaku-juji-jime | Gyaku-juji-jime
f shime-juji
k submission / choke
p mount
s judo
g gi
l white
kanji 逆十字絞
en Reverse cross strangle
c katame/shime
gk katame
ijf legal
ng gi
a Reverse cross strangle | Cross collar choke (palms up) | Fingers-in cross choke | Palms-up cross choke
= The cross choke with your four fingers inside the collar and your thumbs outside, palms facing you (palms up, seen from mount): arms crossed, drop your chest and flare the elbows.
1 mount | From mount (or guard), open their collar with one hand.
2 mount | Slide your first hand deep into the far collar with your four fingers inside and thumb outside, palm facing you.
3 mount | Cross the second arm under (or over) the first and grab the other collar the same way, fingers in.
4 mount | Drop your chest toward theirs, head to the side of theirs, and drive your elbows out. Your wrists squeeze the sides of the neck.
+ Deep first grip, knuckles behind the ear | Lower your chest and elbows to the mat as you squeeze | Head beside theirs (forehead on the mat) for base from mount | If they bridge and roll you, keep the grips and wrap your legs: the choke still works from guard
- Sitting up tall while you choke, so they upa you | Pulling up on the collar instead of cutting in with the wrists | A shallow second grip
x Tuck the chin and push the elbows across before the second grip | Bridge and roll toward the top arm when they lean forward | Frame on the hips and shrimp out
v nami-juji-jime, kata-juji-jime, tate-shiho-gatame
b cross-collar-closed-guard, cross-collar-mount
n The last strangle of Katame-no-kata: tori chokes from mount, uke bridges and rolls them over, and tori finishes from underneath with the legs wrapped. It's the cross choke most jiu-jitsu gyms teach first.

@ kata-juji-jime | Kata-juji-jime
f shime-juji
k submission / choke
p mount
s judo
g gi
l blue
kanji 片十字絞
en Half cross strangle
c katame/shime
gk katame
ijf legal
ng gi
a Half cross strangle | Half cross choke | Mixed-grip cross choke
= A cross choke with one hand fingers-in (palm facing you) and the other thumb-in (palm facing them): arms crossed, chest down, elbows out.
1 mount | From mount or guard, open their collar and sink your first hand deep into the far side, four fingers inside, palm facing you.
2 mount | Cross your second hand over the first and grab the other collar with your thumb inside, palm facing them.
3 mount | Drop your chest and head down beside theirs.
4 mount | Pull both elbows down and out. Your wrist and forearm close on both sides of the neck.
+ One grip each way is what makes it kata-juji; which hand goes first doesn't matter | The thumb-in second grip slips in easily over the top of the first arm | Deep first grip | Chest down, elbows out
- Shallow first grip | Sitting up while you squeeze | Crossing arms but pulling straight up
x Tuck the chin and block the second hand | Bridge as they lean forward | Shrimp out to guard
v nami-juji-jime, gyaku-juji-jime
b cross-collar-mount, knee-on-belly-collar-choke
n The first strangle of Katame-no-kata, done from mount. Many jiu-jitsu cross chokes are really this one, with one hand each way.

@ hadaka-jime | Hadaka-jime
f shime-rear
k submission / choke
p back
s judo
g both
l white
kanji 裸絞
en Naked strangle
c katame/shime
gk katame
ijf legal
ng works
a Naked strangle | Rear naked choke | RNC | Mata leão | Sleeper | Lion killer
= From behind, your forearm goes across their throat and you clasp your hands palm to palm on their far shoulder, then pull back with your head driving theirs forward.
1 back | From behind (seated, from the turtle or standing), get your chest on their back.
2 rnc | Slide your arm around their neck so your forearm (or the crook of your elbow) lies across their throat.
3 rnc | Clasp your hands palm to palm over their far shoulder, or lock a figure four with your other biceps.
4 rnc | Pull your clasped hands back toward your chest, press your head against the side of theirs and lean back.
+ No gi needed: "naked" means it uses no clothing | Head tight to theirs | Pull in toward your own chest | Hooks or a body triangle stop them escaping
- Choking across the jaw | Leaving space between your chest and their back | Lifting the elbows up
x Tuck the chin and pull the arm down with both hands | Turn your chin into the elbow | Slide your shoulders to the mat on the choking-arm side and turn in
v okuri-eri-jime, kata-ha-jime
b rnc-from-back, short-choke-back, arm-trap-rnc
n Katame-no-kata shows it with the forearm across the throat and the hands clasped palm to palm. Jiu-jitsu's rear naked choke (elbow under the chin, figure-four lock) is the same strangle and also counts as hadaka-jime, legal in judo.

@ okuri-eri-jime | Okuri-eri-jime
f shime-rear
k submission / choke
p back
s judo
g gi
l white
kanji 送襟絞
en Sliding collar strangle
c katame/shime
gk katame
ijf legal
ng gi
a Sliding collar strangle | Sliding collar choke | Sliding lapel choke | Collar choke from the back
= From behind, one hand reaches around and grips their far collar deep while the other hand, under their armpit, pulls their other lapel down, sliding the collar tight around the neck.
1 back | Get behind them with your chest on their back. Use your left hand to open their left collar and feed it up.
2 rnc | Reach your right hand around their throat and grab that left collar deep, thumb inside, as high as you can by the ear.
3 back | Slide your left hand under their left armpit and grab their right lapel low, near the belt.
4 rnc | Pull the lapel down while pulling your right elbow back, head tight to theirs. The collar closes around the neck like a noose.
+ Deep first grip, knuckles on the side of the neck | Feed the collar with the other hand | Pull the low lapel down, not out | From the turtle: roll them or turn them sideways before you finish
- Shallow grip at the front of the throat | Pulling only with the top hand | Space between you and their back
x Chin down and fight the top hand | Pull the choking wrist down with both hands | Turn in toward the choking arm's side
v hadaka-jime, kata-ha-jime, nami-juji-jime
b sliding-collar-choke, bow-and-arrow-choke, clock-choke
n Judoka use it a lot from the turtle: grip, then roll or "clock" around. The bow and arrow is the same collar grip with the other hand on their pants instead.

@ kata-ha-jime | Kata-ha-jime
f shime-rear
k submission / choke
p back
s judo
g gi
l blue
kanji 片羽絞
en Single wing strangle
c katame/shime
gk katame
ijf legal
ng gi
a Single wing strangle | Single wing choke | Single wing | Half wing choke
= From behind, one hand grabs their collar deep as in the sliding collar choke; the other arm lifts their arm up and behind their head and pushes the head forward into the choke.
1 back | From the back or the turtle, reach your right hand around their neck and grab their left collar deep, thumb inside.
2 rnc | Slide your left arm under their left armpit and lift that arm up high, out of the way.
3 rnc | Thread your left hand up behind their neck, palm on the back of their head (the "wing").
4 rnc | Pull your right elbow back and push their head forward and across with the wing hand.
5 back-flat | To tighten it, slide your body off to the side of the trapped arm and drive your weight down.
+ Lift their arm high before you thread the hand | Deep collar grip | Push the head across the collar, not just down | Get off to an angle instead of staying square behind them
- Not lifting the arm, so they keep a hand on your collar grip | Shallow grip | Pushing the head straight down into your own wrist
x Keep the elbow tight to your ribs so the wing can't get in | Fight the collar hand first | Turn toward the trapped arm and face the attacker
v okuri-eri-jime, hadaka-jime
b single-wing-choke, sliding-collar-choke
n Very common in judo from the turtle, and a top-percentage choke in gi jiu-jitsu.

@ kata-te-jime | Kata-te-jime
f shime-front
k submission / choke
p side-control
s judo
g gi
l blue
kanji 片手絞
en One-hand strangle
c katame/shime
gk katame
ijf legal
ng gi
a One-hand strangle | One-hand choke | One-handed collar choke
= One hand grips their opposite collar deep, thumb inside, and you drive the forearm or the blade of the wrist across their throat.
1 side-control | From side control, the turtle or their guard, open their collar with your free hand.
2 side-control | Sink one hand deep into their far collar, thumb inside, knuckles behind the ear.
3 side-control | Turn that hand so the bone of your forearm or wrist faces the side of their neck.
4 side-control | Drive the forearm across the throat with your body weight while the other hand pins their arm or pushes their head into the choke.
+ Deep grip, thumb inside | Use your weight behind the forearm, not just arm strength | The other hand blocks their defense or pushes the head | It works from almost any position where they give you their collar
- Shallow grip | Pushing straight down on the windpipe, which only hurts | Letting their near arm frame on your hip
x Tuck the chin and turn toward the gripping arm | Push the elbow across | Escape the position before the grip gets deep
v ryo-te-jime, tsukkomi-jime, nami-juji-jime
b bread-cutter-choke, paper-cutter-choke
n Kodokan descriptions vary. The idea is a single-hand collar choke, so any one-hand gi choke from side control or knee on belly fits this name.

@ ryo-te-jime | Ryo-te-jime
f shime-front
k submission / choke
p closed-guard
s judo
g gi
l blue
kanji 両手絞
en Two-hand strangle
c katame/shime
gk katame
ijf legal
ng gi
a Two-hand strangle | Two-hand choke | Uncrossed collar choke | Parallel collar choke
= Grab both of their collars, one with each hand, without crossing your arms, then twist your wrists in and pull your elbows down so your wrist bones press both sides of the neck.
1 closed-guard | From guard or mount, open both of their collars.
2 closed-guard | Grab their left collar with your right hand and their right collar with your left hand, thumbs inside, arms uncrossed, both deep by the neck.
3 guard-broken | Pull them down to break their posture.
4 guard-broken | Turn your wrists in so the thumb sides dig into the sides of their neck, and pull your elbows down and out.
+ Both grips deep | Twist the wrists: the bones do the work | Keep their posture broken | A fast choke when they posture with their hands busy
- Grips too low on the lapel | Pulling straight back with no twist | Leaving their posture up
x Posture up early and push the elbows in | Grab both wrists and pull them off | Pass while their hands are in your collar
v nami-juji-jime, kata-te-jime, tsukkomi-jime
b cross-collar-closed-guard
n Less common than the cross chokes but it surprises people who are only defending the cross grip.

@ sode-guruma-jime | Sode-guruma-jime
f shime-front
k submission / choke
p mount
s judo
g both
l blue
kanji 袖車絞
en Sleeve wheel strangle
c katame/shime
gk katame
ijf legal
ng adapt
a Sleeve wheel strangle | Ezekiel choke | Ezequiel | Sleeve choke | Ezekiel choke from mount
= One arm goes around their neck and grips your own other sleeve; the other hand slides across the front of the throat and the blade of the hand cuts in as you bring your fists together.
1 mount | From mount (or inside their guard, or behind them), lower your chest and put one arm behind their neck.
2 mount | With that hand, grab the inside of your other sleeve, near the cuff.
3 mount | Slide your other hand across the front of their throat, the blade (pinky side) of the hand against the neck.
4 mount | Pull the first arm toward you and push the blade of the second hand down. Your forearms close like scissors.
+ Grip your own sleeve on the inside, near the wrist | The blade of the hand, not the palm, goes across the throat | It works from inside their guard too | Without a gi, grip your own wrist or forearm instead of the sleeve
- Gripping too high up your sleeve, so the arms can't close | Pushing with the palm | Lifting your chest off them, giving them room to bridge
x Tuck the chin and turn into the arm behind your neck | Bridge and roll as they reach | Frame on the hips and shrimp out
v hadaka-jime, kata-te-jime, tate-shiho-gatame
b ezekiel-gi-mount, ezekiel-inside-guard, ezekiel-nogi-mount
n Named in jiu-jitsu after Ezequiel Paraguassu, a Brazilian Olympic judoka who used it often in Rio jiu-jitsu academies.

@ tsukkomi-jime | Tsukkomi-jime
f shime-front
k submission / choke
p mount
s judo
g gi
l purple
kanji 突込絞
en Thrust strangle
c katame/shime
gk katame
ijf legal
ng gi
a Thrust strangle | Thrust choke | Lapel thrust choke | Lapel push choke
= Grab their lapel, pull it across their neck and thrust your fist (holding the lapel) into the side of the throat while your other hand pulls the opposite lapel down.
1 mount | From mount, side control or the turtle, open their collar.
2 mount | Grab one lapel low with one hand and pull it up and across the front of their neck.
3 mount | Take the other lapel low with your other hand and pull it down.
4 mount | Thrust the fist holding the first lapel into the side of their neck with your weight behind it, while the second hand pulls down. The lapel tightens around the neck.
+ Pull the slack out of both lapels first | Thrust with your body weight, not just the arm | Knuckles drive into the side of the neck, not the windpipe | A sneaky finish from the turtle as well
- Leaving slack in the lapel | Pushing on the windpipe | Over-reaching from mount and getting rolled
x Chin down and strip the lapel grip | Bridge into the over-reaching arm | Turn in and keep the elbows inside
v kata-te-jime, ryo-te-jime, okuri-eri-jime
b bread-cutter-choke, paper-cutter-choke
n Kodokan books describe it in slightly different ways (with the attacker on top or from the turtle). It's one of the rarer judo strangles; jiu-jitsu's lapel chokes cover the same idea.

@ sankaku-jime | Sankaku-jime
f shime-legs
k submission / choke
p closed-guard
s judo
g both
l white
kanji 三角絞
en Triangle strangle
c katame/shime
gk katame
ijf legal
ng works
a Triangle strangle | Triangle choke | Triangle | Sankaku | Front triangle
= Your legs trap their head and one arm in a figure four: the shin across the back of the neck, the other knee bent over the foot, squeezing their own shoulder into the side of the neck.
1 closed-guard | From guard, push one of their arms down to their hip or behind you and keep the other arm in.
2 triangle | Shoot your leg on the free-arm side over their shoulder, the back of your knee across the back of their neck.
3 triangle | Grab your shin, cut an angle toward the trapped arm side and lock your other knee over that foot.
4 triangle | Pull their head down, pinch your knees together and lift your hips. The trapped shoulder and your thigh crush both sides of the neck.
+ Cut an angle: your body almost perpendicular to theirs | Pull the trapped arm across their body | Pull the head down | Squeeze with your knees, lift the hips
- Locking it square (straight on), where it doesn't choke | Leaving both arms out or both in | Your shin on their throat instead of behind the neck
x Posture up and stack the attacker | Get the trapped arm back across their neck before the lock | Step over the top to pass and turn
v ude-hishigi-sankaku-gatame, do-jime
b triangle-closed-guard, mounted-triangle, back-triangle, reverse-triangle, sankaku-turnover
n Judoka also attack it from the turtle with the "sankaku turnover", which jiu-jitsu now uses too.

@ do-jime | Do-jime
f shime-legs
k submission / compression
p closed-guard
s judo
g both
l purple
kanji 胴絞
en Trunk strangle
c katame/shime
gk katame
ijf forbidden
ng works
a Trunk strangle | Body scissors | Body squeeze | Kidney squeeze | Body triangle squeeze
= Wrap your legs around their body, cross your ankles over their kidneys or ribs and squeeze. FORBIDDEN in judo: it's still on the Kodokan list but banned in all judo competition.
1 closed-guard | From guard, wrap your legs high around their trunk instead of around their waist.
2 closed-guard | Cross your ankles over their kidneys or lower ribs, or lock a figure four (a body triangle).
3 guard-broken | Pull them down with your arms so they can't posture up and take the pressure off.
4 guard-broken | Straighten your legs and arch your hips to squeeze their ribs and stomach together until they can't breathe.
+ It's forbidden in judo competition: train it only where the rules allow | Legs high on the trunk | Straighten the legs to squeeze | From behind, a body triangle squeezes better than crossed ankles
- Using it in a judo match (instant penalty) | Crossing your ankles where they can footlock you | Holding it while you could be attacking something better
x Post your elbows on their thighs and keep your back straight | Open the legs and pass | Footlock the crossed ankles
v sankaku-jime, hadaka-jime
n Forbidden in judo. In jiu-jitsu a body triangle is a strong control from the back and the squeeze can make people tap, but some rulesets ban squeezing the kidneys or ribs with the feet crossed, at least for kids and teens, so check the event's own rules.

@family back-sacrifices | Sacrifices to the back | Ma-sutemi-waza: you fall straight onto your back on purpose and use your fall, your hands and usually a foot or shin under them to throw them over your head or shoulder. The closest judo comes to a jiu-jitsu sweep from the bottom.
@family side-drops | Side drops | Yoko-sutemi-waza where you drop onto your side next to or in front of them, block or take a leg, and let your falling weight pull them down to the side or over you.
@family makikomi | Wraparounds (makikomi) | You let go with one hand, clamp their arm tight under your armpit, turn in and fall forward, winding them around your body like a rope around a drum. You land on top of them, so the follow-up pin is built in.

@ tomoe-nage | Tomoe-nage
f back-sacrifices
k takedown
p standing
s judo
g both
l blue
kanji 巴投
en Circle throw
c nage/ma-sutemi
gk 3
kz front
ijf legal
ng adapt
a Circle throw | Stomach throw | Overhead throw | Monkey flip | Yoko-tomoe-nage (the side version)
= Pull them forward, sit down between their feet, put the sole of your foot on their belt line and kick them up and over your head while both hands pull them over.
1 j-grip | Sleeve and lapel, or both lapels. Push into them a little so they push back toward you.
2 j-pull | As they push forward, pull with both hands up and toward you so their weight comes onto their toes.
3 j-tomoe | Step your left foot deep between their feet and sit down close to your own heel, your seat right under them. At the same time put the sole of your right foot on their lower belly, just under the belt, knee bent.
4 j-tomoe | Roll onto your back, keep pulling both hands over your head and straighten the leg up and over. They somersault over your head and land on their back behind you.
5 mount | In judo, keep the sleeve. In jiu-jitsu, keep rolling backward with them and come up on top in mount.
+ Sit right under them, close to your heel; the deeper you sit, the easier it lifts | Foot on the belt line, not up on the chest | The hands throw as much as the leg: pull up and over your head the whole way | Only go when they are pushing into you or stepping forward
- Sitting down far away, so you just land in front of them on your back | Kicking with the foot too high, so they fall on your face or you push them away | Letting go with the hands as you roll | Doing it on a flat-footed, upright opponent with no forward pull
x They drop their hips and sit back: you are now in open guard, so work your sweeps | They step around your foot: pass attempt, so recover guard | They post a hand over your head: switch to the side (yoko-tomoe) and turn them to that side
v sumi-gaeshi, hikikomi-gaeshi, tawara-gaeshi, uki-waza, yoko-guruma
n In jiu-jitsu this is the standing version of the balloon sweep; done from the feet it counts as a sweep or takedown if you finish on top, and as a guard pull if you don't. Most modern judoka throw it to the side (yoko-tomoe): the foot goes on the hip and they fall diagonally over your shoulder. Without a gi, a collar tie and a wrist or an underhook work, but they slip off easily.
b balloon-sweep

@ sumi-gaeshi | Sumi-gaeshi
f back-sacrifices
k takedown
p standing
s judo
g both
l blue
kanji 隅返
en Corner reversal
c nage/ma-sutemi
gk 4
kz front-corner
ijf legal
ng works
a Corner reversal | Corner throw | Hook sacrifice | Butterfly hook throw | Standing hook sweep
= When they bend forward with their hips back, grab over their back or underhook, drop between their feet, put your instep inside their thigh and lift them over your head into the corner.
1 j-grip | Best against a bent-over, defensive opponent. Get your right hand over their back to the belt or an underhook, left hand on the sleeve.
2 j-pull | Pull them forward and down so their weight comes over their front corner and they push back up against you.
3 j-sumi | Step your left foot in between their feet and sit down right under them. Slide your right instep inside their left thigh, just above the knee, like a butterfly hook.
4 j-sumi | Roll straight back. Pull them over with both hands and lift with the hook. They go over your head and land on their back.
5 mount | Keep rolling with them and come up on top: mount or side control in jiu-jitsu, a pin in judo.
+ Your seat goes under their center, not out in front of them | Hook inside the thigh above the knee, toes pointed, and lift up, not out | Hands pull them over your head, the hook only steers | Works best when they are bent over and leaning on you
- Dropping too far away so there's nothing on the hook | Hooking the knee itself instead of the thigh | Letting their chest come off yours | Doing it when they are upright with their hips forward
x They sit their hips back and post: you're in butterfly guard, so sweep from there | They step over the hook to the side: come up on a single leg | They sprawl and drop their weight: take the arm drag or the back
v tomoe-nage, hikikomi-gaeshi, tawara-gaeshi, yoko-guruma, ura-nage
n The favorite sacrifice of the Russian and Georgian schools and the bridge between judo and jiu-jitsu: it's the butterfly sweep done from the feet. Without a gi it works off an underhook or a body lock and is common in no-gi and wrestling.
b butterfly-sweep

@ hikikomi-gaeshi | Hikikomi-gaeshi
f back-sacrifices
k takedown
p standing
s judo
g both
l purple
kanji 引込返
en Pulling-in reversal
c nage/ma-sutemi
gk hab
kz front
ijf legal
ng adapt
a Pulling-in reversal | Belt-over-the-back sacrifice | Drag-in reversal
= When they bend over and reach for you, grab their belt over the top of their back, pull them down onto you as you drop underneath, and lift them over your head with your shin inside their thigh.
1 j-grip | They lean in low, often reaching for your legs or belt. Reach your right arm over their left shoulder and grab the back of their belt. Left hand holds their right sleeve or arm.
2 snap-down | Pull them down and in toward you with the belt grip so their head and chest come over you.
3 j-sumi | Drop between their feet and sit down under them. Put your left shin or instep inside their right thigh.
4 j-sumi | Roll straight back, pull hard on the belt and the arm, and kick up with the leg. They flip over your head.
5 side-control | Follow them over and land on top across their chest.
+ The pull "in" is the whole throw: make them fall onto you first | Drop under them, not in front of them | Keep the belt grip tight to your own chest | Wait for them to bend forward; it doesn't work on an upright opponent
- Grabbing the belt and holding it too long (IJF wants an attack straight away from a belt grip) | Sitting down too early, before they lean in | Losing the arm grip, so they post and stop the roll
x They post the far hand on the mat: sit up into a front headlock | They drop to their knees: you can roll them with the belt grip into a back take | They straighten up: o-uchi-gari while their weight comes back
v sumi-gaeshi, tomoe-nage, tawara-gaeshi, obi-tori-gaeshi
n One of the throws dropped from the Gokyo in 1920 and restored by the Kodokan in 1982. It's sumi-gaeshi with the grip over the back instead of under the arm. Without a gi, an overhook across the back and a wrist grip take the place of the belt.
b butterfly-sweep

@ tawara-gaeshi | Tawara-gaeshi
f back-sacrifices
k takedown
p standing
s judo
g both
l purple
kanji 俵返
en Rice-bale reversal
c nage/ma-sutemi
gk hab
kz front
ijf legal
ng works
a Rice-bale reversal | Rice-bag throw | Sprawl roll | Counter to the double leg
= When they shoot in low for your legs, sprawl over their back, hug their body from above like lifting a bale of rice, and roll backward so they fly over your head.
1 double-leg ! | They shoot in low for a double leg or morote-gari.
2 snap-down | Sprawl your hips back so they can't drive. Get your chest on their back and wrap both arms around their body from above, hands locked under their belly or chest.
3 front-headlock | Keep the lock tight and hip in close so their body is pinned to yours, their head under your armpit.
4 j-tomoe | Sit down and roll straight back, lifting them with your arms. They go over the top of your head and land on their back.
5 north-south | Keep the hug and come up on top of them in north-south or side control.
+ It's a counter: wait for them to come in low | Lock your hands tight under their body; the hug carries them | Sit down close under them before you roll | Roll straight back over your shoulder line, not to the side
- Locking your hands too loosely, so they slide out | Sitting down too far away | Rolling when their hips are still under them and they can post
x They pull their head out as you sit: you are on your back, so come up into guard | They post a leg wide: roll to that side instead | They stand back up: keep the front headlock and snap down again
v tomoe-nage, sumi-gaeshi, hikikomi-gaeshi, morote-gari, kata-guruma
n Restored by the Kodokan in 1982 along with the other dropped throws. It's one of the best answers to a wrestler's double leg, gi or no-gi, and shows up in wrestling as the front-body-lock roll.

@ ura-nage | Ura-nage
f back-sacrifices
k takedown
p standing
s judo
g both
l purple
kanji 裏投
en Rear throw
c nage/ma-sutemi
gk 5
kz back
ijf legal
ng works
a Rear throw | Back throw | Back-arch throw | Judo suplex | Lift-and-arch counter
= When they turn in for a throw or step in close, hug their waist from the side and back, drop your hips under theirs, and arch backward so they fly over your shoulder.
1 j-turn-in ! | They turn in for a hip throw or seoi-nage, or step in close and square.
2 body-lock | Step your left foot behind them and wrap your left arm around the back of their waist. Put your right hand flat on their belly or belt. Bend your knees so your hips go under theirs.
3 j-uranage | Drive your hips up into them and arch backward, lifting with your left arm and pushing with your right hand. Look back over your left shoulder.
4 j-uranage | They go up and over your left shoulder. Fall back with them and turn as you land.
5 kesa | Twist so you land on top of them, not under them, and settle into kesa-gatame or side control.
+ Hips lower than theirs before you lift | Lift with the legs and the arch, not the arms | Turn your head over the throwing shoulder | Turn in the air so you land on top
- Lifting from straight legs, so you just hug them and fall over | Arching without getting your hips under them | Landing flat on your back with them on top of you
x They drop their weight and widen their stance: switch to ushiro-goshi or a back take | They turn into you and throw: keep the hug and switch hips for utsuri-goshi | They step past your hip: go to tani-otoshi
v ushiro-goshi, utsuri-goshi, sukui-nage, tani-otoshi, sumi-gaeshi
n Throw them onto their back or side. In jiu-jitsu a lift that drives their head or neck into the mat is a disqualification (the IBJJF bans "suplex" takedowns that land on the head), and so is a slam. In judo, landing on your own head or neck while doing it is dangerous; learn it from a coach.

@ yoko-otoshi | Yoko-otoshi
f side-drops
k takedown
p standing
s judo
g both
l purple
kanji 横落
en Side drop
c nage/yoko-sutemi
gk 3
kz side
ijf legal
ng adapt
a Side drop | Side sacrifice drop
= Draw them sideways so their weight is all on their right foot, slide your left leg past the outside of that foot and drop onto your side, pulling them down sideways over your leg.
1 j-grip | Sleeve and lapel. Move sideways so they shuffle with you.
2 j-pull | Pull them toward their right side so their weight settles on their right foot.
3 j-yoko | Slide your left leg straight out, deep past the outside of their right foot, and drop onto your left side right beside it.
4 j-yoko | Pull down with both hands as you land. With their foot blocked and nothing to step to, they fall sideways over your leg.
5 kesa | Turn toward them and take the pin.
+ Their weight must be on the foot you block | Drop close to them, right next to the foot | Pull down hard with both hands as you fall; your falling weight throws them | Leg straight and low along the mat
- Dropping too far away, so they just step over you | Dropping before they're off balance | Letting go of the sleeve, so they post on the mat
x They step over your leg: get up fast or pull guard | They lean the other way: switch to ko-soto-gari | They drop their weight: you are on the bottom, so recover guard
v uki-waza, yoko-gake, tani-otoshi, yoko-wakare, uki-otoshi
n The basic side sacrifice, and the one to learn before uki-waza and yoko-gake. Without a gi a wrist and an overhook steer them, but the pull is weaker.

@ tani-otoshi | Tani-otoshi
f side-drops
k takedown
p standing
s judo
g both
l blue
kanji 谷落
en Valley drop
c nage/yoko-sutemi
gk 4
kz back-corner
ijf legal
ng works
a Valley drop | Back drop | Leg-behind sacrifice
= When their weight goes back onto their heels, slide your leg deep behind both their heels, drop onto your side and pull them straight back into the "valley" behind them.
1 j-grip | Sleeve and lapel, or an overhook and a grip on the back. Often from a throw they've tried that stalled.
2 j-push | Push them back so their weight sits on their heels, or catch them as they straighten up after a throw.
3 j-yoko | Slide your left leg deep behind both their heels and drop onto your left side right behind them.
4 j-yoko | Drive your right hand back and down at their chest and pull the sleeve. With nothing behind their heels they fall straight back over your leg.
5 side-control | Turn onto them and pin.
+ Leg deep behind both heels | Drop right up against them, not a step away | Push back and down, not just down | Best as a counter: when they stall on a hip throw or straighten up from a bent-over stance
- Dropping next to them instead of behind | Falling away, so you land and they stay standing | Hitting it when their weight is forward
x They step back over your leg: come up quickly or pull guard | They turn in to you as you drop: you can end up under them, so keep the grip and recover guard | They drop their hips: switch to ko-soto-gake
v yoko-otoshi, ura-nage, ko-soto-gake, o-uchi-gari, uchi-mata-sukashi
n A classic counter to uchi-mata, harai-goshi and other turning throws, and to a stalled single leg in no-gi. Without a gi, an overhook or a body lock from the side work well.

@ hane-makikomi | Hane-makikomi
f makikomi
k takedown
p standing
s judo
g both
l purple
kanji 跳巻込
en Springing wraparound
c nage/yoko-sutemi
gk 4
kz front-corner
ijf legal
ng adapt
a Springing wraparound | Hane-goshi wraparound
= Start a hane-goshi, let go of the lapel and wrap their sleeve arm tight under your armpit, spring their leg up with your bent leg and roll forward so they wind around you.
1 j-grip | Sleeve and lapel. Pull the sleeve up and out to put them on their right front corner.
2 j-turn-in | Turn in for hane-goshi. As you turn, let go of the lapel and swing your right arm over their right arm, clamping it to your side.
3 j-makikomi | Spring their right leg up and out with your bent right leg, hip and thigh against theirs.
4 j-makikomi | Turn your head and body to your left and fall forward, winding them around your body. You land on top of them, chest to chest.
5 kesa | Keep the arm clamped and go straight into kesa-gatame.
+ Clamp the arm tight in your armpit before you fall | Their chest stuck to your back the whole way | Spring with the bent leg as you turn | Fall forward and turn, landing on them, not beside them
- Letting the arm slip out, so they land on top of you | Falling straight down instead of turning forward | Diving head first into the mat (never do this)
x They step around your hip: they can take your back, so turn in deeper or abandon | They drop their weight behind you: ura-nage or ushiro-goshi
v hane-goshi, soto-makikomi, harai-makikomi, uchi-mata-makikomi, o-soto-makikomi, uchi-makikomi
n Without a gi, an overhook on their arm replaces the sleeve and it works well. Makikomi throws put your full weight on them as they land; go easy in practice.

@ soto-makikomi | Soto-makikomi
f makikomi
k takedown
p standing
s judo
g both
l blue
kanji 外巻込
en Outer wraparound
c nage/yoko-sutemi
gk 4
kz front-corner
ijf legal
ng works
a Outer wraparound | Outside winding throw | Arm-wrap throw | Overhook throw
= Pull the sleeve, let go with your lapel hand, whip that arm over their arm, turn your back into them with their arm clamped under your armpit and roll forward to throw them around you.
1 j-grip | Sleeve and lapel. Pull the sleeve hard toward your left hip to bring them onto their right front corner.
2 j-pull | Keep pulling. Let go of the lapel and swing your right arm up and over their right arm.
3 j-turn-in | Turn your back to them and clamp their right arm tight under your right armpit. Put your right leg just outside their right leg to block it.
4 j-makikomi | Turn your head left and roll forward and down to your left, wrapping them around you. They go over your blocking leg.
5 kesa | Land on top of them with the arm still clamped and take kesa-gatame.
+ The arm clamp is the throw | Keep turning; it's a spin, not a dive | Block their right leg with your right leg | Land on them, not on the mat beside them
- Diving straight down onto your head | Letting their arm out so they land on you | Turning in without breaking their balance first
x They drop and spread their feet: switch to tani-otoshi | They pull their arm out: you're turned in with nothing, so stand back up
v hane-makikomi, harai-makikomi, o-soto-makikomi, uchi-makikomi, seoi-nage
n The easiest makikomi to learn and a strong no-gi throw off an overhook (it shows up in wrestling as a "headlock-style" arm throw). Learn to land on top without falling onto your head.

@ uchi-makikomi | Uchi-makikomi
f makikomi
k takedown
p standing
s judo
g both
l purple
kanji 内巻込
en Inner wraparound
c nage/yoko-sutemi
gk hab
kz front-corner
ijf legal
ng adapt
a Inner wraparound | Inside winding throw | Ippon-seoi wraparound
= Let go of the lapel, wrap their arm from the inside, under and up, clamping it like ippon-seoi-nage, turn in and roll forward to wind them over.
1 j-grip | Sleeve and lapel. Pull the sleeve up and out to load them onto their right front corner.
2 j-turn-in | Let go of the lapel and bring your right arm up under their right arm from the inside, clamping their upper arm at the elbow, like ippon-seoi-nage. Turn your back in.
3 j-makikomi | Feet inside theirs, hips low. Keep the arm clamped tight against your chest.
4 j-makikomi | Roll forward to your left and wind them over your back and shoulder. You land on top of them.
5 kesa | Keep the arm and pin.
+ Arm clamped from the inside, high under their armpit | Hips low before you roll | Keep turning so you land on top
- Clamping too low on the forearm, so the arm slides out | Falling straight down onto your knees and head
x They push their hips forward against your back: switch to ko-uchi-gari | They step around: ura-nage on you, so stay tight and stand back up
v soto-makikomi, ippon-seoi-nage, hane-makikomi, harai-makikomi, ko-uchi-makikomi
n Dropped from the Gokyo in 1920 and restored in 1982. "Inner" because your arm wraps theirs from the inside (soto-makikomi wraps it from the outside). Without a gi, the inside arm clamp works off an underhook to the arm.

@ uki-waza | Uki-waza
f side-drops
k takedown
p standing
s judo
g both
l purple
kanji 浮技
en Floating technique
c nage/yoko-sutemi
gk 5
kz front-corner
ijf legal
ng adapt
a Floating throw | Floating technique | Floating drop
= As they push or step toward you, drop onto your side, stretch your leg out wide to block their foot and pull them up and over you into their front corner.
1 j-grip | Sleeve and lapel. Step back so they come forward with their right foot.
2 j-pull | Pull them forward and up toward their right front corner, onto their toes.
3 j-yoko | Drop onto your left side and stretch your left leg out wide to your left so it blocks the outside of their right foot.
4 j-yoko | Pull them over your body with both hands as you fall. They float over in a wide arc and land on their back on your left.
5 kesa | Turn onto them and pin.
+ They must be coming toward you | Your leg is a wide block, not a sweep | Pull up first, then over; the throw is in the hands | Drop close and quickly so they can't stop the forward motion
- Dropping with no forward pull | Leg too short, so they just step over it | Letting go with one hand, so they post and stop
x They lean back or stop: you're on the mat under them, so recover guard | They step over the leg: come straight back up
v yoko-otoshi, tomoe-nage, sumi-otoshi, uki-otoshi, yoko-gake
n Not the same as yoko-otoshi: in yoko-otoshi they fall sideways over a leg next to their foot, in uki-waza they fly forward over a wide-blocking leg into their front corner. Without a gi, a collar tie and wrist give a weaker pull.

@ yoko-wakare | Yoko-wakare
f side-drops
k takedown
p standing
s judo
g both
l brown
kanji 横分
en Side separation
c nage/yoko-sutemi
gk 5
kz front
ijf legal
ng adapt
a Side separation | Side split | Body-drop sacrifice
= When they lean forward onto you, throw both your legs out across the front of their feet and drop onto your side, pulling them forward so they somersault over your body.
1 j-grip | Sleeve and lapel. They are pushing forward or bent forward against you.
2 j-pull | Pull them forward so their weight goes onto their toes.
3 j-yoko | Shoot both legs out across the front of their feet and drop onto your left side, your body lying across their path.
4 j-yoko | Pull down hard with both hands as you land. Their feet are blocked, so they tip forward over your body and roll onto their back.
5 j-landed | Keep the sleeve and come up on top to pin.
+ Only works when they are already falling forward onto you | Drop right in front of their feet, legs straight | Pull down and past you with both hands
- Dropping before they lean on you | Dropping a step away, so they simply stop | Letting go of the grips as you fall
x They sit back as you drop: you're on the mat in front of them, so recover guard | They step over your legs: get up fast
v yoko-otoshi, uki-waza, yoko-gake, yoko-guruma
n Mostly a counter to someone driving forward; in contests it's rare. Without a gi, a collar tie and overhook can supply the pull.

@ yoko-guruma | Yoko-guruma
f side-drops
k takedown
p standing
s judo
g both
l brown
kanji 横車
en Side wheel
c nage/yoko-sutemi
gk 5
kz front
ijf legal
ng works
a Side wheel | Side wheel throw | Wheel sacrifice
= When they bend forward to block your throw, hug their body from the side, slide your leg deep between their legs and drop onto your back, wheeling them over your shoulder sideways.
1 j-turn-in ! | Often a counter: they turn in for a hip throw or seoi-nage, or bend forward to block your ura-nage.
2 body-lock | Wrap one arm around their back to the belt and put the other hand on their belly, hugging their body from the side.
3 j-sumi | Slide your right leg deep between their legs, all the way through, and drop onto your back, turning toward them.
4 j-sumi | Twist and pull them over you. They wheel sideways over your left shoulder.
5 side-control | Roll after them and come up on top.
+ Their body must be bent forward | Slide the leg deep between their legs, not just in front | Turn as you fall so they wheel to the side
- Trying it on an upright opponent | Falling straight back, so they land on your chest | Losing the hug as you drop
x They sit straight down on you: you're under them, so recover half guard | They step back and straighten: stand up
v ura-nage, sumi-gaeshi, yoko-otoshi, tani-otoshi, ushiro-goshi
n The classic answer when your ura-nage fails because they bend forward. Without a gi a body lock or underhook-and-belly grip works fine.

@ yoko-gake | Yoko-gake
f side-drops
k takedown
p standing
s judo
g both
l brown
kanji 横掛
en Side body drop
c nage/yoko-sutemi
gk 5
kz side
ijf legal
ng adapt
a Side body drop | Side hook | Side sweep sacrifice
= Pull them onto the outside edge of their right foot, sweep that foot out from under them with your sole and drop onto your side at the same moment, so they fall sideways next to you.
1 j-grip | Sleeve and lapel. Pull them toward their right front corner so their weight comes onto the outside edge of their right foot.
2 j-pull | Keep the pull up and out so they lean over that foot.
3 j-deashi | Sweep their right foot out sideways with the sole of your left foot, like de-ashi-harai.
4 j-yoko | As the foot goes, drop onto your left side and pull them down with both hands. They fall flat on their side.
5 j-landed | Keep the sleeve and pin.
+ Sweep and drop at the same moment | Their weight must be on the edge of the foot you sweep | Pull down hard with both hands as you fall
- Sweeping first and dropping late, so they hop out | Dropping without a sweep, so they step over | Letting go of the sleeve
x They lift the foot over your sweep: you're on the mat, so recover guard | They step in toward you: go to yoko-otoshi
v yoko-otoshi, de-ashi-harai, uki-waza, yoko-wakare
n Think of it as a de-ashi-harai where you throw your own body down with it. Without a gi, a collar tie and wrist can steer them, but it's hard.

@ daki-wakare | Daki-wakare
f side-drops
k takedown
p turtle-top
s judo
g both
l brown
kanji 抱分
en High separation
c nage/yoko-sutemi
gk hab
kz side
ijf legal
ng works
a High separation | Turtle turnover throw | Hug-and-turn
= When they're crouched or turtled in front of you, reach over their back and hug their body from above, lift them, then fall back to the side and swing them over onto their back.
1 turtle | They crouch low or go to all fours in front of you. Stand or kneel at their head or near side.
2 front-headlock | Reach over their back and wrap both arms around their body, one arm under their chest and the other around their far side, locking your hands.
3 j-lift | Pull them up off the mat against your chest.
4 j-sumi | Fall back and twist to the side, swinging them over and past you so they land on their back.
5 side-control | Roll after them and pin.
+ Lock your hands tight under their body | Lift first, then fall and twist | Swing them past you, not on top of you
- Locking loosely, so they slide out | Falling with them still flat on the mat, so you just end up under them
x They post a hand wide: go to the other side | They sit out to a knee: switch to a front headlock or take the back
v tawara-gaeshi, sumi-gaeshi, yoko-guruma
n Dropped from the Gokyo in 1920 and restored in 1982. In jiu-jitsu it's like a gator roll turning a turtled opponent. The step drawings are the closest available (a turtle, front headlock, lift and back sacrifice). Without a gi it works the same.

@ o-soto-makikomi | O-soto-makikomi
f makikomi
k takedown
p standing
s judo
g both
l purple
kanji 大外巻込
en Major outer wraparound
c nage/yoko-sutemi
gk shin
kz back-corner
ijf legal
ng works
a Major outer wraparound | O-soto wraparound | Big outside reap wraparound
= Start an o-soto-gari, and when they hold it, let go of the lapel, wrap their arm under your armpit, turn and fall forward with your reaping leg still in, winding them down.
1 j-grip | Sleeve and lapel. Attack o-soto-gari: tip them back onto their right heel.
2 j-osoto | Step in and reap. They block it by bending their knee and leaning on you.
3 j-makikomi | Let go of the lapel, swing your right arm over their right arm and clamp it under your armpit. Keep your right leg reaping their right leg.
4 j-makikomi | Turn to your left and fall forward, winding them around your body, still driving the reaping leg back.
5 kesa | Land on top with the arm clamped and pin.
+ Clamp the arm before you turn | Keep the reaping leg through the whole fall | Turn forward and land on them
- Releasing the reap as you turn, so they step out | Falling backward instead of turning forward | Leaving the arm loose
x They drop their weight and pull back: you're under them, so get up or recover guard | O-soto-gaeshi as you reap: stay chest to chest
v o-soto-gari, soto-makikomi, hane-makikomi, harai-makikomi, o-soto-gaeshi
n Added to the Kodokan list as a Shinmeisho-no-waza. It turns a stalled o-soto-gari into a score. Without a gi, an overhook does the same job.

@ uchi-mata-makikomi | Uchi-mata-makikomi
f makikomi
k takedown
p standing
s judo
g both
l purple
kanji 内股巻込
en Inner-thigh wraparound
c nage/yoko-sutemi
gk shin
kz front-corner
ijf legal
ng adapt
a Inner-thigh wraparound | Uchi-mata wraparound
= Go in for uchi-mata, let go of the lapel and wrap their sleeve arm under your armpit, lift their inner thigh with your leg and roll forward so they wind over you.
1 j-grip | Sleeve and lapel. Pull the sleeve up and out to their right front corner.
2 j-uchimata | Turn in and lift the inside of their left thigh with the back of your right thigh, as for uchi-mata.
3 j-makikomi | If they stall, let go of the lapel and wrap your right arm over their right arm, clamping it under your armpit.
4 j-makikomi | Keep the leg lifting and roll forward and to your left. They wind over you and land on their back with you on top.
5 kesa | Pin with the arm still clamped.
+ Clamp the arm tight before you roll | Keep lifting with the leg while you roll | Roll and turn, so your shoulder hits the mat, not your head
- Diving head first: the IJF gives an immediate hansoku-make (disqualification) for diving head first into the mat with uchi-mata | Releasing the leg too early, so they step out
x Uchi-mata-sukashi: they slip your lifting leg | They block with their hips and drop: tani-otoshi on you
v uchi-mata, hane-makikomi, harai-makikomi, soto-makikomi, uchi-mata-sukashi
n A Shinmeisho-no-waza in the Kodokan list. Without a gi, an overhook wraps the arm and it works, though uchi-mata itself is harder.

@ harai-makikomi | Harai-makikomi
f makikomi
k takedown
p standing
s judo
g both
l purple
kanji 払巻込
en Sweeping wraparound
c nage/yoko-sutemi
gk shin
kz front-corner
ijf legal
ng adapt
a Sweeping wraparound | Harai-goshi wraparound
= Start a harai-goshi, let go of the lapel and wrap their arm under your armpit, sweep their leg with your straight leg and roll forward so they wind around you.
1 j-grip | Sleeve and lapel. Pull the sleeve up and out to break them onto their right front corner.
2 j-turn-in | Turn in for harai-goshi. As you turn, let go of the lapel and whip your right arm over their right arm, clamping it to your side.
3 j-harai | Sweep the front of their right thigh with the back of your straight right leg.
4 j-makikomi | Keep sweeping and roll forward to your left, winding them over your hip. Land on top of them.
5 kesa | Keep the arm clamped and pin.
+ Clamp the arm hard | Sweep with a straight leg as you roll | Turn forward and land on them
- Diving head first into the mat (never do this) | Letting the arm slip so they land on you
x They step around your hip: they'll take your back, so stand up | Harai-goshi-gaeshi as you sweep: keep them close
v harai-goshi, hane-makikomi, uchi-mata-makikomi, soto-makikomi, o-soto-makikomi
n A Shinmeisho-no-waza. Without a gi, an overhook works for the arm wrap.

@ ko-uchi-makikomi | Ko-uchi-makikomi
f makikomi
k takedown
p standing
s judo
g both
l blue
kanji 小内巻込
en Minor inner wraparound
c nage/yoko-sutemi
gk shin
kz back-corner
ijf legal
ng works
a Minor inner wraparound | Ko-uchi wraparound | Ko-uchi drop
= Clamp their sleeve arm under your armpit, reap the inside of their foot with ko-uchi-gari and fall forward onto them, driving them onto their back.
1 j-grip | Sleeve and lapel. Get them moving so their right foot steps forward.
2 j-kouchi | Wrap their right arm tight under your right armpit and hook the back of their right heel from the inside with the sole of your right foot.
3 j-push | Drive forward with your whole body and reap the foot out toward their front, so their weight goes back.
4 j-push | Fall forward on top of them, still holding the arm, chest on their chest.
5 side-control | Land on top and settle into side control or kesa-gatame.
+ Clamp the arm before you reap | Reap toward the direction their toes point | Commit your body weight forward
- Grabbing their leg with your hand, which earns a shido in IJF judo (fine in jiu-jitsu) | Reaping when their weight is on their back foot | Falling to the side so they roll you
x They lift the foot and step back: seoi-nage on you as you lean in | Ko-uchi-gaeshi: they sweep your reaping foot
v ko-uchi-gari, o-uchi-gari, uchi-makikomi, ko-uchi-gaeshi
n A Shinmeisho-no-waza. In jiu-jitsu and no-gi it's a strong takedown because you land chest to chest; holding the heel with your free hand is common there.
b inside-trip

@ kani-basami | Kani-basami
f side-drops
k takedown
p standing
s judo
g both
l brown
r scissor
kanji 蟹挟
en Flying scissors
c nage/yoko-sutemi
gk shin
kz back
ijf forbidden
ng works
a Flying scissors | Crab scissors | Scissor takedown | Flying scissor takedown
= FORBIDDEN in judo competition and at every IBJJF belt: you jump sideways and scissor their body with your legs (one in front of their waist, one behind their knees) and twist them backward. It has broken legs.
1 stand | Beside them. In the Kodokan version, from a sleeve and collar grip. Learn this only to recognize it.
2 j-yoko | You jump and put one leg across the front of their waist and the other behind their knees.
3 j-yoko | You drop to the mat and scissor the legs: the front leg pushes back, the back leg pulls forward. They fall straight back.
4 j-landed | They land on their back, often with their knee or leg trapped and twisted.
+ Know it so you can recognize it | If someone tries it on you, don't stiffen and lock your legs; fall with it
- Using it in any judo or IBJJF event: it's hansoku-make (disqualification) in judo and banned at every IBJJF belt | Practicing it hard; the falling partner's knee takes all the force
x Step forward into them and fall with it instead of resisting
v yoko-otoshi, kawazu-gake
n Banned in judo after it caused serious knee and leg injuries; the Kodokan keeps it on its list only as a forbidden technique. Under jiu-jitsu rules it's banned at the IBJJF; NAGA No-Gi allows it only if a hand touches the mat first, and ADCC and EBI don't list it, so ask the referee. The step drawings are the closest available.

@ kawazu-gake | Kawazu-gake
f side-drops
k takedown
p standing
s judo
g both
l brown
r reap
kanji 河津掛
en One-leg entanglement
c nage/yoko-sutemi
gk shin
kz back
ijf forbidden
ng works
a One-leg entanglement | Leg-entwining throw | Kawazu
= FORBIDDEN in judo: you wrap your leg around the outside and front of their leg and fall backward, taking them down with their knee trapped and twisted under them.
1 j-grip | Side by side or chest to chest, often after they turn in for a throw. Learn this only to recognize it.
2 j-osoto | You wrap your leg around the outside of their leg and hook it in around their shin from the front.
3 j-yoko | You fall backward, pulling them down on top of the entangled leg.
4 j-landed | They land with their knee twisted. That's why it was banned.
+ Know it so you can recognize it and step out | If your leg gets wrapped, turn toward them and don't lock your knee
- Using it in any judo match: it's hansoku-make (disqualification) | Practicing it with resistance; the knee can tear
x Step your leg out of the wrap before they fall, and turn toward them
v kani-basami, o-soto-gari, ko-soto-gake
n Named after Kawazu no Saburo, a twelfth-century samurai said to have won a famous sumo bout with it (sumo still has a throw by the same name). The Kodokan names it in its Shinmeisho-no-waza list, but only as a forbidden technique. In jiu-jitsu, wrapping across their knee from the outside counts as reaping, which is illegal under IBJJF rules below adult brown and black belt no-gi, and the backward fall with the knee trapped is unsafe anywhere.

@family seoi | Seoi family | Throws where you turn your back in and load them over your shoulder: two-handed, one-armed, standing or dropped to the knees.
@family hand-drops | Hand drops | Throws done almost entirely with the hands and timing: you block nothing with your hips, you just steer them into the corner they're already falling toward.
@family leg-grabs | Leg grabs | The judo names for wrestling's leg attacks. Penalized in IJF judo today, but still Kodokan techniques and the bread and butter of no-gi takedowns.
@family belt-throws | Belt throws | Throws that start from a grip on their belt, usually over the top of their back when they bend over to defend.
@family te-counters | Hand-technique counters | Counters to their foot sweeps and leg throws that the Kodokan files under te-waza because the hands do the work.

@ seoi-nage | Seoi-nage
f seoi
k takedown
p standing
s judo
g both
l white
kanji 背負投
en Shoulder throw
c nage/te
gk 1
kz front
ijf legal
ng adapt
a Morote-seoi-nage | Two-handed shoulder throw | Two-hand seoi | Shoulder throw
= Pull them onto their toes, spin in low with your back to their chest, wedge your bent lapel-hand elbow under their armpit and throw them over your shoulder.
1 j-grip | Standard grip: sleeve and lapel. Pull the sleeve out and up toward your own forehead, like checking a wristwatch, so they rise onto their toes.
2 j-pull | Keep the pull going so their weight comes forward over their toes. The lapel hand lifts too.
3 j-turn-in | Step your right foot in front of their right foot, pivot on it and swing your left foot back so your feet end up inside theirs, knees bent, back to their chest.
4 j-seoi | Turn your lapel hand so your elbow points down and jams under their right armpit. Your hips are lower than theirs and your back is glued to their belly.
5 j-seoi | Straighten your legs, bend forward and turn your head toward your left (sleeve-hand) side. Pull the sleeve down to your hip as they roll over your shoulder.
6 j-landed | Keep hold of the sleeve as they land so you stay on top and control the arm.
+ Get your hips below theirs before you lift | Feet inside their feet, knees bent | Elbow under the armpit, not up on top of the shoulder | Pull the sleeve the whole time; a slack sleeve means they slide off your back | Turn your head and eyes where you want them to go
- Turning in with straight legs, so you have no spring | Leaving a gap between your back and their chest | Bending only at the waist with your hips too far forward | Doing it with no kuzushi, so they just push their hips forward and stop it
x They push their hips forward and lean back: switch to ko-uchi-gari or o-uchi-gari | They step around and take the back: ura-nage, sukui-nage or a back take in jiu-jitsu | Common combination: fake ko-uchi-gari, then seoi-nage when they step back
v ippon-seoi-nage, seoi-otoshi, tai-otoshi, ko-uchi-gari, o-uchi-gari, sode-tsurikomi-goshi, o-goshi
n The Kodokan calls the two-handed version simply seoi-nage. Without a gi, swap the lapel grip for an underhook or a collar tie and adapt the elbow position.

@ ippon-seoi-nage | Ippon-seoi-nage
f seoi
k takedown
p standing
s judo
g both
l white
kanji 一本背負投
en One-arm shoulder throw
c nage/te
gk shin
kz front
ijf legal
ng works
a One-arm shoulder throw | Arm throw | Flying mare | Arm drag shoulder throw
= Pull their sleeve, turn in and clamp their arm in your elbow pit at the shoulder, then pitch them straight over your shoulder.
1 j-grip | Grip their right sleeve (or wrist) with your left hand. Your right hand can start on the lapel or free.
2 j-pull | Pull the sleeve forward and up so they step and lean onto their toes.
3 j-turn-in | Step in and turn, dropping your hips below theirs. At the same time shoot your right arm under their right armpit, biceps up.
4 j-seoi | Clamp their upper arm in the crook of your right elbow, high in your armpit, your shoulder under their armpit. Back tight to their chest.
5 j-seoi | Drive up with your legs, bend forward and keep pulling the sleeve hand down to your left hip. They go over your right shoulder.
6 j-landed | Keep the arm as they land; in jiu-jitsu you can go straight to an armbar or side control.
+ Elbow pit right up into their armpit | Pull with the sleeve hand the whole way through | Low hips, knees bent, feet inside theirs | Works off any grip, even after they break your lapel hand
- Clamping the arm at the elbow or forearm (it slips out and can hurt them) | Standing up straight as you turn in | Throwing over the top of the shoulder with no pull, so they land on you
x They sag their hips and drop their weight back: switch to ko-uchi-gari | They spin out the trapped arm behind you: take their back | Drop version when they're taller: seoi-otoshi
v seoi-nage, seoi-otoshi, koshi-guruma, tai-otoshi
n The Kodokan listed it as its own technique in 2017; before that it was taught as a version of seoi-nage in Gokyo group 1. It works without a gi because you hold the arm, not the cloth: wrestlers call it a flying mare.

@ seoi-otoshi | Seoi-otoshi
f seoi
k takedown
p standing
s judo
g both
l blue
kanji 背負落
en Shoulder drop
c nage/te
gk hab
kz front
ijf legal
ng adapt
a Drop seoi-nage | Drop shoulder throw | Knee-drop seoi | Shoulder drop
= Seoi-nage from your knees: turn in, drop both knees between their feet and pull them over your back and down in front of you.
1 j-grip | Sleeve and lapel, or sleeve and a high collar grip. Start them moving forward.
2 j-pull | Pull the sleeve up and out so their weight comes onto their toes.
3 j-turn-in | Turn in with your feet between theirs. Keep turning as you drop, so your hips go below their belt line.
4 j-seoi | Drop onto both knees (or one) right between their feet, your back still against their chest, elbow under their armpit.
5 j-seoi | Pull both hands down toward your knees and turn your head away. They tip over your shoulders and land in front of you.
6 j-landed | Come up on top holding the sleeve.
+ Drop between their feet, not out in front of them | Keep turning as you go down so they fall over your shoulder, not onto your back | Pull down toward the mat, not up | Great when they're taller than you or bent forward
- Dropping first and turning second (they just sprawl on your back) | Landing hard on your kneecaps; drop onto your shins | Dropping and holding: if it doesn't go, turtle or come back up fast
x They sprawl and flatten you: you're turtled, so protect the neck | They step around: ura-nage | IJF: dropping with no real attack gets a false-attack shido
v seoi-nage, ippon-seoi-nage, tai-otoshi
n The Kodokan dropped it from the Gokyo in 1920 and restored it in 1982. Without a gi, do it with an underhook or an arm clamp like ippon-seoi-nage.

@ tai-otoshi | Tai-otoshi
f hand-drops
k takedown
p standing
s judo
g both
l blue
kanji 体落
en Body drop
c nage/te
gk 2
kz front-corner
ijf legal
ng adapt
a Body drop | Body drop throw
= Turn in and stretch your leg across the front of their shin as a block, then pull them over it toward their front corner with your hands.
1 j-grip | Sleeve and lapel. Pull the sleeve to make them step forward onto their right foot.
2 j-pull | Pull them up and forward toward their right front corner as they step.
3 j-turn-in | Step your right foot across in front of their right foot and turn so your back is half toward them. Your left foot steps back between their feet.
4 j-taiotoshi | Plant your right leg across the outside of their right shin, knee slightly bent, foot flat. It's a block, not a sweep.
5 j-taiotoshi | Twist your upper body to the left and pull the sleeve down and around like turning a steering wheel. They trip over the blocking leg.
6 j-landed | Keep the sleeve as they land and follow to the mat.
+ The leg only blocks; the hands throw | Your hips stay out in front of theirs, not under them | Twist your shoulders like a steering wheel | Their weight has to be on the leg you block
- Hip under their hips, which turns it into a weak hip throw | Kicking the blocking leg back like a sweep | Blocking too low, at the ankle, where they just step over
x They step over the blocking leg: switch to ko-soto-gari or go to the other side | They pull back: o-uchi-gari or ko-uchi-gari | Combination: fake seoi-nage, finish with tai-otoshi
v seoi-nage, uki-otoshi, sasae-tsurikomi-ashi, ko-uchi-gari, harai-goshi
n One of the best judo throws for smaller people because you never lift them.

@ kata-guruma | Kata-guruma
f leg-grabs
k takedown
p standing
s judo
g both
l blue
kanji 肩車
en Shoulder wheel
c nage/te
gk 3
kz front-corner
ijf shido
ng works
a Fireman's carry | Shoulder wheel | Fireman's
= Pull them forward, drop under their center, reach between their legs and carry them across your shoulders, then spill them off to the side.
1 j-grip | Grip their right sleeve with your left hand. Pull them forward onto their right foot.
2 j-pull | Keep the pull so their head comes forward over your shoulder line.
3 double-leg | Change levels: step in deep between their feet and drop your hips, putting your head on their right hip and your right shoulder under their belly.
4 j-kataguruma | Reach your right arm between their legs and around their right thigh. Pull the sleeve so they drape across both shoulders.
5 j-kataguruma | Stand up or stay on your knee and pour them off over your left shoulder by pulling the sleeve down and lifting the leg.
6 j-landed | Land with them on their back and follow to side control.
+ Pull the sleeve or wrist the whole time so they fold over your shoulders | Head on their hip, not in their belly | Step deep between their feet, not short of them | The low, kneeling version is safer than standing up with them
- Bending at the waist instead of dropping your hips | Head down and outside, so they can front headlock or guillotine you | Throwing them onto their head
x Sprawl and front headlock | Guillotine in no-gi | Step away from the leg and push the head down
v morote-gari, sukui-nage, kuchiki-taoshi, kibisu-gaeshi
n Penalized in IJF judo because the arm grabs the leg, but legal in jiu-jitsu and the classic fireman's carry in wrestling.

@ sukui-nage | Sukui-nage
f leg-grabs
k takedown
p standing
s judo
g both
l purple
kanji 掬投
en Scooping throw
c nage/te
gk 4
kz back
ijf shido
ng works
a Scoop throw | Rear scoop | Scooping throw
= Step in behind them, reach across the front or back of their thighs and scoop their legs out, tipping them backward.
1 j-grip | Start from a grip fight or, more often, as they turn in for a throw and you get to their side or back.
2 body-lock | Step your right foot deep behind their right foot so your hip is behind theirs.
3 j-lift | Reach your right arm behind or across their thighs (or across the front of both knees) and your left arm across their chest.
4 j-uranage | Scoop their legs forward and up with the low arm while the top arm pushes their chest back.
5 j-landed | They fall onto their back next to you. Follow them down.
+ Your hip behind theirs before you scoop | Low arm lifts, top arm pushes back: two directions | Best as a counter when they turn their back on you
- Reaching from the front with your head down | Lifting with your back instead of your legs | Scooping without blocking their hips, so they step out
x Turn in to face them and pummel the arm out | Hip throw them if they don't get behind you | Drop your weight and sprawl the legs back
v morote-gari, kata-guruma, ura-nage, ushiro-goshi, utsuri-goshi
n Penalized in IJF judo because it grabs the legs. In jiu-jitsu and no-gi it's a fine takedown, especially when they turn their back.

@ obi-otoshi | Obi-otoshi
f belt-throws
k takedown
p standing
s judo
g gi
l purple
kanji 帯落
en Belt drop
c nage/te
gk hab
kz back
ijf legal
ng gi
a Belt drop | Belt drop throw
= Step in to their side, grab the front of their belt, drop your other arm across their thighs and tip them backward over your leg.
1 j-grip | From the side of them, slip your hand under their arm and grab the front of their belt, palm up.
2 body-lock | Step your near foot behind their near foot so your hip is just behind theirs.
3 j-uranage | Reach your other arm across the front of their thighs, just above the knees.
4 j-uranage | Lift the belt up and back while the low arm pushes their legs forward. They tip backward over your hip.
5 j-landed | Let them fall beside you and hold the belt so you can follow to a pin.
+ Get to the side first; from the front it's just a shove | Belt hand pulls up and back, low arm pushes forward | Keep your hips close and bent
- Trying it while they're square to you | Pushing straight back with no step behind | Letting go of the belt as they fall
x Turn in to face them and drop your hips | Counter with a hip throw if they're too far in front
v obi-tori-gaeshi, sukui-nage, ura-nage, ushiro-goshi
n Taken out of the Gokyo in 1920 and restored in 1982. Needs a gi belt; in no-gi the same idea is a body-lock trip.

@ uki-otoshi | Uki-otoshi
f hand-drops
k takedown
p standing
s judo
g gi
l purple
kanji 浮落
en Floating drop
c nage/te
gk 4
kz front-corner
ijf legal
ng adapt
a Floating drop | Kneeling hand throw
= As they step forward, drop to one knee and whip both hands down and around so they somersault over their own front corner without you touching their legs.
1 j-grip | Sleeve and lapel. Walk backward and draw them after you.
2 j-pull | As their right foot comes forward, pull hard on the sleeve up and toward their right front corner.
3 j-taiotoshi | Step your left foot back and drop to your left knee, opening the angle so there's nothing in front of them.
4 j-yoko | Pull the sleeve down and around in a big circle while the lapel hand pushes up and over. They roll over their right foot.
5 j-landed | Stay with the sleeve as they land.
+ Pure timing: catch them stepping forward | Big circular pull, like turning a big wheel down and away | Drop your knee so you add your falling weight to the pull
- Pulling straight down at your own feet | Doing it on a static opponent | Letting go of the lapel hand, so it becomes a weak arm drag
x Step around and keep their weight back | Drop your hips and widen your base | Pull back and counter with ko-uchi-gari
v sumi-otoshi, tai-otoshi, de-ashi-harai, yoko-otoshi
n Kodokan's showcase throw in Nage-no-kata. In randori it mostly appears as a sudden hand throw when uke over-commits forward. Without a gi, wrist and elbow control can make a similar drop.

@ sumi-otoshi | Sumi-otoshi
f hand-drops
k takedown
p standing
s judo
g both
l purple
kanji 隅落
en Corner drop
c nage/te
gk 5
kz back-corner
ijf legal
ng adapt
a Corner drop | Kuki-nage | Air throw
= As they step back, follow them, block nothing, and drive their weight into their back corner with your hands until they fall straight back.
1 j-grip | Sleeve and lapel. Push them so they step back with their right foot.
2 j-push | Step your left foot forward to the outside of their right foot, following them.
3 j-push | Push their sleeve hand back and down toward their right heel while the lapel hand lifts and pushes up and back.
4 j-osoto | Keep stepping in and pressing until their weight is all on that heel and they fall straight back. No leg touches them.
5 j-landed | Let them fall and follow to the mat.
+ Their weight must be all on the back heel | Hands drive diagonally back and down, like tipping a barrel | Step in close so your body adds to the push
- Pushing straight back when they can step back to recover | Reaching with your arms from too far away | Trying to trip them with your leg (that's o-soto-otoshi or ko-soto-gari)
x Step back and around, then counter with a forward throw | Drop your hips and keep your weight forward
v uki-otoshi, ko-soto-gari, o-soto-gari, tai-otoshi
n Kuki-nage, the "air throw", because uke falls without being touched below the belt. In no-gi use an underhook and wrist instead of the lapel.

@ yama-arashi | Yama-arashi
f seoi
k takedown
p standing
s judo
g gi
l brown
kanji 山嵐
en Mountain storm
c nage/te
gk hab
kz front-corner
ijf legal
ng gi
a Mountain storm | Saigo's throw
= Hold same-side sleeve and lapel, turn in like seoi-nage, and sweep their outside leg while your hands rip them over your shoulder: half seoi-nage, half harai-goshi.
1 j-grip | Grip the same side: your right hand deep on their right lapel, your left hand on their right sleeve.
2 j-pull | Pull the lapel and sleeve forward and up so they lean onto their right front corner.
3 j-turn-in | Turn in as for seoi-nage, your back against their chest, your right forearm hugging their right shoulder through the lapel grip.
4 j-harai | Sweep your right leg back against the outside of their right leg as you pull both hands down and around.
5 j-landed | They spin over your right shoulder. Follow to the mat.
+ The same-side lapel grip is the whole throw: it traps their right side | Sweep and pull at the same moment | Low hips, like seoi-nage
- Doing it from a normal cross grip | Sweeping before you've loaded them onto your back | Holding the deep lapel without turning in (it's an easy shido for a stalled grip)
x Square up and pull your trapped shoulder back | Break the deep lapel grip first | Ura-nage or ushiro-goshi when they turn in
v seoi-nage, harai-goshi, uchi-mata, tai-otoshi
n Made famous by Saigo Shiro, the Kodokan's early star. Hardly anyone today agrees on exactly how it was done, and the Kodokan dropped it from the Gokyo in 1920 and later restored it.

@ obi-tori-gaeshi | Obi-tori-gaeshi
f belt-throws
k takedown
p standing
s judo
g gi
l brown
kanji 帯取返
en Belt-grab reversal
c nage/te
gk shin
kz front
ijf legal
ng gi
a Belt grab reversal | Belt-grab sacrifice
= When they bend over defensively, reach over their back for the belt, sit to the mat between their feet and roll them over your body.
1 snap-down | They're bent forward with a stiff arm or have just shot in for a leg. Reach over their back with your right arm.
2 snap-down | Grab their belt behind their back, palm down, as close to the knot side as you can.
3 j-tomoe | Sit down right in front of their feet, your belly under their chest, putting your left foot or knee inside their thigh.
4 j-sumi | Pull the belt up and over your head as you roll back. Your leg lifts their thigh and they flip over you.
5 j-landed | Roll through and come up on top, holding the belt.
+ Only against someone already bent forward | Sit right under their center, not out in front | Belt pull is the engine: up and over
- Sitting down too far away (you just pull them on top of you) | Gripping the belt on the near side, so you can't rotate them | Doing it when they're standing tall
x Stand up tall and keep your head up so they can't load you | Sprawl hips down | Step around their sitting legs and pass
v obi-otoshi, sumi-gaeshi, tomoe-nage, morote-gari
n A Kodokan Shinmeisho technique (1997). The sacrifice-throw look comes from counters to leg grabs; the Kodokan still files it under hand throws.

@ morote-gari | Morote-gari
f leg-grabs
k takedown
p standing
s judo
g both
l white
kanji 双手刈
en Two-hand reap
c nage/te
gk shin
kz back
ijf shido
ng works
a Double-leg | Double-leg takedown | Two-hand reap
= Change levels, shoot in, wrap both arms behind their knees and drive through them while pulling the legs out from under them.
1 j-grip | Start from grips or a tie-up. Get them reaching or stepping forward.
2 double-leg | Drop your level, bending your knees not your back. Step deep between their feet with your lead foot.
3 double-leg | Hit them with your shoulder at hip height and wrap both arms behind their knees, head on the outside.
4 double-leg | Pull the knees toward you and drive forward with your shoulder, turning the corner if they stay up.
5 j-landed | They land on their back. Follow straight into side control or pass their legs.
+ Level change with your legs, head up, back straight | Penetration step deep between their feet | Pull the legs and drive the shoulder at the same time | Head to the outside, never in the middle
- Reaching from too far away and diving | Head down, which feeds a guillotine | Stopping your feet after you grab the legs
x Sprawl hard and crossface | Guillotine or front headlock | Whizzer and hip away
v kuchiki-taoshi, kibisu-gaeshi, kata-guruma, sukui-nage, o-soto-gari
n Wrestling's double-leg in Kodokan dress. A shido in IJF judo since 2013 because it grabs the legs, but it's one of the most important takedowns in jiu-jitsu, gi or no-gi.
b double-leg

@ kuchiki-taoshi | Kuchiki-taoshi
f leg-grabs
k takedown
p standing
s judo
g both
l blue
kanji 朽木倒
en Dead tree drop
c nage/te
gk shin
kz back
ijf shido
ng works
a Single-leg | One-hand single leg | Dead tree drop | Rotten tree drop
= Grab behind one of their knees with one hand, pull the leg toward you and push their chest back with the other hand so they topple like a dead tree.
1 j-grip | Grip the lapel (or collar tie in no-gi) with your right hand. Get them to step forward with their right leg.
2 single-leg | Drop your level and grab behind their right knee or heel with your left hand.
3 single-leg | Pull the leg up toward you, keeping your chest close.
4 j-push | Push their chest back with the lapel hand, toward the side of the leg you're holding. They have nothing to stand on and fall back.
5 j-landed | Follow down to the mat and pass the leg.
+ Pull the leg and push the chest in opposite directions | Grip behind the knee, not at the foot | Make them step first so the leg is light
- Reaching down with no set-up | Grabbing the leg and pulling it up without pushing back (they just hop) | Bending at the waist, giving them your back and neck
x Hop on the free leg and whizzer the arm | Sprawl the leg back | Guillotine or front headlock in no-gi
v morote-gari, kibisu-gaeshi, kata-guruma
n Penalized in IJF judo. In jiu-jitsu it's a short-range single-leg; in the gi you can grab their pants or lapel instead.

@ kibisu-gaeshi | Kibisu-gaeshi
f leg-grabs
k takedown
p standing
s judo
g both
l blue
kanji 踵返
en Heel trip reversal
c nage/te
gk shin
kz back-corner
ijf shido
ng works
a Ankle pick | Heel pick | Heel trip reversal
= Snap them forward so they step, then reach down and scoop their front heel out from under them while pushing their head or chest back.
1 j-grip | Get a collar tie or lapel grip with your right hand.
2 snap-down | Pull their head down and forward so they step their right foot forward to catch their balance.
3 ankle-pick | Drop your level and grab the back of their right heel with your left hand, palm forward.
4 ankle-pick | Pull the heel toward you and up while the top hand pushes their head or chest back and to the side.
5 j-landed | They sit down on their back. Follow to the leg or into top position.
+ Make them step first: pick the heel that just moved | Pull the heel, push the head, at the same time | Stay low and close on the pick
- Diving at the ankle with no snap | Picking the far leg or a foot with no weight on it | Pushing the head straight down instead of back
x Pull the foot back as you feel the head snap | Sprawl and front headlock | Step the free leg around and square up
v kuchiki-taoshi, morote-gari, ko-uchi-gari
n The ankle pick: a no-gi and wrestling favorite. Penalized in IJF judo because it grabs the leg.

@ uchi-mata-sukashi | Uchi-mata-sukashi
f te-counters
k takedown
p standing
s judo
g both
l purple
kanji 内股すかし
en Inner-thigh slip
c nage/te
gk shin
kz front-corner
ijf legal
ng adapt
a Inner thigh slip | Uchi mata dodge | Sukashi
= When they lift their leg for uchi-mata, slide your thigh out of the way so they swing at nothing, and throw them forward over their own sweeping leg with your hands.
1 j-grip | Normal grips. Feel them start to turn in for uchi-mata.
2 j-uchimata ! | As their leg comes up between yours, step your right leg back and away so their leg misses.
3 j-taiotoshi | Turn your hips to the left and keep your hands working: pull the sleeve down and around.
4 j-yoko | They're on one leg and still falling forward. Twist them over their own momentum toward their front corner.
5 j-landed | They land on their back. Follow to a pin.
+ Pure timing: feel the leg coming | Move only the thigh they're aiming at; keep your upper body close | The hands throw, like tai-otoshi
- Stepping away too early, before they commit | Pushing them away with the hands so they just recover | Stepping back with your whole body and losing your grips
x Uchi-mata with your head and hips square, so they can't slip it | Don't overcommit the leg on a doubtful entry
v uchi-mata, uchi-mata-gaeshi, tai-otoshi, ko-uchi-gaeshi
n Sukashi means slipping or dodging. A Shinmeisho technique (1982).

@ ko-uchi-gaeshi | Ko-uchi-gaeshi
f te-counters
k takedown
p standing
s judo
g both
l purple
kanji 小内返
en Minor inner reap counter
c nage/te
gk shin
kz side
ijf legal
ng adapt
a Minor inner reap counter | Ko-uchi counter
= When they reap the inside of your foot with ko-uchi-gari, lift that foot out of the way and turn them over their own reaching leg with your hands.
1 j-grip | Normal grips. They attack your right foot with a ko-uchi-gari.
2 j-kouchi ! | Let your reaped foot float with their reap instead of resisting. Don't let them get your weight on it.
3 j-pull | Turn your upper body to your left and pull their sleeve down and around while your lapel hand pushes their head over.
4 j-yoko | They're on one leg with the other leg stuck out between yours. Keep turning and they fall onto their side and back.
5 j-landed | Land on top holding the sleeve.
+ Go with their reap; don't fight it | The hands turn them like a steering wheel | Timing beats strength here
- Planting your foot so they get the reap | Pushing straight back so they recover | Turning without the sleeve pull
x Reap with your weight under you and your head up so they can't turn you | Follow ko-uchi with seoi-nage before they settle
v ko-uchi-gari, uchi-mata-sukashi, tsubame-gaeshi, o-uchi-gaeshi
n Added to the Kodokan list in 1997. It's a hand-technique counter, not a reap of your own.
`;
