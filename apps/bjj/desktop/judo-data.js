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
`;
