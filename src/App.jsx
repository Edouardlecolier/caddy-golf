import { useState, useRef, useEffect } from "react";

const NAVY = "#1a2f4a";
const GOLD = "#e8b84b";
const GREEN = "#3a7d4a";
const RED = "#e05252";
const AMBER = "#f59e0b";
const WHITE = "#ffffff";
const OFF = "#f7f8fa";
const BORDER = "#e2e8f0";
const SLATE = "#64748b";
const SLATE_L = "#94a3b8";
const TEXT = "#1a2332";
const TEXT_S = "#4a5568";
const GREEN_BG = "#e8f5ec";
const PURPLE = "#7c5cbf";
const PURPLE_BG = "#f0ebfa";

const DAWN_BG = "linear-gradient(160deg,#1a2f4a 0%,#2d5a3d 50%,#c8860a 100%)";
const HEADER_BG = "linear-gradient(135deg,#1a2f4a 0%,#243d5c 100%)";
const GOLD_BG = "linear-gradient(135deg,#e8b84b 0%,#f5d07a 100%)";
const GREEN_GRAD = "linear-gradient(135deg,#3a7d4a 0%,#52a063 100%)";
const PURPLE_GRAD = "linear-gradient(135deg,#7c5cbf 0%,#9b7fd4 100%)";

// All exercises describe DISTANCE, never a specific club — club choice is personal.
// Distances are stored in metres (canonical) and converted to yards/feet for imperial users.
//
// CURRICULUM NOTES (why these drills, in this order):
// - Putting progresses: face control -> short-putt confidence -> distance/speed -> breaking reads -> pressure/endurance
// - Short Game progresses: basic contact -> landing-spot awareness -> club/shot selection -> trouble lies -> circuits
// - Long Game progresses: setup/contact fundamentals -> tempo/balance -> accuracy at a fixed distance -> shot shaping -> full-bag pressure
// - Mental Game progresses: routine building -> visualization -> focus under fatigue -> simulated pressure -> resilience after a bad shot
const EXERCISES = {
  putting: [
    {id:"p1",name:"Gate Drill",difficulty:"Beginner",duration:10,emoji:"🚪",purpose:"Face angle and path control",desc:"Place two tees just wider than your putter head, 15 cm in front of the ball. Make 20 putts from 1 m through the gate.",label:"Holed",max:20,facePos:"square",ballPos:"center"},
    {id:"p2",name:"Tap-In Confidence",difficulty:"Beginner",duration:10,emoji:"⭕",purpose:"Short-putt routine and confidence",desc:"Place 10 balls in a circle 30 cm from the hole and make all 10, then move out to 60 cm and putt 10 more (20 putts total).",label:"Consecutive made",max:20,facePos:"square",ballPos:"center"},
    {id:"p3",name:"Straight Putt",difficulty:"Beginner",duration:10,emoji:"📏",purpose:"Stroke mechanics and tempo",desc:"Find the straightest putt on the green. Hit 15 putts from 1 m with a smooth pendulum stroke.",label:"Holed",max:15,facePos:"square",ballPos:"center"},
    {id:"p4",name:"Lag to the Fringe",difficulty:"Beginner",duration:10,emoji:"🎯",purpose:"Distance control and speed",desc:"From 9 m, stop 10 balls within 15 cm of the fringe without going over.",label:"Stopped in zone",max:10,facePos:"square",ballPos:"center"},
    {id:"p5",name:"One-Hand Drill",difficulty:"Beginner",duration:10,emoji:"✋",purpose:"Feel and prevents wrist flip",desc:"Putt 10 balls with your lead hand only from 1.2 m. Builds feel and prevents flipping.",label:"Holed",max:10,facePos:"square",ballPos:"center"},
    {id:"p6",name:"Ladder to the Hole",difficulty:"Beginner",duration:10,emoji:"🪜",purpose:"Basic speed judgment",desc:"Putt one ball each from 2 m, 4 m, 6 m, and 8 m, aiming to finish past the hole but within 1 m. Repeat the ladder 3 times (12 putts total).",label:"In zone (of 12)",max:12,facePos:"square",ballPos:"center"},
    {id:"p7",name:"Clock Drill",difficulty:"Intermediate",duration:15,emoji:"🕐",purpose:"Consistency from all angles",desc:"Place 4 balls at 1 m around the hole like a clock and putt each one. Complete the full circle without missing, then repeat for 3 full rounds (12 putts total).",label:"Consecutive made",max:12,facePos:"square",ballPos:"center"},
    {id:"p8",name:"Distance Ladder",difficulty:"Intermediate",duration:15,emoji:"📶",purpose:"Speed calibration",desc:"Putt to targets at 3 m, 6 m, and 9 m, scoring a point each time the ball stops within one club-length of the target. 5 attempts at each distance (15 putts total).",label:"Points earned",max:15,facePos:"square",ballPos:"center"},
    {id:"p9",name:"5-Footer Pressure",difficulty:"Intermediate",duration:15,emoji:"💪",purpose:"Pressure performance",desc:"Sink 5 putts from 1.5 m in a row. Every miss resets your count back to zero. You have up to 20 attempts to complete the streak — log how many attempts it took.",label:"Attempts to complete",max:20,facePos:"square",ballPos:"center"},
    {id:"p10",name:"Breaking Putt",difficulty:"Intermediate",duration:15,emoji:"↩️",purpose:"Break reading",desc:"Find a consistent breaking putt at 2.5 m. Hit 10 putts tracking the start line. Make 6+ to pass.",label:"Holed",max:10,facePos:"square",ballPos:"center"},
    {id:"p11",name:"Two-Tier Speed",difficulty:"Intermediate",duration:15,emoji:"🌀",purpose:"Speed control on slopes",desc:"Find a two-tier green or slope. Putt 10 balls from the lower tier to a hole on the upper tier, focusing only on getting the speed right.",label:"Within 1 m",max:10,facePos:"square",ballPos:"center"},
    {id:"p12",name:"100-Ball Putting",difficulty:"Advanced",duration:30,emoji:"💯",purpose:"Endurance and baseline",desc:"Hit 100 putts from distances between 1 and 6 m, mixing straight and breaking lines throughout. Track every putt you make.",label:"Holed",max:100,facePos:"square",ballPos:"center"},
    {id:"p13",name:"Pressure 18",difficulty:"Advanced",duration:25,emoji:"🏆",purpose:"Tournament simulation",desc:"Play 18 pressure putting situations: 6 from 1.2 m, 6 from 1.8 m, and 6 from 2.4 m. Score 2 points for a clean make, 1 point if you tap in after a near-miss, 0 points for a 3-putt (36 points possible).",label:"Points",max:36,facePos:"square",ballPos:"center"},
    {id:"p14",name:"3-6-9 Circuit",difficulty:"Advanced",duration:20,emoji:"📐",purpose:"Scoring from short range",desc:"Make 3 putts from 1 m, 3 from 2 m, and 3 from 3 m without missing (9 putts if perfect). Every miss adds one extra penalty putt to your total — log the total putts it took to finish all 9.",label:"Total putts",max:20,facePos:"square",ballPos:"center"},
    {id:"p15",name:"Lag Putt Marathon",difficulty:"Advanced",duration:25,emoji:"🎯",purpose:"Long putt distance control",desc:"Hit 15 putts from 12-15 m, all to different holes. Score 2 points if the ball finishes within 1 m (a safe 2-putt range), 0 points for anything further (30 points possible).",label:"Points",max:30,facePos:"square",ballPos:"center"},
  ],
  shortGame: [
    {id:"s1",name:"Up and Down",difficulty:"Beginner",duration:10,emoji:"⛳",purpose:"Basic chipping and finishing",desc:"From 5 m off the green, chip and putt. 10 attempts. Count successful up and downs.",label:"Up and downs",max:10,facePos:"square",ballPos:"back"},
    {id:"s2",name:"Landing Zone",difficulty:"Beginner",duration:10,emoji:"🎯",purpose:"Landing spot awareness",desc:"Place a towel 1 m onto the green. From 9 m, hit 15 shots trying to land on the towel. Pick whatever club gets the ball there on a low, controlled flight.",label:"Hits on towel",max:15,facePos:"square",ballPos:"back"},
    {id:"s3",name:"Chip to a Tee",difficulty:"Beginner",duration:10,emoji:"📌",purpose:"Precision proximity control",desc:"Push a tee 2 m from the edge of the green. From 7 m, hit 10 shots within 1 m of the tee.",label:"Within 1 m",max:10,facePos:"square",ballPos:"back"},
    {id:"s4",name:"Ladder Chips",difficulty:"Beginner",duration:10,emoji:"🪜",purpose:"Distance control on chips",desc:"From the same spot, chip 3 balls to a near target, 3 to a middle target, and 3 to a far target, all on the green (9 chips total). Focus only on matching your swing length to the distance.",label:"On target (of 9)",max:9,facePos:"square",ballPos:"back"},
    {id:"s5",name:"Bump and Run",difficulty:"Intermediate",duration:15,emoji:"🎳",purpose:"Low trajectory shot control",desc:"From 18 m, bump and run to a specific hole using a low, rolling shot. 10 attempts, track within 2 m.",label:"Within 2 m",max:10,facePos:"square",ballPos:"back"},
    {id:"s6",name:"Pick Your Club",difficulty:"Intermediate",duration:15,emoji:"🏑",purpose:"Club selection confidence",desc:"From 14 m, hit 15 shots using whichever 3 clubs you'd naturally choose for this shot. Notice which one gives you the most consistent result — that's your go-to.",label:"Within 1.2 m",max:15,facePos:"square",ballPos:"center"},
    {id:"s7",name:"Bunker Escape",difficulty:"Intermediate",duration:15,emoji:"🏖️",purpose:"Sand technique",desc:"From a greenside bunker, get 10 balls on the green. Track how many finish within 3 m of the flag.",label:"Balls on green",max:10,facePos:"open",ballPos:"forward"},
    {id:"s8",name:"Pitch Precision",difficulty:"Intermediate",duration:15,emoji:"📡",purpose:"Wedge distance control",desc:"From 27 m, hit 10 pitch shots. Land within 3 m and stop within 4.5 m total.",label:"Within 4.5 m",max:10,facePos:"square",ballPos:"center"},
    {id:"s9",name:"Uphill / Downhill Lies",difficulty:"Intermediate",duration:15,emoji:"⛰️",purpose:"Adapting to slope",desc:"Find an uphill stance and a downhill stance near the green. Hit 5 chips from each (10 total), focusing on solid contact and controlling distance despite the slope.",label:"Up and downs",max:10,facePos:"square",ballPos:"back"},
    {id:"s10",name:"Flop Shot",difficulty:"Advanced",duration:20,emoji:"🎭",purpose:"High trajectory mastery",desc:"Over an obstacle from 14 m, hit 10 high, soft-landing shots. Must land on green and stop within 2.5 m.",label:"Successful flops",max:10,facePos:"open",ballPos:"forward"},
    {id:"s11",name:"Short Game Circuit",difficulty:"Advanced",duration:30,emoji:"🔄",purpose:"Full short game consistency",desc:"Set up 5 stations around the green at varying distances and lies: chip, pitch, high flop, bunker, and an awkward lie. Hit 5 balls at each station (25 total) and track up and downs at every one.",label:"Up and downs",max:25,facePos:"square",ballPos:"center"},
    {id:"s12",name:"Up and Down 18",difficulty:"Advanced",duration:30,emoji:"🏅",purpose:"Scrambling endurance",desc:"Simulate 18 short game situations: 6 from rough, 6 from sand, 6 from tight lies, all within 20 m of the green.",label:"Up and downs",max:18,facePos:"square",ballPos:"center"},
    {id:"s13",name:"One Ball, No Re-Dos",difficulty:"Advanced",duration:20,emoji:"🎲",purpose:"Commitment without practice swings",desc:"Walk to 10 random spots within 20 m of the green. Hit one shot from each with no practice swing or redo, exactly like on the course. Track up and downs.",label:"Up and downs",max:10,facePos:"square",ballPos:"center"},
  ],
  longGame: [
    {id:"l1",name:"Alignment Drill",difficulty:"Beginner",duration:10,emoji:"📏",purpose:"Setup and alignment",desc:"Use alignment sticks. Hit 20 mid-iron shots focusing purely on solid, centred contact. No target — just feel the strike.",label:"Solid contacts",max:20,facePos:"square",ballPos:"center"},
    {id:"l2",name:"Slow Motion Swings",difficulty:"Beginner",duration:10,emoji:"🐢",purpose:"Swing plane and sequencing",desc:"Hit 15 balls at about 50% speed with a mid-iron, keeping the club on plane and finishing in balance. Rate each swing from 1 to 3 for how controlled it felt.",label:"Balanced finishes",max:15,facePos:"square",ballPos:"center"},
    {id:"l3",name:"Feet Together",difficulty:"Beginner",duration:10,emoji:"🦵",purpose:"Balance and rhythm",desc:"Hit 15 balls with your feet together using any iron. This forces correct weight transfer and a more natural rhythm.",label:"Clean contacts",max:15,facePos:"square",ballPos:"center"},
    {id:"l4",name:"Low Point Control",difficulty:"Beginner",duration:10,emoji:"🎯",purpose:"Ball-then-turf contact",desc:"Draw a line in the grass or use a spray line. Hit 15 mid-iron shots trying to take a divot just in front of the line every time.",label:"Correct low point",max:15,facePos:"square",ballPos:"center"},
    {id:"l5",name:"Fairway Finder",difficulty:"Intermediate",duration:15,emoji:"🛣️",purpose:"Driver accuracy",desc:"Hit 10 tee shots with your driver into a defined fairway corridor. Track how many you hit and which side you tend to miss on.",label:"Fairways hit",max:10,facePos:"square",ballPos:"forward"},
    {id:"l6",name:"Iron Accuracy at 130m",difficulty:"Intermediate",duration:20,emoji:"🎯",purpose:"Mid-range iron dispersion",desc:"Pick a target 130 m away. Use whichever club you'd normally hit that distance. 15 shots, track how many finish within 18 m of target.",label:"On target",max:15,targetDistanceM:130,facePos:"square",ballPos:"center"},
    {id:"l7",name:"9-Shot Matrix",difficulty:"Intermediate",duration:20,emoji:"🎲",purpose:"Shot shaping control",desc:"Hit 9 shots with one club: high, mid, low combined with draw, straight, fade. 1 point per successful intentional shape.",label:"Shapes achieved",max:9,facePos:"varies",ballPos:"center"},
    {id:"l8",name:"Wedge Distance Ladder",difficulty:"Intermediate",duration:20,emoji:"📶",purpose:"Partial swing calibration",desc:"Hit 5 balls each at 50%, 75%, and 100% swing speed with your shortest wedge (15 shots total). Note how far each effort level carries — this becomes your personal distance chart.",label:"Within 5 m of intended",max:15,facePos:"square",ballPos:"center"},
    {id:"l9",name:"Stock Shot Repeatability",difficulty:"Intermediate",duration:20,emoji:"🔁",purpose:"Consistency under no pressure",desc:"Pick one club and one target. Hit 15 shots trying to repeat the exact same shot every time. Track how many finish within a 10 m circle.",label:"Within 10 m",max:15,facePos:"square",ballPos:"center"},
    {id:"l10",name:"Par 3 Simulation",difficulty:"Advanced",duration:25,emoji:"🏌️",purpose:"Pressure iron play",desc:"Simulate 9 par-3 holes at varying distances from 90 to 165 m. Pick realistic targets and clubs. Track greens hit.",label:"Greens hit",max:9,facePos:"square",ballPos:"center"},
    {id:"l11",name:"Full Bag Challenge",difficulty:"Advanced",duration:40,emoji:"🎒",purpose:"Whole bag consistency",desc:"Hit 2 shots with every club in your bag, working from longest to shortest. Rate your best shot with each club: 0 for poor, 1 for OK, 2 for great — log your total points across all clubs.",label:"Points",max:18,facePos:"square",ballPos:"varies"},
    {id:"l12",name:"Driver Under Pressure",difficulty:"Advanced",duration:20,emoji:"😤",purpose:"Performance under stress",desc:"Hit 10 drivers into the narrowest corridor you can realistically define — simulating the tightest tee shot you'd face on your home course.",label:"Fairways hit",max:10,facePos:"square",ballPos:"forward"},
    {id:"l13",name:"Trouble Shots",difficulty:"Advanced",duration:25,emoji:"🌲",purpose:"Recovery shot skills",desc:"Simulate 10 trouble situations: punching under a branch, drawing around an obstacle, or fading over trouble. Rate each shot from 0 (failed) to 2 (executed as planned) — 20 points possible.",label:"Points",max:20,facePos:"varies",ballPos:"varies"},
  ],
  mental: [
    {id:"m1",name:"Pre-Shot Routine Builder",difficulty:"Beginner",duration:10,emoji:"🧘",purpose:"Building a repeatable routine",desc:"On the range, hit 15 shots using the exact same pre-shot routine every time: same number of looks at target, same waggle, same breath. Rate how consistent your routine felt, 1 to 3.",label:"Consistent routines",max:15},
    {id:"m2",name:"Visualization Reps",difficulty:"Beginner",duration:10,emoji:"💭",purpose:"Mental imagery before contact",desc:"Before each of 10 shots, close your eyes for 3 seconds and picture the ball's full flight landing on target. Then hit. Rate how clearly you could see it, 1 to 3.",label:"Clear visualizations",max:10},
    {id:"m3",name:"One Breath Reset",difficulty:"Beginner",duration:10,emoji:"🌬️",purpose:"Resetting after a bad shot",desc:"Hit 15 shots. After any shot you don't like, take one slow breath before walking to the next ball — never react, just breathe and reset. Track how many resets you managed calmly.",label:"Calm resets",max:15},
    {id:"m4",name:"Commitment Drill",difficulty:"Intermediate",duration:15,emoji:"🎯",purpose:"Trusting your read or plan",desc:"On 10 shots or putts, pick your target and club in under 10 seconds, then commit fully with zero second-guessing. Track how many you committed to without hesitation.",label:"Committed shots",max:10},
    {id:"m5",name:"Pressure Putt Simulation",difficulty:"Intermediate",duration:15,emoji:"💓",purpose:"Performing under simulated pressure",desc:"Set up a 2 m putt. Tell yourself this one putt decides the match. Do this 10 separate times, walking away and resetting between each. Track makes under self-imposed pressure.",label:"Holed under pressure",max:10},
    {id:"m6",name:"Bad Shot Recovery",difficulty:"Intermediate",duration:15,emoji:"🔄",purpose:"Bouncing back immediately",desc:"Deliberately try to hit a poor shot, then immediately step up and hit your best shot right after. Repeat 8 times. Track how many recovery shots were genuinely good.",label:"Good recoveries",max:8,},
    {id:"m7",name:"Focus Under Fatigue",difficulty:"Advanced",duration:20,emoji:"🔥",purpose:"Maintaining quality late in practice",desc:"After a full practice session when you're tired, hit 10 more shots with full routine and commitment. Track how many matched your early-session quality.",label:"Quality shots",max:10},
    {id:"m8",name:"Mock Tournament Round",difficulty:"Advanced",duration:30,emoji:"🏆",purpose:"Full pressure simulation",desc:"Play or simulate 9 holes scoring as if it's a real competition with something on the line. Notice your self-talk and breathing under that pressure. Rate your mental composure per hole, 1 to 3.",label:"Composed holes",max:9},
    {id:"m9",name:"Process Over Outcome",difficulty:"Advanced",duration:20,emoji:"⚖️",purpose:"Detaching from results",desc:"Hit 15 shots, but score yourself only on routine and commitment quality — completely ignore where the ball goes. This rewires focus toward what you control.",label:"Quality process reps",max:15},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// FINISHER GAMES — standalone /100 challenges, separate from regular drills.
// Each game has fixed stations with fixed scoring rules (no club prescription,
// same philosophy as regular exercises). Local pass-the-phone multiplayer:
// one device, multiple named players take turns, scores compared at the end.
// ═══════════════════════════════════════════════════════════════════════════

const FINISHERS = {
  shortGame: {
    id:"shortGame", name:"Short Game Finisher", emoji:"⛳", max:100,
    resultLabel:"Short Game Handicap Score",
    intro:"Five lies, ten balls each. This is the real test of your scrambling — not just whether you get up and down, but how close you get when you don't.",
    stations:[
      {id:"sg1", name:"Tight Lie", emoji:"🪨", pattern:"bunker", desc:"From a tight, hardpan-style lie just off the green. 10 balls.", attempts:10, max:20, why:"Tight lies punish anyone who scoops at the ball — this station tests clean, ball-first contact under the least forgiving conditions."},
      {id:"sg2", name:"Rough", emoji:"🌿", pattern:"trouble", desc:"From thick rough around the green. 10 balls.", attempts:10, max:20, why:"Grass grabs the clubface in rough, so distance control here depends on reading the lie correctly before you commit to the shot."},
      {id:"sg3", name:"Bunker", emoji:"🏖️", pattern:"bunker", desc:"From a greenside bunker. 10 balls.", attempts:10, max:20, why:"Sand technique is about hitting the sand, not the ball — this station isolates that one skill under real scoring pressure."},
      {id:"sg4", name:"Long Pitch", emoji:"📡", pattern:"wedge", desc:"A longer pitch shot, roughly 25-30m to the green. 10 balls.", attempts:10, max:20, why:"A longer pitch demands full tempo at a controlled length — most misses here come from rushing rather than poor technique."},
      {id:"sg5", name:"Short Chip", emoji:"📌", pattern:"towel", desc:"A short chip from just off the green, under 10m. 10 balls.", attempts:10, max:20, why:"Short chips are the highest-frequency shot in real rounds — small errors here cost the most strokes over a season."},
    ],
    // scoring per ball, per station: 2 = up&down within target zone, 1 = on green but missed zone, 0 = missed green
    scoringNote:"Per ball: 2 pts if up-and-down inside the target zone, 1 pt if on the green but outside it, 0 if you miss the green entirely.",
    perStationMax:20, // 10 attempts x 2 pts
  },
  putting: {
    id:"putting", name:"Putting Finisher", emoji:"🟢", max:100,
    resultLabel:"Putting Handicap Score",
    intro:"Five stations testing every putting skill you actually need on the course: short putts, mid range, lag, start-line control, and pressure.",
    stations:[
      {id:"pt1", name:"Short Putts", emoji:"⭕", pattern:"circle", desc:"10 putts from 1.5 m.", attempts:10, ptsPerSuccess:1, max:10, why:"These are the putts that should never be missed in a real round — this station tests whether your routine holds up on the makeable ones."},
      {id:"pt2", name:"Mid Range", emoji:"📏", pattern:"ladder", desc:"10 putts from 3 m.", attempts:10, ptsPerSuccess:2, max:20, why:"Mid-range putting blends line and speed equally — neither mechanics nor feel alone gets you through this station."},
      {id:"pt3", name:"Lag Putting", emoji:"🎯", pattern:"ladder", desc:"10 m putt. Score if the ball finishes within 60 cm of the hole.", attempts:10, ptsPerSuccess:3, max:30, why:"Most 3-putts start from distance, not from a bad read — this station trains the deceleration touch that prevents them."},
      {id:"pt4", name:"Start Line", emoji:"🚪", pattern:"gate", desc:"Gate drill — 20 attempts at a 2-tee gate just ahead of the ball.", attempts:20, ptsPerSuccess:1, max:20, why:"If the putter face is even slightly open or closed at impact, the ball clips a tee — this isolates pure face control from everything else."},
      {id:"pt5", name:"Pressure Putt", emoji:"💓", pattern:"pressure", desc:"One single putt from 2 m. Make it or don't — no second chances.", attempts:1, ptsPerSuccess:20, max:20, why:"One shot, all the weight on it — this mirrors exactly the putt that decides a match, with nowhere to hide."},
    ],
  },
  longGame: {
    id:"longGame", name:"Long Game Finisher", emoji:"🏌️", max:100,
    resultLabel:"Long Game Handicap Score",
    intro:"Four stations covering the full long game: off the tee, approach accuracy, distance control, and performing when it matters.",
    stations:[
      {id:"lg1", name:"Driver Accuracy", emoji:"🛣️", pattern:"fairway", desc:"10 tee shots to a defined fairway corridor.", attempts:10, ptsPerSuccess:2, max:20, why:"Fairways found is the single biggest driver of scoring — this station measures it directly instead of guessing from feel."},
      {id:"lg2", name:"Iron Accuracy", emoji:"🎯", pattern:"grid", desc:"20 approach shots to a fixed target.", attempts:20, ptsPerSuccess:2, max:40, why:"Twenty reps at one target reveals your real dispersion pattern — most players are surprised by what they actually see here."},
      {id:"lg3", name:"Distance Control", emoji:"📶", pattern:"wedge", desc:"5 shots at 5 different distances — tests control across your full range.", attempts:5, ptsPerSuccess:4, max:20, why:"Hitting it far is easy — hitting it the right far, every time, at five different distances, is the actual skill this measures."},
      {id:"lg4", name:"Pressure Shot", emoji:"😤", pattern:"pressure", desc:"5 high-stakes shots, one swing each, no redo.", attempts:5, ptsPerSuccess:4, max:20, why:"No mulligans, one swing each — this is the closest range work gets to the one shot you actually have on the course."},
    ],
  },
};

function gradeFinisher(pct){
  if(pct>=90) return {label:"Tour Level", color:GOLD};
  if(pct>=75) return {label:"Excellent", color:GREEN};
  if(pct>=55) return {label:"Solid", color:AMBER};
  return {label:"Building Blocks", color:RED};
}

// ═══════════════════════════════════════════════════════════════════════════
// STATIC EXERCISE DIAGRAMS — hand-built SVGs per drill type, not AI-generated.
// Reliable, instant, zero API risk. Re-used across exercises that share a
// setup pattern (e.g. "gate drill" pattern reused for any gate-based drill).
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE PHOTO — attempts an AI-generated, photo-realistic image matching
// the drill setup (per your reference card style). Cached in sessionStorage
// per exercise so it only generates once per session. On ANY failure (network,
// API, parsing) it falls back silently to the reliable static SVG diagram —
// the app must never break or show a blank box because of this.
// ═══════════════════════════════════════════════════════════════════════════
function ExercisePhoto({exercise, pattern}){
  // AI-generated photos are deferred to a future backend project (a server
  // is needed to hold the API key safely — it can't run from the browser).
  // In this deployed build, go straight to the illustrated diagram — no
  // pointless network attempt or loading delay for anyone using this app.
  return <ExerciseDiagram pattern={pattern}/>;
}

function ExerciseDiagram({pattern}){
  const common = {viewBox:"0 0 320 180", style:{width:"100%",height:"auto",display:"block"}};
  const uid = pattern; // unique-enough per render group for gradient ids

  // Reusable defs: sky gradient, grass gradient, soft shadow filter
  const Defs = () => (
    <defs>
      <linearGradient id={"sky_"+uid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#cfe6f5"/>
        <stop offset="100%" stopColor="#eef6ec"/>
      </linearGradient>
      <linearGradient id={"grass_"+uid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8fc79a"/>
        <stop offset="100%" stopColor="#6fae7c"/>
      </linearGradient>
      <radialGradient id={"green_"+uid} cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#bfe5cc"/>
        <stop offset="100%" stopColor="#9bd1ad"/>
      </radialGradient>
      <radialGradient id={"sun_"+uid} cx="85%" cy="12%" r="22%">
        <stop offset="0%" stopColor="#fff6d8" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#fff6d8" stopOpacity="0"/>
      </radialGradient>
      <filter id={"soft_"+uid} x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1a2f4a" floodOpacity="0.18"/>
      </filter>
    </defs>
  );

  const Scene = ({children}) => (
    <>
      <rect width="320" height="180" fill={"url(#sky_"+uid+")"}/>
      <rect width="320" height="180" fill={"url(#sun_"+uid+")"}/>
      <path d="M0 108 Q 160 92 320 108 L320 180 L0 180 Z" fill={"url(#grass_"+uid+")"}/>
      {/* mowing stripes for texture */}
      {[0,1,2,3,4,5].map(i=>(
        <rect key={i} x={i*56-10} y="112" width="34" height="68" fill="#ffffff" opacity="0.05" transform={"skewX(-6)"}/>
      ))}
      {children}
    </>
  );

  const ball = (cx,cy,r=6) => (
    <g filter={"url(#soft_"+uid+")"}>
      <ellipse cx={cx} cy={cy+r*0.9} rx={r*0.9} ry={r*0.32} fill="#1a2f4a" opacity="0.18"/>
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke="#d8dde2" strokeWidth="1"/>
      <circle cx={cx-r*0.3} cy={cy-r*0.3} r={r*0.32} fill="#ffffff" opacity="0.9"/>
    </g>
  );
  const tee = (x,y) => (
    <g filter={"url(#soft_"+uid+")"}>
      <ellipse cx={x} cy={y+1} rx="4" ry="1.6" fill="#1a2f4a" opacity="0.15"/>
      <rect x={x-1.4} y={y-12} width="2.8" height="14" fill="#e8dcb0" rx="1"/>
    </g>
  );
  const flag = (x,y) => (
    <g filter={"url(#soft_"+uid+")"}>
      <ellipse cx={x} cy={y+2} rx="9" ry="2.4" fill="#1a2f4a" opacity="0.12"/>
      <circle cx={x} cy={y+2} r="3" fill="#9bd1ad" stroke="#ffffff" strokeWidth="1"/>
      <line x1={x} y1={y} x2={x} y2={y-34} stroke="#1a2f4a" strokeWidth="2"/>
      <path d={"M"+x+" "+(y-34)+" L"+(x+20)+" "+(y-27)+" L"+x+" "+(y-20)+" Z"} fill="#e8b84b"/>
    </g>
  );
  const green = <ellipse cx="160" cy="132" rx="148" ry="36" fill={"url(#green_"+uid+")"} stroke="#ffffff" strokeOpacity="0.3"/>;
  const bunkerSand = (cx,cy,rx,ry) => (
    <g>
      <ellipse cx={cx} cy={cy+3} rx={rx} ry={ry} fill="#1a2f4a" opacity="0.1"/>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#e8dcb0" stroke="#d4c595" strokeWidth="1"/>
      <path d={"M"+(cx-rx*0.6)+" "+cy+" Q "+cx+" "+(cy-ry*0.4)+" "+(cx+rx*0.6)+" "+cy} stroke="#d4c595" strokeWidth="1" fill="none" opacity="0.6"/>
    </g>
  );

  if(pattern==="gate") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {ball(64,128)}
      {tee(100,124)}{tee(100,138)}
      <path d="M76 127 Q 140 95 234 62" stroke="#e8b84b" strokeWidth="2.2" strokeDasharray="5 4" fill="none" opacity="0.85"/>
      {flag(254,56)}
    </Scene></svg>
  );

  if(pattern==="circle") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {flag(160,100)}
      {[0,1,2,3,4,5,6,7].map(i=>{
        const a=(i/8)*2*Math.PI;
        return <g key={i}>{ball(160+Math.cos(a)*40, 106+Math.sin(a)*15)}</g>;
      })}
    </Scene></svg>
  );

  if(pattern==="ladder") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {ball(42,140)}
      <path d="M50 138 L 282 96" stroke="#1a2f4a" strokeWidth="1.5" strokeDasharray="2 4" fill="none" opacity="0.35"/>
      {[1,2,3,4].map(i=>(
        <circle key={i} cx={70+i*56} cy={130-i*5} r="6" fill="none" stroke="#e8b84b" strokeWidth="2" strokeDasharray="3 2"/>
      ))}
    </Scene></svg>
  );

  if(pattern==="towel") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {ball(52,138)}
      <g filter={"url(#soft_"+uid+")"}>
        <rect x="192" y="108" width="38" height="22" fill="#e8b84b" opacity="0.4" rx="3"/>
        <rect x="192" y="108" width="38" height="22" fill="none" stroke="#e8b84b" strokeWidth="2" rx="3"/>
      </g>
      <path d="M60 136 Q 145 78 211 113" stroke="#1a2f4a" strokeWidth="1.8" strokeDasharray="5 4" fill="none" opacity="0.55"/>
    </Scene></svg>
  );

  if(pattern==="bunker") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {bunkerSand(74,138,48,21)}
      {ball(74,135,5)}
      {flag(224,103)}
      <path d="M80 128 Q 145 65 216 98" stroke="#e8b84b" strokeWidth="2.2" strokeDasharray="5 4" fill="none" opacity="0.85"/>
    </Scene></svg>
  );

  if(pattern==="fairway") return (
    <svg {...common}><Defs/>
      <rect width="320" height="180" fill={"url(#sky_"+uid+")"}/>
      <rect width="320" height="180" fill={"url(#sun_"+uid+")"}/>
      <path d="M118 14 L202 14 L266 168 L54 168 Z" fill={"url(#grass_"+uid+")"}/>
      <path d="M118 14 L130 14 L82 168 L54 168 Z" fill="#5f9c6f" opacity="0.5"/>
      <path d="M202 14 L190 14 L238 168 L266 168 Z" fill="#5f9c6f" opacity="0.5"/>
      {tee(160,158)}
      <path d="M160 156 L 172 22" stroke="#e8b84b" strokeWidth="2.2" strokeDasharray="5 4" fill="none" opacity="0.85"/>
      {ball(172,22,6)}
    </svg>
  );

  if(pattern==="grid") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {flag(232,72)}
      {[[-20,-12],[16,-4],[-6,12],[22,16],[-24,4],[8,-18]].map((d,i)=>(
        <g key={i}>{ball(232+d[0],74+d[1]+30,4.5)}</g>
      ))}
    </Scene></svg>
  );

  if(pattern==="pressure") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {ball(112,128)}
      {flag(168,118)}
      <circle cx="168" cy="130" r="24" fill="none" stroke="#e05252" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.6"/>
      <path d="M120 127 Q 142 108 162 122" stroke="#1a2f4a" strokeWidth="1.8" strokeDasharray="3 3" fill="none" opacity="0.6"/>
    </Scene></svg>
  );

  if(pattern==="balance") return (
    <svg {...common}><Defs/>
      <rect width="320" height="180" fill={"url(#sky_"+uid+")"}/>
      <rect width="320" height="180" fill={"url(#sun_"+uid+")"}/>
      <path d="M0 120 Q 160 105 320 120 L320 180 L0 180 Z" fill={"url(#grass_"+uid+")"}/>
      <ellipse cx="160" cy="148" rx="64" ry="15" fill="#1a2f4a" opacity="0.1"/>
      <circle cx="140" cy="138" r="4.5" fill="#1a2f4a"/>
      <circle cx="180" cy="138" r="4.5" fill="#1a2f4a"/>
      {ball(160,118,7)}
      <line x1="160" y1="68" x2="160" y2="112" stroke="#1a2f4a" strokeWidth="2.5"/>
    </svg>
  );

  if(pattern==="wedge") return (
    <svg {...common}><Defs/>
      <rect width="320" height="180" fill={"url(#sky_"+uid+")"}/>
      <rect width="320" height="180" fill={"url(#sun_"+uid+")"}/>
      <path d="M0 118 Q 160 102 320 118 L320 180 L0 180 Z" fill={"url(#grass_"+uid+")"}/>
      <ellipse cx="270" cy="146" rx="42" ry="18" fill={"url(#green_"+uid+")"}/>
      {tee(58,146)}
      {[0.5,0.75,1].map((s,i)=>(
        <path key={i} d={"M58 142 Q "+(122+i*38)+" "+(48-i*10)+" "+(186+i*56)+" 132"} stroke="#e8b84b" strokeWidth="2" strokeDasharray="5 4" fill="none" opacity={0.4+i*0.3}/>
      ))}
      {ball(58,143,5)}
    </svg>
  );

  if(pattern==="trouble") return (
    <svg {...common}><Defs/>
      <rect width="320" height="180" fill={"url(#sky_"+uid+")"}/>
      <rect width="320" height="180" fill={"url(#sun_"+uid+")"}/>
      <path d="M0 118 Q 160 102 320 118 L320 180 L0 180 Z" fill={"url(#grass_"+uid+")"}/>
      <ellipse cx="252" cy="148" rx="52" ry="18" fill={"url(#green_"+uid+")"}/>
      <ellipse cx="144" cy="78" rx="26" ry="30" fill="#3a7d4a" opacity="0.45"/>
      <ellipse cx="156" cy="64" rx="20" ry="24" fill="#2f6840" opacity="0.5"/>
      {tee(72,148)}
      <path d="M72 144 Q 112 96 252 132" stroke="#e8b84b" strokeWidth="2.2" strokeDasharray="5 4" fill="none" opacity="0.85"/>
      {ball(72,145,5)}
    </svg>
  );

  // Dead-straight line to the hole — no gate tees, since this drill has no
  // gate. Distinct from "gate" (which shows the tee-gate apparatus) and from
  // "curve" below (which bends).
  if(pattern==="straight") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {ball(58,132)}
      <path d="M66 131 L 244 78" stroke="#1a2f4a" strokeWidth="2" fill="none" opacity="0.6"/>
      {flag(254,74)}
    </Scene></svg>
  );

  // A visibly BENDING line to the hole — for breaking putts. Deliberately an
  // S-curve, not a straight dashed line, so the picture doesn't contradict
  // the skill (reading and committing to a break) being trained.
  if(pattern==="curve") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {ball(56,140)}
      <path d="M64 138 Q 120 150 170 118 T 246 76" stroke="#e8b84b" strokeWidth="2.2" strokeDasharray="5 4" fill="none" opacity="0.85"/>
      {flag(256,72)}
    </Scene></svg>
  );

  // A single point target (a tee stuck in the green, with a tight proximity
  // ring) rather than "towel"'s rectangular landing zone — for drills whose
  // target is literally a tee, not a zone.
  if(pattern==="teetarget") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {ball(54,140)}
      {tee(210,110)}
      <circle cx="210" cy="122" r="14" fill="none" stroke="#e8b84b" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.7"/>
      <path d="M62 138 Q 140 92 202 116" stroke="#1a2f4a" strokeWidth="1.8" strokeDasharray="5 4" fill="none" opacity="0.55"/>
    </Scene></svg>
  );

  // Low, flat, ROLLING shot along the grass — no sand. Exists specifically
  // so bump-and-run-style ground shots stop borrowing the bunker illustration,
  // which wrongly implies sand. The path stays close to the ground the whole
  // way, unlike wedge/bunker's high lofted arcs.
  if(pattern==="roll") return (
    <svg {...common}><Defs/><Scene>
      {green}
      {ball(50,142,5)}
      {flag(226,120)}
      <path d="M56 140 Q 130 136 220 122" stroke="#1a2f4a" strokeWidth="2" strokeDasharray="2 3" fill="none" opacity="0.6"/>
    </Scene></svg>
  );

  // An inclined lie — for uphill/downhill stance drills and two-tier-green
  // speed control. A side-on tilted ground plane with the ball resting on
  // the slope, distinct from "balance" (flat ground, upright stance) below.
  if(pattern==="slope") return (
    <svg {...common}><Defs/>
      <rect width="320" height="180" fill={"url(#sky_"+uid+")"}/>
      <rect width="320" height="180" fill={"url(#sun_"+uid+")"}/>
      <path d="M0 150 L 320 90 L 320 180 L 0 180 Z" fill={"url(#grass_"+uid+")"}/>
      {ball(190,110,6)}
      <line x1="0" y1="150" x2="320" y2="90" stroke="#1a2f4a" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35"/>
    </svg>
  );

  // Deliberately NO flag or target anywhere on the canvas — just a ball,
  // the club shaft, and a ground mark just ahead of the ball. For drills
  // that are explicitly about strike quality with no target to aim at
  // (e.g. "no target — just feel the strike").
  if(pattern==="contact") return (
    <svg {...common}><Defs/>
      <rect width="320" height="180" fill={"url(#sky_"+uid+")"}/>
      <rect width="320" height="180" fill={"url(#sun_"+uid+")"}/>
      <path d="M0 118 Q 160 102 320 118 L320 180 L0 180 Z" fill={"url(#grass_"+uid+")"}/>
      <ellipse cx="196" cy="150" rx="14" ry="4" fill="#1a2f4a" opacity="0.28"/>
      {ball(178,132,6)}
      <line x1="178" y1="58" x2="178" y2="126" stroke="#1a2f4a" strokeWidth="2.5"/>
    </svg>
  );

  // Three differently-curved trajectories (draw / straight / fade) from one
  // tee converging near one target — for shot-shaping drills. No hazard —
  // this isn't a trouble shot, it's shape control on demand.
  if(pattern==="shape") return (
    <svg {...common}><Defs/>
      <rect width="320" height="180" fill={"url(#sky_"+uid+")"}/>
      <rect width="320" height="180" fill={"url(#sun_"+uid+")"}/>
      <path d="M0 150 Q 160 138 320 150 L320 180 L0 180 Z" fill={"url(#grass_"+uid+")"}/>
      {tee(58,150)}
      <path d="M58 146 Q 120 40 260 70" stroke="#3a7d4a" strokeWidth="2" strokeDasharray="4 3" fill="none" opacity="0.75"/>
      <path d="M58 146 Q 170 30 260 70" stroke="#e8b84b" strokeWidth="2" strokeDasharray="4 3" fill="none" opacity="0.8"/>
      <path d="M58 146 Q 220 40 260 70" stroke="#7c5cbf" strokeWidth="2" strokeDasharray="4 3" fill="none" opacity="0.75"/>
      {ball(58,147,5)}
      {flag(260,68)}
    </svg>
  );

  // A fan of trajectories of increasing length/height in different colors,
  // all from one tee — for "hit every club, longest to shortest" drills.
  // No dispersion/target concept (that's "grid"'s job) — this is about
  // covering the whole bag, not accuracy.
  if(pattern==="bag") return (
    <svg {...common}><Defs/>
      <rect width="320" height="180" fill={"url(#sky_"+uid+")"}/>
      <rect width="320" height="180" fill={"url(#sun_"+uid+")"}/>
      <path d="M0 150 Q 160 138 320 150 L320 180 L0 180 Z" fill={"url(#grass_"+uid+")"}/>
      {tee(50,150)}
      {[[90,30,"#3a7d4a"],[150,55,"#e8b84b"],[210,75,"#7c5cbf"],[260,95,"#1a2f4a"]].map(([len,h,c],i)=>(
        <path key={i} d={"M50 147 Q "+(50+len*0.55)+" "+(150-h)+" "+(50+len)+" 145"} stroke={c} strokeWidth="1.8" strokeDasharray="4 3" fill="none" opacity="0.6"/>
      ))}
      {ball(50,147,5)}
    </svg>
  );

  // routine / mental / generic fallback — calm focus motif, not a golf scene
  return (
    <svg {...common}>
      <defs>
        <radialGradient id={"mind_"+uid} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#ece4f7"/>
          <stop offset="100%" stopColor="#f7f4fb"/>
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={"url(#mind_"+uid+")"}/>
      <circle cx="160" cy="90" r="44" fill="#7c5cbf" opacity="0.1"/>
      <circle cx="160" cy="90" r="28" fill="#7c5cbf" opacity="0.18"/>
      <circle cx="160" cy="90" r="14" fill="#7c5cbf" opacity="0.3"/>
      <circle cx="160" cy="90" r="5" fill="#7c5cbf"/>
    </svg>
  );
}


// Maps exercise id -> diagram pattern + a short "why this works" line distinct
// from the existing `purpose` field (purpose = what it builds, this = how/why mechanically).
const EXERCISE_GUIDE = {
  // putting
  p1:{pattern:"gate", why:"The gate forces an honest read of your face angle — if the putter face opens or closes even slightly, the ball clips a tee instead of rolling through clean."},
  p2:{pattern:"circle", why:"Makeable putts from every angle build the rhythm and confidence that carries into real rounds, where most putts are inside 2 m."},
  p3:{pattern:"straight", why:"A dead-straight putt isolates pure stroke mechanics — no green-reading variable to hide behind."},
  p4:{pattern:"ladder", why:"Lag putting is about feel, not mechanics. Stopping short of going long trains the deceleration touch most amateurs never practice."},
  p5:{pattern:"circle", why:"Removing your trail hand exposes any flip or manipulation at impact — the lead hand alone can't compensate for bad technique."},
  p6:{pattern:"ladder", why:"A basic speed ladder teaches your body what different distances actually feel like before adding complexity."},
  p7:{pattern:"circle", why:"Putting from all four clock positions trains break-reading and stroke consistency simultaneously, since every angle breaks differently."},
  p8:{pattern:"ladder", why:"Matching speed across three distances trains the core skill of putting: knowing how hard to hit it, not just which way it breaks."},
  p9:{pattern:"pressure", why:"Five in a row with a reset on miss creates real stakes — your stroke under that pressure is closer to tournament golf than rote repetition."},
  p10:{pattern:"curve", why:"Reading and committing to one consistent breaking line, repeatedly, trains trust in your read instead of second-guessing mid-stroke."},
  p11:{pattern:"slope", why:"A two-tier slope punishes pace errors brutally — this is the fastest way to feel why speed matters more than line on slopes."},
  p12:{pattern:"ladder", why:"Volume at mixed distances builds a real statistical baseline of your putting, not just a good day or a bad one."},
  p13:{pattern:"pressure", why:"Pressure stacked onto short, makeable putts mirrors exactly the moments that actually cost strokes on the course."},
  p14:{pattern:"ladder", why:"Counting total putts taken (not just makes) reveals how costly one miss really is, since it adds a penalty stroke instantly."},
  p15:{pattern:"ladder", why:"Long lag putts separate good putters from great ones — most rounds are lost to 3-putts from distance, not missed tap-ins."},
  // shortGame
  s1:{pattern:"towel", why:"Up and down from a fixed spot teaches the two-shot sequence as one skill, not two separate shots."},
  s2:{pattern:"towel", why:"Landing on a specific spot trains trajectory control — the single biggest skill gap between good and great short games."},
  s3:{pattern:"teetarget", why:"A tee as a target removes the temptation to just 'get it close' — it forces precision."},
  s4:{pattern:"ladder", why:"Hitting three different distances with the same motion trains touch and feel rather than memorized swings."},
  s5:{pattern:"roll", why:"Low, running shots are lower risk than the flop — mastering this first builds a reliable go-to before adding aggressive options."},
  s6:{pattern:"grid", why:"Comparing clubs from the same spot reveals which option you control best — that becomes your default, removing decision fatigue on course."},
  s7:{pattern:"bunker", why:"Sand technique is almost entirely about contact point, not power — repetition here builds the feel for hitting the sand, not the ball."},
  s8:{pattern:"towel", why:"A longer pitch demands full-swing rhythm at a shorter length — most miss-hits here come from rushing the tempo."},
  s9:{pattern:"slope", why:"Slopes change your low point and balance — practicing both uphill and downhill builds adaptability you can't get on flat ground."},
  s10:{pattern:"wedge", why:"A high, soft shot only works with full commitment to the technique — half-effort attempts usually come up short or skull it."},
  s11:{pattern:"grid", why:"Five different lies in one session forces rapid adjustment — exactly the skill scrambling on course demands."},
  s12:{pattern:"grid", why:"Eighteen simulated situations builds the stamina and consistency of a real round's worth of scrambling chances."},
  s13:{pattern:"pressure", why:"No practice swing or redo mirrors real conditions — committing cold to a shot is a skill on its own."},
  // longGame
  l1:{pattern:"contact", why:"Pure focus on contact (no target) removes outcome pressure so you can feel what a centred strike actually feels like."},
  l2:{pattern:"balance", why:"Slowing the swing down exposes sequencing flaws that are invisible at full speed."},
  l3:{pattern:"balance", why:"Feet together removes the ability to sway, forcing the turn to come from rotation instead of weight-shifting compensation."},
  l4:{pattern:"contact", why:"Training your low point relative to the ball builds the ball-then-turf contact that separates clean strikes from fat or thin shots."},
  l5:{pattern:"fairway", why:"A defined corridor gives you a real pass/fail target instead of a vague sense of 'hit it well.'"},
  l6:{pattern:"grid", why:"A fixed distance with volume builds a true dispersion pattern — you'll see your real miss tendency, not just guess at it."},
  l7:{pattern:"shape", why:"Shaping shots on demand proves you control ball flight rather than just reacting to whatever the club gives you."},
  l8:{pattern:"wedge", why:"Wedge distances are the most controllable in the bag — calibrating effort levels here directly lowers your scores inside 100m."},
  l9:{pattern:"grid", why:"Repeating one shot at one target with no variation isolates pure consistency, separate from skill variety."},
  l10:{pattern:"fairway", why:"Simulating real hole distances under no extra pressure builds course-realistic practice instead of abstract range work."},
  l11:{pattern:"bag", why:"Rating every club in the bag honestly reveals which ones you trust and which ones need work — most players guess wrong here."},
  l12:{pattern:"fairway", why:"A narrow corridor under self-imposed pressure is the closest range simulation gets to a tight tee shot that actually matters."},
  l13:{pattern:"trouble", why:"Recovery shots are inevitable in real rounds — rehearsing them removes the panic that turns one bad shot into three."},
  // mental
  m1:{pattern:"routine", why:"A repeatable routine reduces decision fatigue and anxiety, because your body already knows what comes next."},
  m2:{pattern:"routine", why:"Visualizing the shot primes your nervous system for the actual motion — elite performers across sports use this for a reason."},
  m3:{pattern:"routine", why:"One breath interrupts the spiral after a bad shot before it compounds into the next one."},
  m4:{pattern:"routine", why:"Fast, full commitment beats a slow, doubt-filled decision almost every time in golf — hesitation causes more bad shots than bad swings."},
  m5:{pattern:"pressure", why:"Self-imposed pressure on a single putt rehearses the exact mental state you'll feel over a putt that actually matters."},
  m6:{pattern:"routine", why:"Practicing the recovery, not just the good shot, builds the resilience that prevents one mistake from becoming three."},
  m7:{pattern:"routine", why:"Fatigue reveals whether your routine is real or just habit — quality late in a session predicts quality late in a round."},
  m8:{pattern:"pressure", why:"Simulated stakes activate the same nervous system response as real competition, which is the only way to practice composure."},
  m9:{pattern:"routine", why:"Scoring process instead of outcome retrains your brain to value what you control, which paradoxically improves results over time."},
};
function guideFor(exId){ return EXERCISE_GUIDE[exId] || {pattern:"generic", why:""}; }

// French translations for exercise content (name, purpose, desc, label) + guide why-text
const EX_FR = {
  p1:{name:"Exercice de la Porte",purpose:"Controle de l'angle et de la trajectoire",desc:"Placez deux tees legerement plus larges que la tete de votre putter, 15 cm devant la balle. Faites 20 putts depuis 1 m a travers la porte.",label:"Reussis"},
  p2:{name:"Confiance Courts Putts",purpose:"Routine et confiance sur les putts courts",desc:"Placez 10 balles en cercle a 30 cm du trou et reussissez les 10, puis passez a 60 cm et puttez 10 de plus (20 putts au total).",label:"Consecutifs reussis"},
  p3:{name:"Putt Droit",purpose:"Mecanique du putt et tempo",desc:"Trouvez le putt le plus droit sur le green. Faites 15 putts depuis 1 m avec un mouvement de pendule fluide.",label:"Reussis"},
  p4:{name:"Lag vers la Frange",purpose:"Controle de distance et vitesse",desc:"Depuis 9 m, arretez 10 balles a moins de 15 cm de la frange sans la depasser.",label:"Arretees dans la zone"},
  p5:{name:"Exercice a Une Main",purpose:"Sensations et evite le flip du poignet",desc:"Puttez 10 balles avec seulement votre main directrice depuis 1.2 m. Developpe les sensations et evite le flip a l'impact.",label:"Reussis"},
  p6:{name:"Echelle vers le Trou",purpose:"Jugement de vitesse de base",desc:"Puttez une balle depuis 2 m, 4 m, 6 m, et 8 m, en visant a finir apres le trou mais a moins de 1 m. Repetez l'echelle 3 fois (12 putts au total).",label:"Dans la zone (sur 12)"},
  p7:{name:"Exercice de l'Horloge",purpose:"Constance depuis tous les angles",desc:"Placez 4 balles a 1 m autour du trou comme une horloge et puttez chacune. Completez le cercle entier sans rater, puis repetez pour 3 tours complets (12 putts au total).",label:"Consecutifs reussis"},
  p8:{name:"Echelle de Distance",purpose:"Calibrage de la vitesse",desc:"Puttez vers des cibles a 3 m, 6 m, et 9 m, en marquant un point chaque fois que la balle s'arrete a moins d'une longueur de club. 5 tentatives a chaque distance (15 putts au total).",label:"Points marques"},
  p9:{name:"Pression a 1.5m",purpose:"Performance sous pression",desc:"Reussissez 5 putts de suite depuis 1.5 m. Chaque rate remet le compteur a zero. Vous avez jusqu'a 20 tentatives pour reussir la serie — notez combien de tentatives il vous a fallu.",label:"Tentatives pour reussir"},
  p10:{name:"Putt avec Effet",purpose:"Lecture du break",desc:"Trouvez un putt avec un break constant a 2.5 m. Faites 10 putts en suivant la ligne de depart. Reussissez-en 6+ pour passer.",label:"Reussis"},
  p11:{name:"Vitesse a Deux Niveaux",purpose:"Controle de vitesse sur pentes",desc:"Trouvez un green a deux niveaux ou une pente. Puttez 10 balles du niveau bas vers un trou sur le niveau haut, en vous concentrant uniquement sur la vitesse.",label:"A moins de 1 m"},
  p12:{name:"100 Putts",purpose:"Endurance et reference de base",desc:"Faites 100 putts depuis des distances entre 1 et 6 m, en melangeant lignes droites et breaks tout au long. Suivez chaque putt reussi.",label:"Reussis"},
  p13:{name:"Pression 18",purpose:"Simulation de tournoi",desc:"Jouez 18 situations de pression au putting : 6 depuis 1.2 m, 6 depuis 1.8 m, et 6 depuis 2.4 m. Marquez 2 points pour un putt reussi net, 1 point pour un tap-in apres un quasi-rate, 0 point pour un 3-putt (36 points possibles).",label:"Points"},
  p14:{name:"Circuit 3-6-9",purpose:"Scoring depuis courte distance",desc:"Reussissez 3 putts a 1 m, 3 a 2 m, et 3 a 3 m sans rater (9 putts si parfait). Chaque rate ajoute un putt de penalite a votre total — notez le total de putts pour finir les 9.",label:"Total des putts"},
  p15:{name:"Marathon de Lag Putt",purpose:"Controle de distance sur longs putts",desc:"Faites 15 putts de 12-15 m, tous vers des trous differents. Marquez 2 points si la balle finit a moins de 1 m (zone de 2-putt sure), 0 point au-dela (30 points possibles).",label:"Points"},
  s1:{name:"Up and Down",purpose:"Chipping de base et finition",desc:"Depuis 5 m du green, chippez et puttez. 10 tentatives. Comptez les up and down reussis.",label:"Up and downs"},
  s2:{name:"Zone d'Atterrissage",purpose:"Conscience du point d'atterrissage",desc:"Placez une serviette a 1 m sur le green. Depuis 9 m, frappez 15 coups en essayant d'atterrir sur la serviette. Choisissez le club qui donne un vol bas et controle.",label:"Coups sur la serviette"},
  s3:{name:"Chip vers un Tee",purpose:"Controle de proximite et precision",desc:"Plantez un tee a 2 m du bord du green. Depuis 7 m, frappez 10 coups a moins de 1 m du tee.",label:"A moins de 1 m"},
  s4:{name:"Chips en Echelle",purpose:"Controle de distance sur les chips",desc:"Depuis le meme endroit, chippez 3 balles vers une cible proche, 3 vers une cible moyenne, et 3 vers une cible lointaine, toutes sur le green (9 chips au total). Adaptez uniquement la longueur de votre geste a la distance.",label:"Sur la cible (sur 9)"},
  s5:{name:"Bump and Run",purpose:"Controle du coup roule a trajectoire basse",desc:"Depuis 18 m, faites un bump and run vers un trou precis avec un coup bas et roulant. 10 tentatives, suivez la precision a 2 m.",label:"A moins de 2 m"},
  s6:{name:"Choisissez Votre Club",purpose:"Confiance dans le choix du club",desc:"Depuis 14 m, frappez 15 coups en utilisant les 3 clubs que vous choisiriez naturellement pour ce coup. Notez lequel donne le resultat le plus constant — c'est votre club de reference.",label:"A moins de 1.2 m"},
  s7:{name:"Sortie de Bunker",purpose:"Technique de sable",desc:"Depuis un bunker pres du green, sortez 10 balles sur le green. Suivez combien finissent a moins de 3 m du drapeau.",label:"Balles sur le green"},
  s8:{name:"Precision de Pitch",purpose:"Controle de distance au wedge",desc:"Depuis 27 m, frappez 10 pitchs. Atterrissez a moins de 3 m et arretez-vous a moins de 4.5 m au total.",label:"A moins de 4.5 m"},
  s9:{name:"Pentes Montantes / Descendantes",purpose:"Adaptation a la pente",desc:"Trouvez une position en montee et une en descente pres du green. Faites 5 chips de chaque (10 au total), en vous concentrant sur un contact solide et le controle de la distance malgre la pente.",label:"Up and downs"},
  s10:{name:"Flop Shot",purpose:"Maitrise de la trajectoire haute",desc:"Au-dessus d'un obstacle depuis 14 m, frappez 10 coups hauts et doux. Doit atterrir sur le green et s'arreter a moins de 2.5 m.",label:"Flops reussis"},
  s11:{name:"Circuit de Petit Jeu",purpose:"Constance complete du petit jeu",desc:"Installez 5 stations autour du green a distances et positions variees : chip, pitch, flop haut, bunker, position difficile. Faites 5 balles a chaque station (25 au total) et suivez les up and downs partout.",label:"Up and downs"},
  s12:{name:"18 Up and Downs",purpose:"Endurance au scrambling",desc:"Simulez 18 situations de petit jeu : 6 depuis le rough, 6 depuis le sable, 6 depuis des positions difficiles, toutes a moins de 20 m du green.",label:"Up and downs"},
  s13:{name:"Une Balle, Sans Repetition",purpose:"Engagement sans coup d'essai",desc:"Marchez vers 10 endroits aleatoires a moins de 20 m du green. Frappez un coup depuis chacun sans coup d'essai ni reprise, exactement comme sur le parcours. Suivez les up and downs.",label:"Up and downs"},
  l1:{name:"Exercice d'Alignement",purpose:"Position et alignement",desc:"Utilisez des batons d'alignement. Frappez 20 coups de fer moyen en vous concentrant uniquement sur un contact solide et centre. Pas de cible — ressentez juste la frappe.",label:"Contacts solides"},
  l2:{name:"Swings au Ralenti",purpose:"Plan de swing et sequencement",desc:"Frappez 15 balles a environ 50% de vitesse avec un fer moyen, en gardant le club sur le plan et en finissant en equilibre. Notez chaque swing de 1 a 3 selon son controle.",label:"Finitions equilibrees"},
  l3:{name:"Pieds Joints",purpose:"Equilibre et rythme",desc:"Frappez 15 balles avec les pieds joints en utilisant n'importe quel fer. Cela force le bon transfert de poids et un rythme plus naturel.",label:"Contacts propres"},
  l4:{name:"Controle du Point Bas",purpose:"Contact balle puis gazon",desc:"Tracez une ligne dans l'herbe ou utilisez une ligne de spray. Frappez 15 coups de fer moyen en essayant de prendre un divot juste devant la ligne chaque fois.",label:"Point bas correct"},
  l5:{name:"Precision au Driver",purpose:"Precision au driver",desc:"Frappez 10 coups de depart au driver vers un couloir de fairway defini. Suivez combien vous touchez et de quel cote vous avez tendance a rater.",label:"Fairways atteints"},
  l6:{name:"Precision Fer a 130m",purpose:"Dispersion des fers a moyenne distance",desc:"Choisissez une cible a 130 m. Utilisez le club que vous frapperiez normalement a cette distance. 15 coups, suivez combien finissent a moins de 18 m de la cible.",label:"Sur la cible"},
  l7:{name:"Matrice 9 Coups",purpose:"Controle de la trajectoire de balle",desc:"Frappez 9 coups avec un seul club : haut, moyen, bas combines avec draw, droit, fade. 1 point par trajectoire intentionnelle reussie.",label:"Trajectoires reussies"},
  l8:{name:"Echelle de Distance Wedge",purpose:"Calibrage du swing partiel",desc:"Frappez 5 balles a 50%, 75%, et 100% de vitesse de swing avec votre wedge le plus court (15 coups au total). Notez la distance de chaque niveau d'effort — cela devient votre carte de distances personnelle.",label:"A moins de 5 m de l'objectif"},
  l9:{name:"Repetabilite du Coup Standard",purpose:"Constance sans pression",desc:"Choisissez un club et une cible. Frappez 15 coups en essayant de repeter exactement le meme coup chaque fois. Suivez combien finissent dans un cercle de 10 m.",label:"A moins de 10 m"},
  l10:{name:"Simulation Par 3",purpose:"Jeu de fer sous pression",desc:"Simulez 9 trous de par 3 a distances variees de 90 a 165 m. Choisissez des cibles et clubs realistes. Suivez les greens atteints.",label:"Greens atteints"},
  l11:{name:"Defi du Sac Complet",purpose:"Constance de tout le sac",desc:"Frappez 2 coups avec chaque club de votre sac, du plus long au plus court. Notez votre meilleur coup par club : 0 mauvais, 1 correct, 2 excellent — additionnez vos points sur tous les clubs.",label:"Points"},
  l12:{name:"Driver Sous Pression",purpose:"Performance sous stress",desc:"Frappez 10 coups de driver vers le couloir le plus etroit que vous puissiez realistement definir — simulant le coup de depart le plus serre que vous rencontreriez sur votre parcours.",label:"Fairways atteints"},
  l13:{name:"Coups de Recuperation",purpose:"Competences de recuperation",desc:"Simulez 10 situations difficiles : coup sous une branche, draw autour d'un obstacle, ou fade au-dessus d'un probleme. Notez chaque coup de 0 (echec) a 2 (execute comme prevu) — 20 points possibles.",label:"Points"},
  m1:{name:"Routine Pre-Coup",purpose:"Construire une routine repetable",desc:"Au practice, frappez 15 coups en utilisant exactement la meme routine pre-coup chaque fois : meme nombre de regards vers la cible, meme mouvement, meme respiration. Notez la constance de votre routine, 1 a 3.",label:"Routines constantes"},
  m2:{name:"Repetitions de Visualisation",purpose:"Imagerie mentale avant le contact",desc:"Avant chacun de 10 coups, fermez les yeux 3 secondes et imaginez le vol complet de la balle atterrissant sur la cible. Puis frappez. Notez la clarte de votre vision, 1 a 3.",label:"Visualisations claires"},
  m3:{name:"Reset en Une Respiration",purpose:"Se reinitialiser apres un mauvais coup",desc:"Frappez 15 coups. Apres chaque coup qui vous deplait, prenez une respiration lente avant d'aller a la balle suivante — ne reagissez jamais, respirez et reinitialisez. Suivez combien de resets vous avez geres calmement.",label:"Resets calmes"},
  m4:{name:"Exercice d'Engagement",purpose:"Faire confiance a votre lecture ou plan",desc:"Sur 10 coups ou putts, choisissez votre cible et club en moins de 10 secondes, puis engagez-vous completement sans aucun doute. Suivez combien vous avez engages sans hesitation.",label:"Coups engages"},
  m5:{name:"Simulation de Putt sous Pression",purpose:"Performer sous pression simulee",desc:"Installez-vous pour un putt de 2 m. Dites-vous que ce putt decide du match. Faites cela 10 fois separement, en vous eloignant et en reinitialisant entre chaque. Suivez les reussites sous pression auto-imposee.",label:"Reussis sous pression"},
  m6:{name:"Recuperation Apres Mauvais Coup",purpose:"Rebondir immediatement",desc:"Essayez deliberement de frapper un mauvais coup, puis immediatement enchainez avec votre meilleur coup juste apres. Repetez 8 fois. Suivez combien de coups de recuperation etaient vraiment bons.",label:"Bonnes recuperations"},
  m7:{name:"Concentration sous Fatigue",purpose:"Maintenir la qualite en fin de seance",desc:"Apres une seance complete quand vous etes fatigue, frappez 10 coups supplementaires avec routine et engagement complets. Suivez combien correspondent a la qualite du debut de seance.",label:"Coups de qualite"},
  m8:{name:"Simulation de Tournoi",purpose:"Simulation complete de pression",desc:"Jouez ou simulez 9 trous en notant comme si c'etait une vraie competition avec un enjeu. Observez votre discours interieur et votre respiration sous cette pression. Notez votre sang-froid mental par trou, 1 a 3.",label:"Trous maitrises"},
  m9:{name:"Processus avant Resultat",purpose:"Se detacher des resultats",desc:"Frappez 15 coups, mais notez-vous uniquement sur la qualite de routine et d'engagement — ignorez completement ou va la balle. Cela redirige le focus vers ce que vous controlez.",label:"Repetitions de qualite"},
};
const EX_ES = {
  p1:{name:"Ejercicio de la Puerta",purpose:"Control del angulo de cara y trayectoria",desc:"Coloca dos tees un poco mas anchos que la cabeza de tu putter, 15 cm delante de la bola. Haz 20 putts desde 1 m a traves de la puerta.",label:"Embocados"},
  p2:{name:"Confianza en Putts Cortos",purpose:"Rutina y confianza en putts cortos",desc:"Coloca 10 bolas en circulo a 30 cm del hoyo y embocalas todas, luego pasa a 60 cm y putea 10 mas (20 putts en total).",label:"Consecutivos embocados"},
  p3:{name:"Putt Recto",purpose:"Mecanica del putt y tempo",desc:"Encuentra el putt mas recto en el green. Haz 15 putts desde 1 m con un movimiento de pendulo suave.",label:"Embocados"},
  p4:{name:"Lag hacia el Borde",purpose:"Control de distancia y velocidad",desc:"Desde 9 m, detén 10 bolas a menos de 15 cm del borde sin pasarlo.",label:"Detenidas en zona"},
  p5:{name:"Ejercicio a Una Mano",purpose:"Sensibilidad y evita el latigazo de muneca",desc:"Putea 10 bolas solo con tu mano guia desde 1.2 m. Desarrolla sensibilidad y evita el latigazo en el impacto.",label:"Embocados"},
  p6:{name:"Escalera hacia el Hoyo",purpose:"Juicio basico de velocidad",desc:"Putea una bola desde 2 m, 4 m, 6 m, y 8 m, buscando pasar el hoyo pero quedar a menos de 1 m. Repite la escalera 3 veces (12 putts en total).",label:"En zona (de 12)"},
  p7:{name:"Ejercicio del Reloj",purpose:"Consistencia desde todos los angulos",desc:"Coloca 4 bolas a 1 m alrededor del hoyo como un reloj y putea cada una. Completa el circulo entero sin fallar, luego repite 3 rondas completas (12 putts en total).",label:"Consecutivos embocados"},
  p8:{name:"Escalera de Distancia",purpose:"Calibracion de velocidad",desc:"Putea hacia objetivos a 3 m, 6 m, y 9 m, anotando un punto cada vez que la bola se detiene a menos de un largo de palo. 5 intentos en cada distancia (15 putts en total).",label:"Puntos obtenidos"},
  p9:{name:"Presion a 1.5m",purpose:"Rendimiento bajo presion",desc:"Emboca 5 putts seguidos desde 1.5 m. Cada fallo reinicia el contador a cero. Tienes hasta 20 intentos para completar la racha — anota cuantos intentos te tomo.",label:"Intentos para completar"},
  p10:{name:"Putt con Curva",purpose:"Lectura de la curva",desc:"Encuentra un putt con curva consistente a 2.5 m. Haz 10 putts siguiendo la linea de salida. Emboca 6+ para pasar.",label:"Embocados"},
  p11:{name:"Velocidad en Dos Niveles",purpose:"Control de velocidad en pendientes",desc:"Encuentra un green de dos niveles o una pendiente. Putea 10 bolas desde el nivel inferior hacia un hoyo en el nivel superior, enfocandote solo en la velocidad correcta.",label:"A menos de 1 m"},
  p12:{name:"100 Putts",purpose:"Resistencia y linea base",desc:"Haz 100 putts desde distancias entre 1 y 6 m, mezclando lineas rectas y con curva durante todo el ejercicio. Registra cada putt que embocas.",label:"Embocados"},
  p13:{name:"Presion 18",purpose:"Simulacion de torneo",desc:"Juega 18 situaciones de presion en el putt: 6 desde 1.2 m, 6 desde 1.8 m, y 6 desde 2.4 m. Anota 2 puntos por un putt limpio, 1 punto por un tap-in tras un casi-fallo, 0 puntos por un 3-putt (36 puntos posibles).",label:"Puntos"},
  p14:{name:"Circuito 3-6-9",purpose:"Anotar desde corta distancia",desc:"Emboca 3 putts a 1 m, 3 a 2 m, y 3 a 3 m sin fallar (9 putts si es perfecto). Cada fallo anade un putt de penalizacion a tu total — anota el total de putts para terminar los 9.",label:"Total de putts"},
  p15:{name:"Maraton de Lag Putt",purpose:"Control de distancia en putts largos",desc:"Haz 15 putts de 12-15 m, todos a hoyos diferentes. Anota 2 puntos si la bola queda a menos de 1 m (zona segura de 2-putt), 0 puntos mas alla (30 puntos posibles).",label:"Puntos"},
  s1:{name:"Up and Down",purpose:"Chipping basico y finalizacion",desc:"Desde 5 m del green, haz chip y putt. 10 intentos. Cuenta los up and down logrados.",label:"Up and downs"},
  s2:{name:"Zona de Aterrizaje",purpose:"Conciencia del punto de aterrizaje",desc:"Coloca una toalla a 1 m en el green. Desde 9 m, golpea 15 tiros intentando aterrizar en la toalla. Elige el palo que de un vuelo bajo y controlado.",label:"Aciertos en la toalla"},
  s3:{name:"Chip hacia un Tee",purpose:"Control de proximidad y precision",desc:"Coloca un tee a 2 m del borde del green. Desde 7 m, golpea 10 tiros a menos de 1 m del tee.",label:"A menos de 1 m"},
  s4:{name:"Chips en Escalera",purpose:"Control de distancia en chips",desc:"Desde el mismo lugar, haz chip de 3 bolas a un objetivo cercano, 3 a uno medio, y 3 a uno lejano, todos en el green (9 chips en total). Ajusta solo la longitud de tu swing a la distancia.",label:"En objetivo (de 9)"},
  s5:{name:"Bump and Run",purpose:"Control de tiro bajo y rodado",desc:"Desde 18 m, haz un bump and run hacia un hoyo especifico con un tiro bajo y rodado. 10 intentos, registra precision a 2 m.",label:"A menos de 2 m"},
  s6:{name:"Elige Tu Palo",purpose:"Confianza en la seleccion de palo",desc:"Desde 14 m, golpea 15 tiros usando los 3 palos que elegirias naturalmente para este tiro. Observa cual da el resultado mas consistente — ese es tu palo de referencia.",label:"A menos de 1.2 m"},
  s7:{name:"Salida de Bunker",purpose:"Tecnica de arena",desc:"Desde un bunker junto al green, saca 10 bolas al green. Registra cuantas terminan a menos de 3 m de la bandera.",label:"Bolas en el green"},
  s8:{name:"Precision de Pitch",purpose:"Control de distancia con wedge",desc:"Desde 27 m, golpea 10 pitches. Aterriza a menos de 3 m y detente a menos de 4.5 m en total.",label:"A menos de 4.5 m"},
  s9:{name:"Pendientes Arriba / Abajo",purpose:"Adaptacion a la pendiente",desc:"Encuentra una posicion cuesta arriba y una cuesta abajo cerca del green. Haz 5 chips de cada una (10 en total), enfocandote en contacto solido y control de distancia a pesar de la pendiente.",label:"Up and downs"},
  s10:{name:"Flop Shot",purpose:"Dominio de trayectoria alta",desc:"Sobre un obstaculo desde 14 m, golpea 10 tiros altos y suaves. Debe aterrizar en el green y detenerse a menos de 2.5 m.",label:"Flops exitosos"},
  s11:{name:"Circuito de Juego Corto",purpose:"Consistencia completa del juego corto",desc:"Monta 5 estaciones alrededor del green a distancias y posiciones variadas: chip, pitch, flop alto, bunker, posicion incomoda. Haz 5 bolas en cada estacion (25 en total) y registra up and downs en todas.",label:"Up and downs"},
  s12:{name:"18 Up and Downs",purpose:"Resistencia en scrambling",desc:"Simula 18 situaciones de juego corto: 6 desde rough, 6 desde arena, 6 desde posiciones dificiles, todas a menos de 20 m del green.",label:"Up and downs"},
  s13:{name:"Una Bola, Sin Repeticion",purpose:"Compromiso sin swing de practica",desc:"Camina a 10 puntos aleatorios a menos de 20 m del green. Golpea un tiro desde cada uno sin swing de practica ni repeticion, exactamente como en el campo. Registra up and downs.",label:"Up and downs"},
  l1:{name:"Ejercicio de Alineacion",purpose:"Postura y alineacion",desc:"Usa varillas de alineacion. Golpea 20 tiros de hierro medio enfocandote solo en contacto solido y centrado. Sin objetivo — solo siente el golpe.",label:"Contactos solidos"},
  l2:{name:"Swings en Camara Lenta",purpose:"Plano de swing y secuencia",desc:"Golpea 15 bolas al 50% de velocidad con un hierro medio, manteniendo el palo en el plano y terminando en equilibrio. Califica cada swing del 1 al 3 segun su control.",label:"Finales equilibrados"},
  l3:{name:"Pies Juntos",purpose:"Equilibrio y ritmo",desc:"Golpea 15 bolas con los pies juntos usando cualquier hierro. Esto fuerza la transferencia de peso correcta y un ritmo mas natural.",label:"Contactos limpios"},
  l4:{name:"Control del Punto Bajo",purpose:"Contacto bola-luego-cesped",desc:"Dibuja una linea en el pasto o usa una linea de spray. Golpea 15 tiros de hierro medio intentando tomar el divot justo delante de la linea cada vez.",label:"Punto bajo correcto"},
  l5:{name:"Precision con Driver",purpose:"Precision con el driver",desc:"Golpea 10 tiros de salida con tu driver hacia un corredor de calle definido. Registra cuantos aciertas y de que lado tiendes a fallar.",label:"Calles acertadas"},
  l6:{name:"Precision de Hierro a 130m",purpose:"Dispersion de hierros a media distancia",desc:"Elige un objetivo a 130 m. Usa el palo que normalmente usarias a esa distancia. 15 tiros, registra cuantos terminan a menos de 18 m del objetivo.",label:"En el objetivo"},
  l7:{name:"Matriz de 9 Tiros",purpose:"Control de la forma del tiro",desc:"Golpea 9 tiros con un palo: alto, medio, bajo combinados con draw, recto, fade. 1 punto por forma intencional lograda.",label:"Formas logradas"},
  l8:{name:"Escalera de Distancia de Wedge",purpose:"Calibracion de swing parcial",desc:"Golpea 5 bolas al 50%, 75%, y 100% de velocidad de swing con tu wedge mas corto (15 tiros en total). Anota cuanto llega cada nivel de esfuerzo — esto se convierte en tu tabla personal de distancias.",label:"A menos de 5 m de lo previsto"},
  l9:{name:"Repetibilidad del Tiro Base",purpose:"Consistencia sin presion",desc:"Elige un palo y un objetivo. Golpea 15 tiros intentando repetir exactamente el mismo tiro cada vez. Registra cuantos terminan en un circulo de 10 m.",label:"A menos de 10 m"},
  l10:{name:"Simulacion de Par 3",purpose:"Juego de hierros bajo presion",desc:"Simula 9 hoyos par 3 a distancias variadas de 90 a 165 m. Elige objetivos y palos realistas. Registra greens en regulacion.",label:"Greens logrados"},
  l11:{name:"Desafio de Bolsa Completa",purpose:"Consistencia de toda la bolsa",desc:"Golpea 2 tiros con cada palo de tu bolsa, del mas largo al mas corto. Califica tu mejor tiro con cada palo: 0 malo, 1 regular, 2 excelente — suma tus puntos en todos los palos.",label:"Puntos"},
  l12:{name:"Driver Bajo Presion",purpose:"Rendimiento bajo estres",desc:"Golpea 10 tiros de driver hacia el corredor mas estrecho que puedas definir realisticamente — simulando el tiro de salida mas exigente que enfrentarias en tu campo habitual.",label:"Calles acertadas"},
  l13:{name:"Tiros de Problemas",purpose:"Habilidades de recuperacion",desc:"Simula 10 situaciones problematicas: golpe bajo una rama, draw alrededor de un obstaculo, o fade sobre problemas. Califica cada tiro de 0 (fallido) a 2 (ejecutado segun el plan) — 20 puntos posibles.",label:"Puntos"},
  m1:{name:"Constructor de Rutina Pre-Tiro",purpose:"Construir una rutina repetible",desc:"En el campo de practica, golpea 15 tiros usando exactamente la misma rutina pre-tiro cada vez: mismo numero de miradas al objetivo, mismo movimiento, misma respiracion. Califica que tan consistente se sintio tu rutina, 1 a 3.",label:"Rutinas consistentes"},
  m2:{name:"Repeticiones de Visualizacion",purpose:"Imagineria mental antes del contacto",desc:"Antes de cada uno de 10 tiros, cierra los ojos por 3 segundos e imagina el vuelo completo de la bola aterrizando en el objetivo. Luego golpea. Califica que tan claro lo viste, 1 a 3.",label:"Visualizaciones claras"},
  m3:{name:"Reinicio en Una Respiracion",purpose:"Reiniciar despues de un mal tiro",desc:"Golpea 15 tiros. Despues de cualquier tiro que no te guste, toma una respiracion lenta antes de caminar a la siguiente bola — nunca reacciones, solo respira y reinicia. Registra cuantos reinicios manejaste con calma.",label:"Reinicios calmados"},
  m4:{name:"Ejercicio de Compromiso",purpose:"Confiar en tu lectura o plan",desc:"En 10 tiros o putts, elige tu objetivo y palo en menos de 10 segundos, luego comprometete completamente sin dudar. Registra cuantos lograste sin vacilacion.",label:"Tiros comprometidos"},
  m5:{name:"Simulacion de Putt bajo Presion",purpose:"Rendir bajo presion simulada",desc:"Preparate para un putt de 2 m. Diciendote que este putt decide el partido. Hazlo 10 veces separadas, alejandote y reiniciando entre cada una. Registra aciertos bajo presion autoimpuesta.",label:"Embocados bajo presion"},
  m6:{name:"Recuperacion de Mal Tiro",purpose:"Recuperarse inmediatamente",desc:"Intenta deliberadamente golpear un mal tiro, luego inmediatamente da un paso y golpea tu mejor tiro justo despues. Repite 8 veces. Registra cuantos tiros de recuperacion fueron realmente buenos.",label:"Buenas recuperaciones"},
  m7:{name:"Concentracion bajo Fatiga",purpose:"Mantener calidad al final de la practica",desc:"Despues de una sesion completa de practica cuando estas cansado, golpea 10 tiros mas con rutina y compromiso completos. Registra cuantos coincidieron con tu calidad inicial.",label:"Tiros de calidad"},
  m8:{name:"Ronda de Torneo Simulada",purpose:"Simulacion completa de presion",desc:"Juega o simula 9 hoyos anotando como si fuera una competencia real con algo en juego. Observa tu dialogo interno y respiracion bajo esa presion. Califica tu compostura mental por hoyo, 1 a 3.",label:"Hoyos con compostura"},
  m9:{name:"Proceso sobre Resultado",purpose:"Desapegarse de los resultados",desc:"Golpea 15 tiros, pero califica solo la calidad de rutina y compromiso — ignora completamente donde va la bola. Esto reorienta el enfoque hacia lo que controlas.",label:"Repeticiones de calidad"},
};
const EX_DE = {
  p1:{name:"Tor-Drill",purpose:"Schlagflaechenkontrolle und Linie",desc:"Platziere zwei Tees etwas breiter als dein Putterkopf, 15 cm vor dem Ball. Mache 20 Putts aus 1 m durch das Tor.",label:"Eingelocht"},
  p2:{name:"Kurzputt-Vertrauen",purpose:"Routine und Vertrauen bei kurzen Putts",desc:"Platziere 10 Baelle im Kreis 30 cm vom Loch und lochle alle ein, dann gehe auf 60 cm und putte 10 weitere (20 Putts insgesamt).",label:"In Folge eingelocht"},
  p3:{name:"Gerader Putt",purpose:"Putt-Mechanik und Tempo",desc:"Finde den geradesten Putt auf dem Gruen. Spiele 15 Putts aus 1 m mit einem ruhigen Pendelschlag.",label:"Eingelocht"},
  p4:{name:"Lag zum Vorgruen",purpose:"Distanzkontrolle und Geschwindigkeit",desc:"Aus 9 m, stoppe 10 Baelle innerhalb 15 cm vom Vorgruen ohne es zu ueberrollen.",label:"In der Zone gestoppt"},
  p5:{name:"Einhand-Drill",purpose:"Gefuehl und verhindert Handgelenk-Flip",desc:"Putte 10 Baelle nur mit der fuehrenden Hand aus 1.2 m. Entwickelt Gefuehl und verhindert das Flippen beim Treffmoment.",label:"Eingelocht"},
  p6:{name:"Leiter zum Loch",purpose:"Grundlegendes Geschwindigkeitsgefuehl",desc:"Putte je einen Ball aus 2 m, 4 m, 6 m, und 8 m, mit dem Ziel, hinter dem Loch aber innerhalb 1 m zu landen. Wiederhole die Leiter 3 Mal (12 Putts insgesamt).",label:"In der Zone (von 12)"},
  p7:{name:"Uhren-Drill",purpose:"Konstanz aus allen Winkeln",desc:"Platziere 4 Baelle aus 1 m rund um das Loch wie eine Uhr und putte jeden. Vervollstaendige den ganzen Kreis ohne Fehlschlag, dann wiederhole 3 volle Runden (12 Putts insgesamt).",label:"In Folge eingelocht"},
  p8:{name:"Distanzleiter",purpose:"Geschwindigkeitskalibrierung",desc:"Putte auf Ziele aus 3 m, 6 m, und 9 m, mit einem Punkt jedes Mal, wenn der Ball innerhalb einer Schlaegerlaenge stoppt. 5 Versuche bei jeder Distanz (15 Putts insgesamt).",label:"Erzielte Punkte"},
  p9:{name:"Druck aus 1.5m",purpose:"Leistung unter Druck",desc:"Lochle 5 Putts in Folge aus 1.5 m ein. Jeder Fehlschlag setzt den Zaehler auf null zurueck. Du hast bis zu 20 Versuche, um die Serie zu schaffen — notiere, wie viele Versuche du gebraucht hast.",label:"Versuche zum Abschluss"},
  p10:{name:"Break-Putt",purpose:"Break lesen",desc:"Finde einen Putt mit konstantem Break aus 2.5 m. Spiele 10 Putts und verfolge die Startlinie. Lochle 6+ ein, um zu bestehen.",label:"Eingelocht"},
  p11:{name:"Zwei-Stufen-Geschwindigkeit",purpose:"Geschwindigkeitskontrolle auf Haengen",desc:"Finde ein zweistufiges Gruen oder einen Hang. Putte 10 Baelle von der unteren Stufe zu einem Loch auf der oberen Stufe, konzentriere dich nur auf die richtige Geschwindigkeit.",label:"Innerhalb 1 m"},
  p12:{name:"100-Ball-Putting",purpose:"Ausdauer und Basiswert",desc:"Mache 100 Putts aus Distanzen zwischen 1 und 6 m, dabei gerade und Break-Putts durchgehend gemischt. Verfolge jeden Putt, den du einlochst.",label:"Eingelocht"},
  p13:{name:"Druck 18",purpose:"Turniersimulation",desc:"Spiele 18 Putt-Drucksituationen: 6 aus 1.2 m, 6 aus 1.8 m, und 6 aus 2.4 m. Erziele 2 Punkte fuer einen klaren Treffer, 1 Punkt fuer einen Tap-in nach knappem Fehlschlag, 0 Punkte fuer einen 3-Putt (36 Punkte moeglich).",label:"Punkte"},
  p14:{name:"3-6-9 Zirkel",purpose:"Punkten aus kurzer Distanz",desc:"Lochle 3 aus 1 m, 3 aus 2 m, und 3 aus 3 m ohne Fehlschlag ein (9 Putts wenn perfekt). Jeder Fehlschlag fuegt deinem Gesamtwert einen Strafputt hinzu — notiere die Gesamtputts, um alle 9 zu beenden.",label:"Putts gesamt"},
  p15:{name:"Lag-Putt-Marathon",purpose:"Distanzkontrolle bei langen Putts",desc:"Mache 15 Putts aus 12-15 m, alle zu unterschiedlichen Loechern. Erziele 2 Punkte, wenn der Ball innerhalb 1 m landet (sicherer 2-Putt-Bereich), 0 Punkte darueber hinaus (30 Punkte moeglich).",label:"Punkte"},
  s1:{name:"Up and Down",purpose:"Grundlegendes Chippen und Abschliessen",desc:"Aus 5 m neben dem Gruen, chippe und putte. 10 Versuche. Zaehle erfolgreiche Up and Downs.",label:"Up and Downs"},
  s2:{name:"Landezone",purpose:"Bewusstsein fuer den Landepunkt",desc:"Lege ein Handtuch 1 m auf das Gruen. Aus 9 m, spiele 15 Schlaege und versuche das Handtuch zu treffen. Waehle den Schlaeger, der einen niedrigen, kontrollierten Flug ergibt.",label:"Treffer auf Handtuch"},
  s3:{name:"Chip zum Tee",purpose:"Praezisions- und Naehekontrolle",desc:"Stecke ein Tee 2 m vom Gruenrand. Aus 7 m, spiele 10 Schlaege innerhalb 1 m vom Tee.",label:"Innerhalb 1 m"},
  s4:{name:"Chip-Leiter",purpose:"Distanzkontrolle bei Chips",desc:"Vom gleichen Punkt aus, chippe 3 Baelle zu einem nahen Ziel, 3 zu einem mittleren, und 3 zu einem weiten, alle auf dem Gruen (9 Chips insgesamt). Passe nur die Schwunglaenge an die Distanz an.",label:"Im Ziel (von 9)"},
  s5:{name:"Bump and Run",purpose:"Kontrolle des niedrigen Rollschlags",desc:"Aus 18 m, spiele einen Bump and Run zu einem bestimmten Loch mit einem niedrigen, rollenden Schlag. 10 Versuche, verfolge Genauigkeit auf 2 m.",label:"Innerhalb 2 m"},
  s6:{name:"Waehle Deinen Schlaeger",purpose:"Vertrauen bei der Schlaegerwahl",desc:"Aus 14 m, spiele 15 Schlaege mit den 3 Schlaegern, die du natuerlich fuer diesen Schlag waehlen wuerdest. Beobachte, welcher das konstanteste Ergebnis liefert — das ist dein Standardschlaeger.",label:"Innerhalb 1.2 m"},
  s7:{name:"Bunker-Ausstieg",purpose:"Sandtechnik",desc:"Aus einem Gruenbunker, bringe 10 Baelle aufs Gruen. Verfolge, wie viele innerhalb 3 m von der Flagge landen.",label:"Baelle auf dem Gruen"},
  s8:{name:"Pitch-Praezision",purpose:"Distanzkontrolle mit dem Wedge",desc:"Aus 27 m, spiele 10 Pitch-Schlaege. Lande innerhalb 3 m und stoppe innerhalb 4.5 m insgesamt.",label:"Innerhalb 4.5 m"},
  s9:{name:"Bergauf / Bergab Lagen",purpose:"Anpassung an Haenge",desc:"Finde eine Bergauf- und eine Bergab-Position nahe dem Gruen. Spiele 5 Chips von jeder (10 insgesamt), mit Fokus auf solidem Kontakt und Distanzkontrolle trotz des Hangs.",label:"Up and Downs"},
  s10:{name:"Flop Shot",purpose:"Beherrschung der hohen Flugbahn",desc:"Ueber ein Hindernis aus 14 m, spiele 10 hohe, weiche Schlaege. Muss aufs Gruen landen und innerhalb 2.5 m stoppen.",label:"Erfolgreiche Flops"},
  s11:{name:"Kurzes-Spiel-Zirkel",purpose:"Vollstaendige Konstanz im kurzen Spiel",desc:"Baue 5 Stationen rund um das Gruen mit unterschiedlichen Distanzen und Lagen auf: Chip, Pitch, hoher Flop, Bunker, schwierige Lage. Spiele 5 Baelle pro Station (25 insgesamt) und verfolge Up and Downs an jeder.",label:"Up and Downs"},
  s12:{name:"18 Up and Downs",purpose:"Scrambling-Ausdauer",desc:"Simuliere 18 Kurzspiel-Situationen: 6 aus dem Rough, 6 aus dem Sand, 6 aus schwierigen Lagen, alle innerhalb 20 m vom Gruen.",label:"Up and Downs"},
  s13:{name:"Ein Ball, Keine Wiederholung",purpose:"Engagement ohne Probeschwung",desc:"Gehe zu 10 zufaelligen Punkten innerhalb 20 m vom Gruen. Spiele von jedem einen Schlag ohne Probeschwung oder Wiederholung, genau wie auf dem Platz. Verfolge Up and Downs.",label:"Up and Downs"},
  l1:{name:"Ausrichtungs-Drill",purpose:"Setup und Ausrichtung",desc:"Verwende Ausrichtungsstaebe. Spiele 20 Schlaege mit einem mittleren Eisen und fokussiere nur auf solidem, zentriertem Kontakt. Kein Ziel — spuere nur den Schlag.",label:"Solide Kontakte"},
  l2:{name:"Zeitlupen-Schwuenge",purpose:"Schwungebene und Sequenzierung",desc:"Schlage 15 Baelle mit etwa 50% Geschwindigkeit mit einem mittleren Eisen, halte den Schlaeger auf der Ebene und beende im Gleichgewicht. Bewerte jeden Schwung von 1 bis 3 nach seiner Kontrolle.",label:"Ausgeglichene Finishs"},
  l3:{name:"Fuesse Zusammen",purpose:"Balance und Rhythmus",desc:"Schlage 15 Baelle mit zusammengestellten Fuessen mit einem beliebigen Eisen. Das zwingt zur korrekten Gewichtsverlagerung und einem natuerlicheren Rhythmus.",label:"Saubere Kontakte"},
  l4:{name:"Tiefpunkt-Kontrolle",purpose:"Ball-dann-Rasen-Kontakt",desc:"Zeichne eine Linie ins Gras oder verwende eine Spruehlinie. Spiele 15 Schlaege mit mittlerem Eisen und versuche, jedes Mal das Divot direkt vor der Linie zu nehmen.",label:"Korrekter Tiefpunkt"},
  l5:{name:"Driver-Genauigkeit",purpose:"Genauigkeit mit dem Driver",desc:"Schlage 10 Abschlaege mit deinem Driver in einen definierten Fairway-Korridor. Verfolge, wie viele du triffst und auf welcher Seite du tendenziell verfehlst.",label:"Fairways getroffen"},
  l6:{name:"Eisen-Genauigkeit auf 130m",purpose:"Streuung von Eisen auf mittlere Distanz",desc:"Waehle ein Ziel 130 m entfernt. Verwende den Schlaeger, den du normalerweise auf diese Distanz spielst. 15 Schlaege, verfolge, wie viele innerhalb 18 m vom Ziel landen.",label:"Auf dem Ziel"},
  l7:{name:"9-Schlag-Matrix",purpose:"Kontrolle der Schlagform",desc:"Spiele 9 Schlaege mit einem Schlaeger: hoch, mittel, niedrig kombiniert mit Draw, gerade, Fade. 1 Punkt pro erfolgreich erzielter Form.",label:"Erzielte Formen"},
  l8:{name:"Wedge-Distanzleiter",purpose:"Kalibrierung des Teilschwungs",desc:"Schlage 5 Baelle bei 50%, 75%, und 100% Schwunggeschwindigkeit mit deinem kuerzesten Wedge (15 Schlaege insgesamt). Notiere, wie weit jede Anstrengungsstufe traegt — das wird deine persoenliche Distanztabelle.",label:"Innerhalb 5 m vom Ziel"},
  l9:{name:"Wiederholbarkeit des Standardschlags",purpose:"Konstanz ohne Druck",desc:"Waehle einen Schlaeger und ein Ziel. Spiele 15 Schlaege und versuche, jedes Mal genau den gleichen Schlag zu wiederholen. Verfolge, wie viele innerhalb eines 10-m-Kreises landen.",label:"Innerhalb 10 m"},
  l10:{name:"Par-3-Simulation",purpose:"Eisenspiel unter Druck",desc:"Simuliere 9 Par-3-Loecher mit unterschiedlichen Distanzen von 90 bis 165 m. Waehle realistische Ziele und Schlaeger. Verfolge getroffene Gruens.",label:"Gruens getroffen"},
  l11:{name:"Volle-Tasche-Herausforderung",purpose:"Konstanz der gesamten Tasche",desc:"Schlage 2 Schlaege mit jedem Schlaeger in deiner Tasche, vom laengsten zum kuerzesten. Bewerte deinen besten Schlag pro Schlaeger: 0 schlecht, 1 okay, 2 grossartig — addiere deine Punkte ueber alle Schlaeger.",label:"Punkte"},
  l12:{name:"Driver Unter Druck",purpose:"Leistung unter Stress",desc:"Schlage 10 Drives in den engsten Korridor, den du realistisch definieren kannst — simuliere den engsten Abschlag, dem du auf deinem Heimatplatz begegnen wuerdest.",label:"Fairways getroffen"},
  l13:{name:"Problem-Schlaege",purpose:"Fertigkeiten zur Wiederherstellung",desc:"Simuliere 10 Problemsituationen: Schlag unter einem Ast, Draw um ein Hindernis, Fade ueber ein Problem. Bewerte jeden Schlag von 0 (gescheitert) bis 2 (wie geplant ausgefuehrt).",label:"Punkte"},
  m1:{name:"Vorbereitungsroutine-Aufbau",purpose:"Eine wiederholbare Routine aufbauen",desc:"Auf der Range, spiele 15 Schlaege mit genau der gleichen Vorbereitungsroutine jedes Mal: gleiche Anzahl Blicke zum Ziel, gleiches Waggle, gleicher Atemzug. Bewerte, wie konstant sich deine Routine anfuehlte, 1 bis 3.",label:"Konstante Routinen"},
  m2:{name:"Visualisierungs-Wiederholungen",purpose:"Mentale Bilder vor dem Kontakt",desc:"Vor jedem von 10 Schlaegen, schliesse die Augen fuer 3 Sekunden und stelle dir den vollen Ballflug auf das Ziel vor. Dann schlage. Bewerte, wie klar du es sehen konntest, 1 bis 3.",label:"Klare Visualisierungen"},
  m3:{name:"Ein-Atemzug-Reset",purpose:"Zuruecksetzen nach einem schlechten Schlag",desc:"Spiele 15 Schlaege. Nach jedem Schlag, der dir nicht gefaellt, nimm einen langsamen Atemzug, bevor du zum naechsten Ball gehst — reagiere niemals, atme einfach und setze zurueck. Verfolge, wie viele Resets du ruhig geschafft hast.",label:"Ruhige Resets"},
  m4:{name:"Engagement-Drill",purpose:"Deinem Lesen oder Plan vertrauen",desc:"Bei 10 Schlaegen oder Putts, waehle dein Ziel und Schlaeger in unter 10 Sekunden, dann engagiere dich voll ohne Zweifel. Verfolge, wie viele du ohne Zoegern engagiert hast.",label:"Engagierte Schlaege"},
  m5:{name:"Druck-Putt-Simulation",purpose:"Unter simuliertem Druck performen",desc:"Stelle dich auf einen 2-m-Putt ein. Sage dir, dass dieser Putt das Match entscheidet. Mache das 10 separate Male, gehe weg und setze zwischen jedem zurueck. Verfolge Treffer unter selbst auferlegtem Druck.",label:"Eingelocht unter Druck"},
  m6:{name:"Erholung vom Schlechten Schlag",purpose:"Sofort zurueckkommen",desc:"Versuche absichtlich, einen schlechten Schlag zu spielen, dann sofort den naechsten besten Schlag direkt danach. Wiederhole 8 Mal. Verfolge, wie viele Erholungsschlaege wirklich gut waren.",label:"Gute Erholungen"},
  m7:{name:"Fokus Unter Ermuedung",purpose:"Qualitaet spaet im Training halten",desc:"Nach einer kompletten Trainingseinheit, wenn du muede bist, spiele 10 weitere Schlaege mit voller Routine und Engagement. Verfolge, wie viele deiner fruehen Qualitaet entsprachen.",label:"Qualitaetsschlaege"},
  m8:{name:"Simulierte Turnierrunde",purpose:"Volle Drucksimulation",desc:"Spiele oder simuliere 9 Loecher und werte, als waere es ein echter Wettkampf mit Einsatz. Beobachte deinen Selbstdialog und Atmung unter diesem Druck. Bewerte deine mentale Ruhe pro Loch, 1 bis 3.",label:"Beherrschte Loecher"},
  m9:{name:"Prozess Statt Ergebnis",purpose:"Sich vom Ergebnis loesen",desc:"Spiele 15 Schlaege, aber bewerte dich nur nach Routine- und Engagement-Qualitaet — ignoriere komplett, wohin der Ball geht. Das lenkt den Fokus auf das, was du kontrollierst.",label:"Qualitaets-Wiederholungen"},
};
const EX_IT = {
  p1:{name:"Esercizio del Cancello",purpose:"Controllo dell'angolo e della linea",desc:"Posiziona due tee leggermente piu larghi della testa del putter, 15 cm davanti alla palla. Fai 20 putt da 1 m attraverso il cancello.",label:"Imbucati"},
  p2:{name:"Fiducia Putt Corti",purpose:"Routine e fiducia sui putt corti",desc:"Posiziona 10 palline in cerchio a 30 cm dalla buca e imbucale tutte, poi passa a 60 cm e putta altre 10 (20 putt totali).",label:"Consecutivi imbucati"},
  p3:{name:"Putt Diritto",purpose:"Meccanica del putt e tempo",desc:"Trova il putt piu dritto sul green. Fai 15 putt da 1 m con un movimento a pendolo fluido.",label:"Imbucati"},
  p4:{name:"Lag verso il Bordo",purpose:"Controllo della distanza e velocita",desc:"Da 9 m, ferma 10 palline a meno di 15 cm dal bordo senza superarlo.",label:"Fermate nella zona"},
  p5:{name:"Esercizio a Una Mano",purpose:"Sensibilita e previene il flip del polso",desc:"Putta 10 palline solo con la mano guida da 1.2 m. Sviluppa sensibilita e previene il flip all'impatto.",label:"Imbucati"},
  p6:{name:"Scala verso la Buca",purpose:"Giudizio base della velocita",desc:"Putta una pallina da 2 m, 4 m, 6 m, e 8 m, cercando di finire oltre la buca ma entro 1 m. Ripeti la scala 3 volte (12 putt totali).",label:"In zona (su 12)"},
  p7:{name:"Esercizio dell'Orologio",purpose:"Costanza da tutte le angolazioni",desc:"Posiziona 4 palline a 1 m attorno alla buca come un orologio e putta ciascuna. Completa il cerchio intero senza errori, poi ripeti per 3 giri completi (12 putt totali).",label:"Consecutivi imbucati"},
  p8:{name:"Scala di Distanza",purpose:"Calibrazione della velocita",desc:"Putta verso obiettivi a 3 m, 6 m, e 9 m, segnando un punto ogni volta che la palla si ferma entro una lunghezza di bastone. 5 tentativi per ogni distanza (15 putt totali).",label:"Punti ottenuti"},
  p9:{name:"Pressione da 1.5m",purpose:"Prestazione sotto pressione",desc:"Imbuca 5 putt di fila da 1.5 m. Ogni errore azzera il conteggio. Hai fino a 20 tentativi per completare la serie — annota quanti tentativi ti sono serviti.",label:"Tentativi per completare"},
  p10:{name:"Putt con Effetto",purpose:"Lettura dell'effetto",desc:"Trova un putt con effetto costante a 2.5 m. Fai 10 putt seguendo la linea di partenza. Imbucane 6+ per passare.",label:"Imbucati"},
  p11:{name:"Velocita a Due Livelli",purpose:"Controllo della velocita sui pendii",desc:"Trova un green a due livelli o un pendio. Putta 10 palline dal livello inferiore verso una buca sul livello superiore, concentrandoti solo sulla velocita corretta.",label:"Entro 1 m"},
  p12:{name:"100 Putt",purpose:"Resistenza e base di riferimento",desc:"Esegui 100 putt da distanze comprese tra 1 e 6 m, mescolando linee dritte ed effetto durante tutto l'esercizio. Traccia ogni putt che imbuchi.",label:"Imbucati"},
  p13:{name:"Pressione 18",purpose:"Simulazione di torneo",desc:"Gioca 18 situazioni di pressione al putting: 6 da 1.2 m, 6 da 1.8 m, e 6 da 2.4 m. Segna 2 punti per un putt netto, 1 punto per un tap-in dopo un quasi-errore, 0 punti per un 3-putt (36 punti possibili).",label:"Punti"},
  p14:{name:"Circuito 3-6-9",purpose:"Segnare da distanza corta",desc:"Imbuca 3 putt da 1 m, 3 da 2 m, e 3 da 3 m senza errori (9 putt se perfetto). Ogni errore aggiunge un putt di penalita al tuo totale — annota il totale di putt per finire i 9.",label:"Putt totali"},
  p15:{name:"Maratona di Lag Putt",purpose:"Controllo della distanza sui putt lunghi",desc:"Esegui 15 putt da 12-15 m, tutti verso buche diverse. Segna 2 punti se la palla finisce entro 1 m (zona sicura di 2-putt), 0 punti oltre (30 punti possibili).",label:"Punti"},
  s1:{name:"Up and Down",purpose:"Chip base e finalizzazione",desc:"Da 5 m dal green, fai chip e putt. 10 tentativi. Conta gli up and down riusciti.",label:"Up and down"},
  s2:{name:"Zona di Atterraggio",purpose:"Consapevolezza del punto di atterraggio",desc:"Posiziona un asciugamano a 1 m sul green. Da 9 m, colpisci 15 tiri provando ad atterrare sull'asciugamano. Scegli il bastone che da un volo basso e controllato.",label:"Colpi sull'asciugamano"},
  s3:{name:"Chip verso un Tee",purpose:"Controllo di precisione e prossimita",desc:"Pianta un tee a 2 m dal bordo del green. Da 7 m, colpisci 10 tiri entro 1 m dal tee.",label:"Entro 1 m"},
  s4:{name:"Chip a Scala",purpose:"Controllo della distanza sui chip",desc:"Dallo stesso punto, fai chip di 3 palline verso un obiettivo vicino, 3 verso uno medio, e 3 verso uno lontano, tutti sul green (9 chip totali). Adatta solo la lunghezza dello swing alla distanza.",label:"Sul bersaglio (su 9)"},
  s5:{name:"Bump and Run",purpose:"Controllo del tiro basso e rullante",desc:"Da 18 m, fai un bump and run verso una buca specifica con un tiro basso e rullante. 10 tentativi, traccia la precisione a 2 m.",label:"Entro 2 m"},
  s6:{name:"Scegli il Tuo Bastone",purpose:"Fiducia nella scelta del bastone",desc:"Da 14 m, colpisci 15 tiri usando i 3 bastoni che scegli naturalmente per questo tiro. Nota quale da il risultato piu costante — quello e il tuo bastone di riferimento.",label:"Entro 1.2 m"},
  s7:{name:"Uscita dal Bunker",purpose:"Tecnica della sabbia",desc:"Da un bunker vicino al green, porta 10 palline sul green. Traccia quante finiscono entro 3 m dalla bandiera.",label:"Palline sul green"},
  s8:{name:"Precisione di Pitch",purpose:"Controllo della distanza con il wedge",desc:"Da 27 m, colpisci 10 pitch. Atterra entro 3 m e fermati entro 4.5 m totali.",label:"Entro 4.5 m"},
  s9:{name:"Pendii in Salita / Discesa",purpose:"Adattamento al pendio",desc:"Trova una posizione in salita e una in discesa vicino al green. Fai 5 chip da ciascuna (10 totali), concentrandoti su un contatto solido e sul controllo della distanza nonostante il pendio.",label:"Up and down"},
  s10:{name:"Flop Shot",purpose:"Padronanza della traiettoria alta",desc:"Sopra un ostacolo da 14 m, colpisci 10 tiri alti e morbidi. Deve atterrare sul green e fermarsi entro 2.5 m.",label:"Flop riusciti"},
  s11:{name:"Circuito di Gioco Corto",purpose:"Costanza completa del gioco corto",desc:"Allestisci 5 stazioni attorno al green a distanze e posizioni variate: chip, pitch, flop alto, bunker, posizione scomoda. Fai 5 palline a ogni stazione (25 totali) e traccia gli up and down in ognuna.",label:"Up and down"},
  s12:{name:"18 Up and Down",purpose:"Resistenza nello scrambling",desc:"Simula 18 situazioni di gioco corto: 6 dal rough, 6 dalla sabbia, 6 da posizioni difficili, tutte entro 20 m dal green.",label:"Up and down"},
  s13:{name:"Una Palla, Senza Ripetizione",purpose:"Impegno senza swing di prova",desc:"Cammina verso 10 punti casuali entro 20 m dal green. Colpisci un tiro da ciascuno senza swing di prova o ripetizione, esattamente come in campo. Traccia gli up and down.",label:"Up and down"},
  l1:{name:"Esercizio di Allineamento",purpose:"Postura e allineamento",desc:"Usa bastoncini di allineamento. Colpisci 20 tiri di ferro medio concentrandoti solo su un contatto solido e centrato. Nessun obiettivo — senti solo il colpo.",label:"Contatti solidi"},
  l2:{name:"Swing al Rallentatore",purpose:"Piano dello swing e sequenza",desc:"Colpisci 15 palline a circa il 50% della velocita con un ferro medio, mantenendo il bastone sul piano e finendo in equilibrio. Valuta ogni swing da 1 a 3 in base al controllo.",label:"Finali equilibrati"},
  l3:{name:"Piedi Uniti",purpose:"Equilibrio e ritmo",desc:"Colpisci 15 palline con i piedi uniti usando un ferro qualsiasi. Questo forza il corretto trasferimento del peso e un ritmo piu naturale.",label:"Contatti puliti"},
  l4:{name:"Controllo del Punto Basso",purpose:"Contatto palla-poi-erba",desc:"Disegna una linea nell'erba o usa una linea spray. Colpisci 15 tiri di ferro medio provando a prendere la zolla appena davanti alla linea ogni volta.",label:"Punto basso corretto"},
  l5:{name:"Precisione del Driver",purpose:"Precisione con il driver",desc:"Colpisci 10 tiri dal tee con il tuo driver verso un corridoio di fairway definito. Traccia quanti colpi riesci e da che lato tendi a sbagliare.",label:"Fairway centrati"},
  l6:{name:"Precisione di Ferro a 130m",purpose:"Dispersione dei ferri a media distanza",desc:"Scegli un obiettivo a 130 m. Usa il bastone che colpiresti normalmente a quella distanza. 15 tiri, traccia quanti finiscono entro 18 m dall'obiettivo.",label:"Sul bersaglio"},
  l7:{name:"Matrice a 9 Tiri",purpose:"Controllo della traiettoria del tiro",desc:"Colpisci 9 tiri con un bastone: alto, medio, basso combinati con draw, dritto, fade. 1 punto per ogni traiettoria intenzionale riuscita.",label:"Traiettorie riuscite"},
  l8:{name:"Scala di Distanza del Wedge",purpose:"Calibrazione dello swing parziale",desc:"Colpisci 5 palline al 50%, 75%, e 100% della velocita di swing con il tuo wedge piu corto (15 tiri totali). Annota quanto arriva ogni livello di sforzo — diventa la tua tabella personale delle distanze.",label:"Entro 5 m dall'obiettivo"},
  l9:{name:"Ripetibilita del Tiro Standard",purpose:"Costanza senza pressione",desc:"Scegli un bastone e un obiettivo. Colpisci 15 tiri provando a ripetere esattamente lo stesso tiro ogni volta. Traccia quanti finiscono in un cerchio di 10 m.",label:"Entro 10 m"},
  l10:{name:"Simulazione Par 3",purpose:"Gioco di ferri sotto pressione",desc:"Simula 9 buche par 3 a distanze variate da 90 a 165 m. Scegli obiettivi e bastoni realistici. Traccia i green centrati.",label:"Green centrati"},
  l11:{name:"Sfida del Sacco Completo",purpose:"Costanza di tutto il sacco",desc:"Colpisci 2 tiri con ogni bastone nel tuo sacco, dal piu lungo al piu corto. Valuta il tuo miglior tiro con ogni bastone: 0 scarso, 1 ok, 2 ottimo — somma i tuoi punti su tutti i bastoni.",label:"Punti"},
  l12:{name:"Driver Sotto Pressione",purpose:"Prestazione sotto stress",desc:"Colpisci 10 drive verso il corridoio piu stretto che riesci a definire realisticamente — simulando il tiro dal tee piu impegnativo che affronteresti sul tuo campo.",label:"Fairway centrati"},
  l13:{name:"Tiri di Difficolta",purpose:"Abilita di recupero",desc:"Simula 10 situazioni difficili: colpo sotto un ramo, draw attorno a un ostacolo, o fade sopra un problema. Valuta ogni tiro da 0 (fallito) a 2 (eseguito come previsto) — 20 punti possibili.",label:"Punti"},
  m1:{name:"Costruttore di Routine Pre-Tiro",purpose:"Costruire una routine ripetibile",desc:"Al campo pratica, colpisci 15 tiri usando esattamente la stessa routine pre-tiro ogni volta: stesso numero di sguardi al bersaglio, stesso movimento, stesso respiro. Valuta quanto costante si e sentita la tua routine, 1 a 3.",label:"Routine costanti"},
  m2:{name:"Ripetizioni di Visualizzazione",purpose:"Immaginazione mentale prima del contatto",desc:"Prima di ognuno di 10 tiri, chiudi gli occhi per 3 secondi e immagina il volo completo della palla che atterra sull'obiettivo. Poi colpisci. Valuta quanto chiaramente lo hai visto, 1 a 3.",label:"Visualizzazioni chiare"},
  m3:{name:"Reset in Un Respiro",purpose:"Ripartire dopo un brutto tiro",desc:"Colpisci 15 tiri. Dopo ogni tiro che non ti piace, fai un respiro lento prima di camminare verso la prossima palla — non reagire mai, respira e riparti. Traccia quanti reset hai gestito con calma.",label:"Reset calmi"},
  m4:{name:"Esercizio di Impegno",purpose:"Fidarsi della propria lettura o piano",desc:"Su 10 tiri o putt, scegli il tuo obiettivo e bastone in meno di 10 secondi, poi impegnati completamente senza esitazione. Traccia quanti hai impegnato senza dubbi.",label:"Tiri impegnati"},
  m5:{name:"Simulazione di Putt sotto Pressione",purpose:"Performare sotto pressione simulata",desc:"Preparati per un putt da 2 m. Dicendoti che questo putt decide la partita. Fallo 10 volte separate, allontanandoti e resettando tra ognuna. Traccia gli imbucati sotto pressione autoimposta.",label:"Imbucati sotto pressione"},
  m6:{name:"Recupero da Brutto Tiro",purpose:"Riprendersi immediatamente",desc:"Cerca deliberatamente di colpire un brutto tiro, poi immediatamente fai un passo avanti e colpisci il tuo miglior tiro subito dopo. Ripeti 8 volte. Traccia quanti tiri di recupero sono stati davvero buoni.",label:"Buoni recuperi"},
  m7:{name:"Concentrazione sotto Fatica",purpose:"Mantenere la qualita a fine allenamento",desc:"Dopo una sessione completa di allenamento quando sei stanco, colpisci altri 10 tiri con routine e impegno completi. Traccia quanti corrispondono alla qualita iniziale.",label:"Tiri di qualita"},
  m8:{name:"Simulazione di Round del Torneo",purpose:"Simulazione completa della pressione",desc:"Gioca o simula 9 buche segnando come se fosse una vera competizione con qualcosa in palio. Osserva il tuo dialogo interiore e la respirazione sotto quella pressione. Valuta la tua compostezza mentale per buca, 1 a 3.",label:"Buche con compostezza"},
  m9:{name:"Processo sul Risultato",purpose:"Distaccarsi dai risultati",desc:"Colpisci 15 tiri, ma valutati solo sulla qualita di routine e impegno — ignora completamente dove va la palla. Questo riorienta il focus su cio che controlli.",label:"Ripetizioni di qualita"},
};
const EX_PT = {
  p1:{name:"Exercicio do Portao",purpose:"Controle do angulo e trajetoria",desc:"Coloque dois tees um pouco mais largos que a cabeca do seu putter, 15 cm na frente da bola. Faca 20 putts de 1 m atraves do portao.",label:"Encaçapados"},
  p2:{name:"Confianca em Putts Curtos",purpose:"Rotina e confianca em putts curtos",desc:"Coloque 10 bolas em circulo a 30 cm do buraco e encaçape todas, depois mude para 60 cm e pute 10 mais (20 putts no total).",label:"Consecutivos encaçapados"},
  p3:{name:"Putt Reto",purpose:"Mecanica do putt e tempo",desc:"Encontre o putt mais reto no green. Faca 15 putts de 1 m com um movimento de pendulo suave.",label:"Encaçapados"},
  p4:{name:"Lag para a Margem",purpose:"Controle de distancia e velocidade",desc:"De 9 m, pare 10 bolas a menos de 15 cm da margem sem passar.",label:"Paradas na zona"},
  p5:{name:"Exercicio com Uma Mao",purpose:"Sensibilidade e evita o flip do pulso",desc:"Pute 10 bolas apenas com a mao guia de 1.2 m. Desenvolve sensibilidade e evita o flip no impacto.",label:"Encaçapados"},
  p6:{name:"Escada para o Buraco",purpose:"Julgamento basico de velocidade",desc:"Pute uma bola de 2 m, 4 m, 6 m, e 8 m, buscando terminar apos o buraco mas a menos de 1 m. Repita a escada 3 vezes (12 putts no total).",label:"Na zona (de 12)"},
  p7:{name:"Exercicio do Relogio",purpose:"Consistencia de todos os angulos",desc:"Posicione 4 bolas a 1 m em volta do buraco como um relogio e pute cada uma. Complete o circulo inteiro sem errar, depois repita por 3 voltas completas (12 putts no total).",label:"Consecutivos encaçapados"},
  p8:{name:"Escada de Distancia",purpose:"Calibragem de velocidade",desc:"Pute em direcao a alvos a 3 m, 6 m, e 9 m, marcando um ponto cada vez que a bola parar a menos de um comprimento de taco. 5 tentativas em cada distancia (15 putts no total).",label:"Pontos obtidos"},
  p9:{name:"Pressao de 1.5m",purpose:"Desempenho sob pressao",desc:"Encaçape 5 putts seguidos de 1.5 m. Cada erro reinicia a contagem. Voce tem ate 20 tentativas para completar a sequencia — anote quantas tentativas foram necessarias.",label:"Tentativas para completar"},
  p10:{name:"Putt com Curva",purpose:"Leitura da curva",desc:"Encontre um putt com curva consistente a 2.5 m. Faca 10 putts seguindo a linha de saida. Encaçape 6+ para passar.",label:"Encaçapados"},
  p11:{name:"Velocidade em Dois Niveis",purpose:"Controle de velocidade em inclinacoes",desc:"Encontre um green de dois niveis ou uma inclinacao. Pute 10 bolas do nivel inferior para um buraco no nivel superior, focando apenas na velocidade correta.",label:"A menos de 1 m"},
  p12:{name:"100 Putts",purpose:"Resistencia e linha de base",desc:"Faca 100 putts de distancias entre 1 e 6 m, misturando linhas retas e com curva durante todo o exercicio. Registre cada putt que voce encaçapar.",label:"Encaçapados"},
  p13:{name:"Pressao 18",purpose:"Simulacao de torneio",desc:"Jogue 18 situacoes de pressao no putting: 6 de 1.2 m, 6 de 1.8 m, e 6 de 2.4 m. Marque 2 pontos por um putt limpo, 1 ponto por um tap-in apos um quase-erro, 0 pontos por um 3-putt (36 pontos possiveis).",label:"Pontos"},
  p14:{name:"Circuito 3-6-9",purpose:"Pontuar de curta distancia",desc:"Encaçape 3 putts de 1 m, 3 de 2 m, e 3 de 3 m sem errar (9 putts se perfeito). Cada erro adiciona um putt de penalidade ao seu total — anote o total de putts para terminar os 9.",label:"Total de putts"},
  p15:{name:"Maratona de Lag Putt",purpose:"Controle de distancia em putts longos",desc:"Faca 15 putts de 12-15 m, todos para buracos diferentes. Marque 2 pontos se a bola ficar a menos de 1 m (zona segura de 2-putt), 0 pontos alem disso (30 pontos possiveis).",label:"Pontos"},
  s1:{name:"Up and Down",purpose:"Chip basico e finalizacao",desc:"De 5 m do green, faca chip e putt. 10 tentativas. Conte os up and downs bem-sucedidos.",label:"Up and downs"},
  s2:{name:"Zona de Aterrissagem",purpose:"Consciencia do ponto de aterrissagem",desc:"Coloque uma toalha a 1 m no green. De 9 m, bata 15 tacadas tentando aterrissar na toalha. Escolha o taco que da um voo baixo e controlado.",label:"Acertos na toalha"},
  s3:{name:"Chip para um Tee",purpose:"Controle de proximidade e precisao",desc:"Coloque um tee a 2 m da borda do green. De 7 m, bata 10 tacadas a menos de 1 m do tee.",label:"A menos de 1 m"},
  s4:{name:"Chips em Escada",purpose:"Controle de distancia em chips",desc:"Do mesmo lugar, faca chip de 3 bolas para um alvo proximo, 3 para um medio, e 3 para um distante, todos no green (9 chips no total). Ajuste apenas o comprimento do seu swing a distancia.",label:"No alvo (de 9)"},
  s5:{name:"Bump and Run",purpose:"Controle da tacada baixa e rolada",desc:"De 18 m, faca um bump and run para um buraco especifico com uma tacada baixa e rolada. 10 tentativas, registre precisao a 2 m.",label:"A menos de 2 m"},
  s6:{name:"Escolha Seu Taco",purpose:"Confianca na escolha do taco",desc:"De 14 m, bata 15 tacadas usando os 3 tacos que voce escolheria naturalmente para esta tacada. Observe qual da o resultado mais consistente — esse e seu taco padrao.",label:"A menos de 1.2 m"},
  s7:{name:"Saida do Bunker",purpose:"Tecnica de areia",desc:"De um bunker perto do green, tire 10 bolas para o green. Registre quantas terminam a menos de 3 m da bandeira.",label:"Bolas no green"},
  s8:{name:"Precisao de Pitch",purpose:"Controle de distancia com wedge",desc:"De 27 m, bata 10 pitches. Aterrisse a menos de 3 m e pare a menos de 4.5 m no total.",label:"A menos de 4.5 m"},
  s9:{name:"Inclinacoes Subida / Descida",purpose:"Adaptacao a inclinacao",desc:"Encontre uma posicao em subida e uma em descida perto do green. Faca 5 chips de cada (10 no total), focando em contato solido e controle de distancia apesar da inclinacao.",label:"Up and downs"},
  s10:{name:"Flop Shot",purpose:"Dominio da trajetoria alta",desc:"Sobre um obstaculo de 14 m, bata 10 tacadas altas e suaves. Deve aterrissar no green e parar a menos de 2.5 m.",label:"Flops bem-sucedidos"},
  s11:{name:"Circuito de Jogo Curto",purpose:"Consistencia completa do jogo curto",desc:"Monte 5 estacoes em torno do green a distancias e posicoes variadas: chip, pitch, flop alto, bunker, posicao dificil. Faca 5 bolas em cada estacao (25 no total) e registre up and downs em todas.",label:"Up and downs"},
  s12:{name:"18 Up and Downs",purpose:"Resistencia no scrambling",desc:"Simule 18 situacoes de jogo curto: 6 do rough, 6 da areia, 6 de posicoes dificeis, todas a menos de 20 m do green.",label:"Up and downs"},
  s13:{name:"Uma Bola, Sem Repeticao",purpose:"Compromisso sem swing de pratica",desc:"Caminhe para 10 pontos aleatorios a menos de 20 m do green. Bata uma tacada de cada sem swing de pratica ou repeticao, exatamente como no campo. Registre up and downs.",label:"Up and downs"},
  l1:{name:"Exercicio de Alinhamento",purpose:"Postura e alinhamento",desc:"Use bastoes de alinhamento. Bata 20 tacadas de ferro medio focando apenas em contato solido e centralizado. Sem alvo — apenas sinta a tacada.",label:"Contatos solidos"},
  l2:{name:"Swings em Camera Lenta",purpose:"Plano de swing e sequenciamento",desc:"Acerte 15 bolas a cerca de 50% de velocidade com um ferro medio, mantendo o taco no plano e terminando em equilibrio. Avalie cada swing de 1 a 3 pelo controle.",label:"Finalizacoes equilibradas"},
  l3:{name:"Pes Juntos",purpose:"Equilibrio e ritmo",desc:"Acerte 15 bolas com os pes juntos usando qualquer ferro. Isso forca a transferencia de peso correta e um ritmo mais natural.",label:"Contatos limpos"},
  l4:{name:"Controle do Ponto Baixo",purpose:"Contato bola-depois-grama",desc:"Desenhe uma linha na grama ou use uma linha de spray. Bata 15 tacadas de ferro medio tentando pegar a marca de divot bem na frente da linha sempre.",label:"Ponto baixo correto"},
  l5:{name:"Precisao do Driver",purpose:"Precisao com o driver",desc:"Acerte 10 tacadas de saida com seu driver para um corredor de fairway definido. Registre quantas voce acerta e de que lado costuma errar.",label:"Fairways acertados"},
  l6:{name:"Precisao de Ferro a 130m",purpose:"Dispersao de ferros em media distancia",desc:"Escolha um alvo a 130 m. Use o taco que voce normalmente bateria nessa distancia. 15 tacadas, registre quantas terminam a menos de 18 m do alvo.",label:"No alvo"},
  l7:{name:"Matriz de 9 Tacadas",purpose:"Controle da trajetoria da tacada",desc:"Bata 9 tacadas com um taco: alto, medio, baixo combinados com draw, reto, fade. 1 ponto por trajetoria intencional bem-sucedida.",label:"Trajetorias alcancadas"},
  l8:{name:"Escada de Distancia do Wedge",purpose:"Calibragem do swing parcial",desc:"Acerte 5 bolas a 50%, 75%, e 100% da velocidade do swing com seu wedge mais curto (15 tacadas no total). Anote o quanto cada nivel de esforco alcanca — isso se torna sua tabela pessoal de distancias.",label:"A menos de 5 m do pretendido"},
  l9:{name:"Repetibilidade da Tacada Padrao",purpose:"Consistencia sem pressao",desc:"Escolha um taco e um alvo. Bata 15 tacadas tentando repetir exatamente a mesma tacada sempre. Registre quantas terminam em um circulo de 10 m.",label:"A menos de 10 m"},
  l10:{name:"Simulacao Par 3",purpose:"Jogo de ferros sob pressao",desc:"Simule 9 buracos par 3 a distancias variadas de 90 a 165 m. Escolha alvos e tacos realistas. Registre greens alcancados.",label:"Greens alcancados"},
  l11:{name:"Desafio do Saco Completo",purpose:"Consistencia de todo o saco",desc:"Acerte 2 tacadas com cada taco do seu saco, do mais longo ao mais curto. Avalie sua melhor tacada com cada taco: 0 ruim, 1 ok, 2 otimo — some seus pontos em todos os tacos.",label:"Pontos"},
  l12:{name:"Driver Sob Pressao",purpose:"Desempenho sob estresse",desc:"Acerte 10 tacadas de driver para o corredor mais estreito que voce conseguir definir realisticamente — simulando a tacada de saida mais exigente que voce enfrentaria no seu campo.",label:"Fairways acertados"},
  l13:{name:"Tacadas de Problema",purpose:"Habilidades de recuperacao",desc:"Simule 10 situacoes de problema: tacada sob um galho, draw em torno de um obstaculo, ou fade sobre um problema. Avalie cada tacada de 0 (falhou) a 2 (executada como planejado) — 20 pontos possiveis.",label:"Pontos"},
  m1:{name:"Construtor de Rotina Pre-Tacada",purpose:"Construir uma rotina repetivel",desc:"No campo de pratica, bata 15 tacadas usando exatamente a mesma rotina pre-tacada sempre: mesmo numero de olhares para o alvo, mesmo movimento, mesma respiracao. Avalie quao consistente sua rotina pareceu, 1 a 3.",label:"Rotinas consistentes"},
  m2:{name:"Repeticoes de Visualizacao",purpose:"Imagem mental antes do contato",desc:"Antes de cada uma de 10 tacadas, fecha os olhos por 3 segundos e imagine o voo completo da bola aterrissando no alvo. Depois bata. Avalie quao claramente voce conseguiu ver, 1 a 3.",label:"Visualizacoes claras"},
  m3:{name:"Reset em Uma Respiracao",purpose:"Reiniciar depois de uma tacada ruim",desc:"Bata 15 tacadas. Depois de qualquer tacada que voce nao gostar, respire lentamente uma vez antes de ir para a proxima bola — nunca reaja, apenas respire e reinicie. Registre quantos resets voce gerenciou com calma.",label:"Resets calmos"},
  m4:{name:"Exercicio de Compromisso",purpose:"Confiar na sua leitura ou plano",desc:"Em 10 tacadas ou putts, escolha seu alvo e taco em menos de 10 segundos, depois se comprometa totalmente sem hesitacao. Registre quantos voce se comprometeu sem hesitar.",label:"Tacadas comprometidas"},
  m5:{name:"Simulacao de Putt sob Pressao",purpose:"Performar sob pressao simulada",desc:"Prepare-se para um putt de 2 m. Diga a si mesmo que este putt decide a partida. Faca isso 10 vezes separadas, se afastando e reiniciando entre cada uma. Registre acertos sob pressao auto-imposta.",label:"Encaçapados sob pressao"},
  m6:{name:"Recuperacao de Tacada Ruim",purpose:"Se recuperar imediatamente",desc:"Tente deliberadamente bater uma tacada ruim, depois imediatamente avance e bata sua melhor tacada logo depois. Repita 8 vezes. Registre quantas tacadas de recuperacao foram realmente boas.",label:"Boas recuperacoes"},
  m7:{name:"Foco sob Fadiga",purpose:"Manter qualidade no final do treino",desc:"Depois de uma sessao completa de treino quando voce esta cansado, bata 10 tacadas extras com rotina e compromisso completos. Registre quantas corresponderam a qualidade do inicio da sessao.",label:"Tacadas de qualidade"},
  m8:{name:"Simulacao de Rodada de Torneio",purpose:"Simulacao completa de pressao",desc:"Jogue ou simule 9 buracos pontuando como se fosse uma competicao real com algo em jogo. Observe seu dialogo interno e respiracao sob essa pressao. Avalie sua compostura mental por buraco, 1 a 3.",label:"Buracos com compostura"},
  m9:{name:"Processo Acima do Resultado",purpose:"Se desapegar dos resultados",desc:"Bata 15 tacadas, mas se avalie apenas pela qualidade da rotina e compromisso — ignore completamente para onde a bola vai. Isso redireciona o foco para o que voce controla.",label:"Repeticoes de qualidade"},
};
const WHY_FR = {
  p1:"La porte force une lecture honnete de l'angle de votre face — si la face du putter s'ouvre ou se ferme meme legerement, la balle touche un tee au lieu de rouler proprement.",
  p2:"Des putts faisables depuis tous les angles construisent le rythme et la confiance qui se transferent dans les vraies parties, ou la plupart des putts sont a moins de 2 m.",
  p3:"Un putt parfaitement droit isole la mecanique pure du mouvement — aucune variable de lecture de green pour se cacher derriere.",
  p4:"Le lag putting concerne le toucher, pas la mecanique. S'arreter avant de depasser entraine la sensation de deceleration que la plupart des amateurs ne pratiquent jamais.",
  p5:"Retirer votre main arriere expose tout flip ou manipulation a l'impact — la main directrice seule ne peut pas compenser une mauvaise technique.",
  p6:"Une echelle de vitesse de base enseigne a votre corps ce que les differentes distances ressentent vraiment avant d'ajouter de la complexite.",
  p7:"Putter depuis les quatre positions de l'horloge entraine la lecture du break et la constance du mouvement simultanement, puisque chaque angle a un break different.",
  p8:"Egaliser la vitesse sur trois distances entraine la competence centrale du putting : savoir avec quelle force frapper, pas seulement dans quelle direction ca va devier.",
  p9:"Cinq d'affilee avec une remise a zero sur un rate cree un vrai enjeu — votre mouvement sous cette pression est plus proche du golf de tournoi que la repetition mecanique.",
  p10:"Lire et s'engager dans une ligne de break constante, de facon repetee, entraine la confiance dans votre lecture au lieu de douter en plein mouvement.",
  p11:"Une pente a deux niveaux punit durement les erreurs de rythme — c'est la facon la plus rapide de sentir pourquoi la vitesse compte plus que la ligne sur les pentes.",
  p12:"Le volume a distances melangees construit une vraie base statistique de votre putting, pas juste une bonne ou une mauvaise journee.",
  p13:"La pression empilee sur des putts courts et faisables reflete exactement les moments qui coutent vraiment des coups sur le parcours.",
  p14:"Compter le total de putts frappes (pas seulement les reussis) revele a quel point un seul rate coute cher, puisqu'il ajoute instantanement un coup de penalite.",
  p15:"Les longs lag putts separent les bons putteurs des excellents — la plupart des parties sont perdues sur des 3-putts de loin, pas des putts courts rates.",
  s1:"Up and down depuis un point fixe enseigne la sequence en deux coups comme une seule competence, pas deux coups separes.",
  s2:"Atterrir sur un point precis entraine le controle de trajectoire — la plus grande difference de competence entre un bon et un excellent petit jeu.",
  s3:"Un tee comme cible elimine la tentation de simplement 'approcher' — cela force la precision.",
  s4:"Frapper trois distances differentes avec le meme mouvement entraine le toucher et les sensations plutot que des swings memorises.",
  s5:"Les coups bas et roules sont moins risques que le flop — maitriser celui-ci d'abord construit une option fiable avant d'ajouter des options agressives.",
  s6:"Comparer les clubs depuis le meme endroit revele quelle option vous controlez le mieux — cela devient votre choix par defaut, eliminant la fatigue decisionnelle sur le parcours.",
  s7:"La technique de sable concerne presque entierement le point de contact, pas la puissance — la repetition ici construit la sensation de frapper le sable, pas la balle.",
  s8:"Un pitch plus long demande un rythme de swing complet sur une longueur plus courte — la plupart des mauvais contacts ici viennent du fait de se presser dans le tempo.",
  s9:"Les pentes changent votre point bas et votre equilibre — pratiquer en montee et en descente construit une adaptabilite impossible a obtenir sur terrain plat.",
  s10:"Un coup haut et doux ne fonctionne qu'avec un engagement complet dans la technique — les tentatives a demi-effort finissent souvent courtes ou grattees.",
  s11:"Cinq positions differentes en une seance force une adaptation rapide — exactement la competence que le scrambling sur le parcours exige.",
  s12:"Dix-huit situations simulees construisent l'endurance et la constance d'une vraie partie d'occasions de scrambling.",
  s13:"Aucun coup d'essai ni reprise reflete les conditions reelles — s'engager froidement dans un coup est une competence en soi.",
  l1:"Se concentrer uniquement sur le contact (sans cible) elimine la pression du resultat pour que vous puissiez ressentir ce qu'une frappe centree donne vraiment.",
  l2:"Ralentir le swing expose les defauts de sequencement invisibles a pleine vitesse.",
  l3:"Pieds joints elimine la capacite de se balancer, forcant la rotation a venir de la torsion du corps plutot que d'une compensation par transfert de poids.",
  l4:"Entrainer votre point bas par rapport a la balle construit le contact balle-puis-gazon qui separe les frappes propres des coups gras ou fins.",
  l5:"Un corridor defini vous donne une vraie cible reussite/echec au lieu d'un sentiment vague de 'bien frapper'.",
  l6:"Une distance fixe avec du volume construit un vrai motif de dispersion — vous verrez votre vraie tendance de deviation, pas juste la devinette.",
  l7:"Donner forme aux coups a la demande prouve que vous controlez le vol de balle plutot que de simplement reagir a ce que le club donne.",
  l8:"Les distances de wedge sont les plus controlables du sac — les calibrer ici reduit directement vos scores a l'interieur de 100m.",
  l9:"Repeter un seul coup vers une seule cible sans variation isole la pure constance, separee de la variete de competences.",
  l10:"Simuler de vraies distances de trous sans pression supplementaire construit une pratique realiste de parcours au lieu d'un travail abstrait au practice.",
  l11:"Noter chaque club du sac honnetement revele lesquels vous faites confiance et lesquels ont besoin de travail — la plupart des joueurs se trompent ici.",
  l12:"Un corridor etroit sous pression auto-imposee est la simulation de practice la plus proche d'un coup de depart serre qui compte vraiment.",
  l13:"Les coups de recuperation sont inevitables dans les vraies parties — les repeter elimine la panique qui transforme un mauvais coup en trois.",
  m1:"Une routine repetable reduit la fatigue decisionnelle et l'anxiete, car votre corps sait deja ce qui vient ensuite.",
  m2:"Visualiser le coup prepare votre systeme nerveux pour le mouvement reel — les performeurs d'elite dans tous les sports utilisent cela pour une raison.",
  m3:"Une respiration interrompt la spirale apres un mauvais coup avant qu'elle ne s'aggrave vers le coup suivant.",
  m4:"Un engagement rapide et complet l'emporte presque toujours sur une decision lente et pleine de doute en golf — l'hesitation cause plus de mauvais coups que les mauvais swings.",
  m5:"La pression auto-imposee sur un seul putt repete exactement l'etat mental que vous ressentirez sur un putt qui compte vraiment.",
  m6:"Pratiquer la recuperation, pas seulement le bon coup, construit la resilience qui empeche une erreur de se transformer en trois.",
  m7:"La fatigue revele si votre routine est reelle ou juste une habitude — la qualite en fin de seance predit la qualite en fin de partie.",
  m8:"Les enjeux simules activent la meme reponse du systeme nerveux que la vraie competition, ce qui est la seule facon de pratiquer le sang-froid.",
  m9:"Noter le processus plutot que le resultat reentraine votre cerveau a valoriser ce que vous controlez, ce qui paradoxalement ameliore les resultats avec le temps.",
};
const WHY_ES = {
  p1:"La puerta fuerza una lectura honesta de tu angulo de cara — si la cara del putter se abre o cierra incluso levemente, la bola golpea un tee en lugar de rodar limpiamente.",
  p2:"Putts factibles desde cada angulo construyen el ritmo y la confianza que se transfieren a las rondas reales, donde la mayoria de los putts estan dentro de 2 m.",
  p3:"Un putt perfectamente recto aisla la mecanica pura del movimiento — sin variable de lectura de green para esconderse detras.",
  p4:"El lag putting trata sobre el toque, no la mecanica. Detenerse antes de pasar entrena la sensacion de desaceleracion que la mayoria de los amateurs nunca practican.",
  p5:"Quitar tu mano trasera expone cualquier latigazo o manipulacion en el impacto — la mano guia sola no puede compensar una mala tecnica.",
  p6:"Una escalera de velocidad basica le ensena a tu cuerpo como se sienten realmente las diferentes distancias antes de anadir complejidad.",
  p7:"Putear desde las cuatro posiciones del reloj entrena la lectura de la curva y la consistencia del movimiento simultaneamente, ya que cada angulo tiene una curva diferente.",
  p8:"Igualar la velocidad en tres distancias entrena la habilidad central del putting: saber con cuanta fuerza golpear, no solo en que direccion se desviara.",
  p9:"Cinco seguidos con reinicio en un fallo crea un riesgo real — tu movimiento bajo esa presion esta mas cerca del golf de torneo que la repeticion mecanica.",
  p10:"Leer y comprometerse con una linea de curva consistente, repetidamente, entrena la confianza en tu lectura en lugar de dudar a mitad del movimiento.",
  p11:"Una pendiente de dos niveles castiga brutalmente los errores de ritmo — esta es la forma mas rapida de sentir por que la velocidad importa mas que la linea en las pendientes.",
  p12:"El volumen a distancias mezcladas construye una verdadera base estadistica de tu putting, no solo un buen o mal dia.",
  p13:"La presion acumulada en putts cortos y factibles refleja exactamente los momentos que realmente cuestan golpes en el campo.",
  p14:"Contar el total de putts realizados (no solo los embocados) revela cuan costoso es realmente un solo fallo, ya que anade un golpe de penalizacion al instante.",
  p15:"Los putts largos separan a los buenos puteadores de los excelentes — la mayoria de las rondas se pierden por 3-putts desde distancia, no putts cortos fallados.",
  s1:"Up and down desde un punto fijo ensena la secuencia de dos tiros como una sola habilidad, no dos tiros separados.",
  s2:"Aterrizar en un punto especifico entrena el control de trayectoria — la mayor diferencia de habilidad entre un buen y un gran juego corto.",
  s3:"Un tee como objetivo elimina la tentacion de simplemente 'acercarla' — fuerza la precision.",
  s4:"Golpear tres distancias diferentes con el mismo movimiento entrena el toque y la sensibilidad en lugar de swings memorizados.",
  s5:"Los tiros bajos y rodados son menos riesgosos que el flop — dominar este primero construye una opcion confiable antes de anadir opciones agresivas.",
  s6:"Comparar palos desde el mismo lugar revela cual opcion controlas mejor — eso se convierte en tu opcion por defecto, eliminando la fatiga de decision en el campo.",
  s7:"La tecnica de arena es casi completamente sobre el punto de contacto, no la potencia — la repeticion aqui construye la sensacion de golpear la arena, no la bola.",
  s8:"Un pitch mas largo exige ritmo de swing completo en una longitud mas corta — la mayoria de los golpes mal ejecutados aqui vienen de apresurar el tempo.",
  s9:"Las pendientes cambian tu punto bajo y equilibrio — practicar cuesta arriba y cuesta abajo construye una adaptabilidad que no puedes obtener en terreno plano.",
  s10:"Un tiro alto y suave solo funciona con compromiso total con la tecnica — los intentos de medio esfuerzo usualmente quedan cortos o rascan.",
  s11:"Cinco posiciones diferentes en una sesion fuerza un ajuste rapido — exactamente la habilidad que exige el scrambling en el campo.",
  s12:"Dieciocho situaciones simuladas construyen la resistencia y consistencia de las oportunidades de scrambling de una ronda real.",
  s13:"Sin swing de practica ni repeticion refleja las condiciones reales — comprometerse en frio con un tiro es una habilidad en si misma.",
  l1:"Enfocarse solo en el contacto (sin objetivo) elimina la presion del resultado para que puedas sentir como se siente realmente un golpe centrado.",
  l2:"Desacelerar el swing expone fallas de secuencia invisibles a toda velocidad.",
  l3:"Pies juntos elimina la capacidad de balancearse, forzando el giro a venir de la rotacion en lugar de una compensacion por transferencia de peso.",
  l4:"Entrenar tu punto bajo relativo a la bola construye el contacto bola-luego-cesped que separa los golpes limpios de los gordos o delgados.",
  l5:"Un corredor definido te da un objetivo real de exito/fracaso en lugar de una sensacion vaga de 'golpearlo bien'.",
  l6:"Una distancia fija con volumen construye un verdadero patron de dispersion — veras tu tendencia real de desviacion, no solo adivinaras.",
  l7:"Dar forma a los tiros a demanda prueba que controlas el vuelo de la bola en lugar de simplemente reaccionar a lo que da el palo.",
  l8:"Las distancias de wedge son las mas controlables de la bolsa — calibrarlas aqui reduce directamente tus puntuaciones dentro de 100m.",
  l9:"Repetir un tiro a un objetivo sin variacion aisla la pura consistencia, separada de la variedad de habilidades.",
  l10:"Simular distancias de hoyos reales sin presion adicional construye practica realista de campo en lugar de trabajo abstracto de rango.",
  l11:"Calificar cada palo de la bolsa honestamente revela en cuales confias y cuales necesitan trabajo — la mayoria de los jugadores se equivocan aqui.",
  l12:"Un corredor estrecho bajo presion autoimpuesta es la simulacion de rango mas cercana a un tiro de salida ajustado que realmente importa.",
  l13:"Los tiros de recuperacion son inevitables en rondas reales — ensayarlos elimina el panico que convierte un mal tiro en tres.",
  m1:"Una rutina repetible reduce la fatiga de decision y la ansiedad, porque tu cuerpo ya sabe que viene despues.",
  m2:"Visualizar el tiro prepara tu sistema nervioso para el movimiento real — los atletas de elite en todos los deportes usan esto por una razon.",
  m3:"Una respiracion interrumpe la espiral despues de un mal tiro antes de que se agrave hacia el siguiente.",
  m4:"El compromiso rapido y total vence casi siempre a una decision lenta y llena de duda en el golf — la duda causa mas malos tiros que los malos swings.",
  m5:"La presion autoimpuesta en un solo putt ensaya exactamente el estado mental que sentiras en un putt que realmente importa.",
  m6:"Practicar la recuperacion, no solo el buen tiro, construye la resiliencia que evita que un error se convierta en tres.",
  m7:"La fatiga revela si tu rutina es real o solo un habito — la calidad al final de la sesion predice la calidad al final de la ronda.",
  m8:"Los riesgos simulados activan la misma respuesta del sistema nervioso que la competencia real, que es la unica forma de practicar la compostura.",
  m9:"Calificar el proceso en lugar del resultado reentrena tu cerebro para valorar lo que controlas, lo cual paradojicamente mejora los resultados con el tiempo.",
};
const WHY_DE = {
  p1:"Das Tor zwingt zu einer ehrlichen Einschaetzung deines Schlagflaechenwinkels — wenn die Putterflaeche sich auch nur leicht oeffnet oder schliesst, streift der Ball ein Tee statt sauber durchzurollen.",
  p2:"Machbare Putts aus jedem Winkel bauen den Rhythmus und das Vertrauen auf, das sich auf echte Runden uebertraegt, wo die meisten Putts innerhalb von 2 m liegen.",
  p3:"Ein vollkommen gerader Putt isoliert die reine Schlagmechanik — keine Gruenlese-Variable, hinter der man sich verstecken kann.",
  p4:"Beim Lag-Putting geht es um Gefuehl, nicht Mechanik. Kurz vor dem Loch zu stoppen trainiert das Verzoegerungsgefuehl, das die meisten Amateure nie ueben.",
  p5:"Die hintere Hand zu entfernen zeigt jedes Flippen oder Manipulieren beim Treffmoment — die fuehrende Hand allein kann schlechte Technik nicht ausgleichen.",
  p6:"Eine grundlegende Geschwindigkeitsleiter lehrt deinen Koerper, wie sich verschiedene Distanzen tatsaechlich anfuehlen, bevor Komplexitaet hinzugefuegt wird.",
  p7:"Putten aus allen vier Uhrpositionen trainiert Break-Lesen und Schlagkonstanz gleichzeitig, da jeder Winkel anders bricht.",
  p8:"Geschwindigkeit ueber drei Distanzen anzupassen trainiert die Kernfaehigkeit des Puttens: zu wissen, wie hart man schlagen muss, nicht nur in welche Richtung es bricht.",
  p9:"Fuenf in Folge mit Reset bei Fehlschlag schafft echten Einsatz — dein Schlag unter diesem Druck ist naeher am Turniergolf als stumpfe Wiederholung.",
  p10:"Eine konstante Break-Linie wiederholt zu lesen und sich dafuer zu engagieren, trainiert Vertrauen in deine Lesefaehigkeit statt mitten im Schlag zu zweifeln.",
  p11:"Ein zweistufiger Hang bestraft Tempofehler brutal — das ist der schnellste Weg zu fuehlen, warum Geschwindigkeit auf Haengen wichtiger ist als die Linie.",
  p12:"Volumen bei gemischten Distanzen baut eine echte statistische Basis deines Puttings auf, nicht nur einen guten oder schlechten Tag.",
  p13:"Druck auf kurze, machbare Putts gestapelt spiegelt genau die Momente wider, die auf dem Platz tatsaechlich Schlaege kosten.",
  p14:"Die Gesamtzahl der gespielten Putts zu zaehlen (nicht nur die eingelochten) zeigt, wie teuer ein einzelner Fehlschlag wirklich ist, da er sofort einen Strafschlag hinzufuegt.",
  p15:"Lange Lag-Putts trennen gute von grossartigen Puttern — die meisten Runden werden durch 3-Putts aus der Distanz verloren, nicht verpasste kurze Putts.",
  s1:"Up and Down von einem festen Punkt lehrt die Zweischlag-Sequenz als eine Faehigkeit, nicht zwei getrennte Schlaege.",
  s2:"Auf einem bestimmten Punkt zu landen trainiert Flugbahnkontrolle — der grosste Faehigkeitsunterschied zwischen einem guten und einem grossartigen kurzen Spiel.",
  s3:"Ein Tee als Ziel beseitigt die Versuchung, es einfach 'nahe' zu bringen — es zwingt zur Praezision.",
  s4:"Drei verschiedene Distanzen mit der gleichen Bewegung zu spielen trainiert Gefuehl und Touch statt einstudierter Schwuenge.",
  s5:"Niedrige, rollende Schlaege sind weniger riskant als der Flop — diesen zuerst zu meistern baut eine zuverlaessige Standardoption auf, bevor aggressive Optionen hinzukommen.",
  s6:"Schlaeger vom gleichen Punkt zu vergleichen zeigt, welche Option du am besten kontrollierst — das wird deine Standardwahl und beseitigt Entscheidungsmuedigkeit auf dem Platz.",
  s7:"Sandtechnik geht fast vollstaendig um den Kontaktpunkt, nicht Kraft — Wiederholung hier baut das Gefuehl auf, den Sand zu treffen, nicht den Ball.",
  s8:"Ein laengerer Pitch erfordert vollen Schwungrhythmus bei kuerzerer Laenge — die meisten Fehlschlaege hier kommen vom Hetzen des Tempos.",
  s9:"Haenge veraendern deinen Tiefpunkt und dein Gleichgewicht — bergauf und bergab zu uebenbaut Anpassungsfaehigkeit auf, die man auf flachem Boden nicht bekommt.",
  s10:"Ein hoher, weicher Schlag funktioniert nur mit vollem Engagement fuer die Technik — Versuche mit halbem Einsatz bleiben meist kurz oder werden geschunden.",
  s11:"Fuenf verschiedene Lagen in einer Sitzung zwingen zu schneller Anpassung — genau die Faehigkeit, die Scrambling auf dem Platz erfordert.",
  s12:"Achtzehn simulierte Situationen bauen die Ausdauer und Konstanz der Scrambling-Chancen einer echten Runde auf.",
  s13:"Kein Probeschwung oder Wiederholung spiegelt echte Bedingungen wider — sich kalt fuer einen Schlag zu engagieren ist eine eigene Faehigkeit.",
  l1:"Sich nur auf Kontakt zu konzentrieren (ohne Ziel) beseitigt Ergebnisdruck, damit du fuehlen kannst, wie sich ein zentrierter Treffer wirklich anfuehlt.",
  l2:"Den Schwung zu verlangsamen zeigt Sequenzierungsfehler, die bei voller Geschwindigkeit unsichtbar sind.",
  l3:"Zusammengestellte Fuesse beseitigen die Faehigkeit zu schwanken und zwingen die Drehung, aus der Rotation statt aus Gewichtsausgleich zu kommen.",
  l4:"Deinen Tiefpunkt relativ zum Ball zu trainieren baut den Ball-dann-Rasen-Kontakt auf, der saubere von duenneren oder fetten Schlaegen trennt.",
  l5:"Ein definierter Korridor gibt dir ein echtes Erfolg/Misserfolg-Ziel statt eines vagen Gefuehls von 'gut getroffen'.",
  l6:"Eine feste Distanz mit Volumen baut ein echtes Streumuster auf — du siehst deine echte Fehlschlagtendenz, statt nur zu raten.",
  l7:"Schlaege nach Bedarf zu formen beweist, dass du den Ballflug kontrollierst, statt nur auf das zu reagieren, was der Schlaeger gibt.",
  l8:"Wedge-Distanzen sind die kontrollierbarsten in der Tasche — sie hier zu kalibrieren senkt direkt deine Ergebnisse innerhalb von 100m.",
  l9:"Einen Schlag auf ein Ziel ohne Variation zu wiederholen isoliert reine Konstanz, getrennt von Faehigkeitsvielfalt.",
  l10:"Echte Lochdistanzen ohne zusaetzlichen Druck zu simulieren baut platzrealistisches Training auf statt abstrakte Range-Arbeit.",
  l11:"Jeden Schlaeger in der Tasche ehrlich zu bewerten zeigt, welchen du vertraust und welche Arbeit brauchen — die meisten Spieler liegen hier falsch.",
  l12:"Ein enger Korridor unter selbst auferlegtem Druck ist die naechste Range-Simulation zu einem engen Abschlag, der wirklich zaehlt.",
  l13:"Erholungsschlaege sind in echten Runden unvermeidlich — sie zu proben beseitigt die Panik, die einen schlechten Schlag in drei verwandelt.",
  m1:"Eine wiederholbare Routine reduziert Entscheidungsmuedigkeit und Angst, weil dein Koerper bereits weiss, was als naechstes kommt.",
  m2:"Den Schlag zu visualisieren bereitet dein Nervensystem auf die tatsaechliche Bewegung vor — Spitzensportler in allen Sportarten nutzen das aus gutem Grund.",
  m3:"Ein Atemzug unterbricht die Spirale nach einem schlechten Schlag, bevor sie sich zum naechsten verstaerkt.",
  m4:"Schnelles, volles Engagement schlaegt im Golf fast immer eine langsame, zweifelbehaftete Entscheidung — Zoegern verursacht mehr schlechte Schlaege als schlechte Schwuenge.",
  m5:"Selbst aufgelegter Druck auf einen einzelnen Putt probt genau den mentalen Zustand, den du bei einem wirklich wichtigen Putt fuehlen wirst.",
  m6:"Die Erholung zu uebenn, nicht nur den guten Schlag, baut die Resilienz auf, die verhindert, dass ein Fehler zu drei wird.",
  m7:"Muedigkeit zeigt, ob deine Routine echt ist oder nur Gewohnheit — Qualitaet spaet in der Sitzung sagt Qualitaet spaet in der Runde voraus.",
  m8:"Simulierte Einsaetze aktivieren die gleiche Nervensystemreaktion wie echter Wettkampf, was die einzige Moeglichkeit ist, Gelassenheit zu uebenn.",
  m9:"Prozess statt Ergebnis zu bewerten trainiert dein Gehirn um, das zu schaetzen, was du kontrollierst, was paradoxerweise die Ergebnisse mit der Zeit verbessert.",
};
const WHY_IT = {
  p1:"Il cancello forza una lettura onesta del tuo angolo di faccia — se la faccia del putter si apre o chiude anche leggermente, la palla colpisce un tee invece di rotolare pulita.",
  p2:"Putt fattibili da ogni angolo costruiscono il ritmo e la fiducia che si trasferiscono ai round reali, dove la maggior parte dei putt sono entro 2 m.",
  p3:"Un putt perfettamente dritto isola la pura meccanica del movimento — nessuna variabile di lettura del green dietro cui nascondersi.",
  p4:"Il lag putting riguarda il tocco, non la meccanica. Fermarsi prima di superare allena la sensazione di decelerazione che la maggior parte degli amatori non pratica mai.",
  p5:"Togliere la mano posteriore espone qualsiasi flip o manipolazione all'impatto — la mano guida da sola non puo compensare una tecnica scorretta.",
  p6:"Una scala di velocita base insegna al tuo corpo come si sentono realmente le diverse distanze prima di aggiungere complessita.",
  p7:"Puttare dalle quattro posizioni dell'orologio allena la lettura dell'effetto e la costanza del movimento simultaneamente, poiche ogni angolo ha un effetto diverso.",
  p8:"Eguagliare la velocita su tre distanze allena l'abilita centrale del putting: sapere con quanta forza colpire, non solo in quale direzione devierà.",
  p9:"Cinque di fila con reset al fallimento crea una vera posta in gioco — il tuo movimento sotto quella pressione e piu vicino al golf da torneo che alla ripetizione meccanica.",
  p10:"Leggere e impegnarsi in una linea di effetto costante, ripetutamente, allena la fiducia nella tua lettura invece di dubitare a meta movimento.",
  p11:"Un pendio a due livelli punisce brutalmente gli errori di ritmo — questo e il modo piu rapido per sentire perche la velocita conta piu della linea sui pendii.",
  p12:"Il volume a distanze mescolate costruisce una vera base statistica del tuo putting, non solo una buona o brutta giornata.",
  p13:"La pressione accumulata su putt corti e fattibili rispecchia esattamente i momenti che realmente costano colpi sul campo.",
  p14:"Contare il totale dei putt giocati (non solo quelli imbucati) rivela quanto costa realmente un singolo errore, poiche aggiunge istantaneamente un colpo di penalita.",
  p15:"I lag putt lunghi separano i bravi putter dai grandi — la maggior parte dei round si perde per 3-putt da distanza, non putt corti falliti.",
  s1:"Up and down da un punto fisso insegna la sequenza in due colpi come un'unica abilita, non due colpi separati.",
  s2:"Atterrare su un punto specifico allena il controllo della traiettoria — la maggiore differenza di abilita tra un buon e un grande gioco corto.",
  s3:"Un tee come obiettivo elimina la tentazione di semplicemente 'avvicinarla' — forza la precisione.",
  s4:"Colpire tre distanze diverse con lo stesso movimento allena il tocco e la sensibilita invece di swing memorizzati.",
  s5:"I colpi bassi e rullanti sono meno rischiosi del flop — padroneggiare questo prima costruisce un'opzione affidabile prima di aggiungere opzioni aggressive.",
  s6:"Confrontare i bastoni dallo stesso punto rivela quale opzione controlli meglio — quella diventa la tua scelta predefinita, eliminando la fatica decisionale in campo.",
  s7:"La tecnica della sabbia riguarda quasi interamente il punto di contatto, non la potenza — la ripetizione qui costruisce la sensazione di colpire la sabbia, non la palla.",
  s8:"Un pitch piu lungo richiede ritmo di swing completo su una lunghezza piu corta — la maggior parte degli errori qui viene dall'affrettare il tempo.",
  s9:"I pendii cambiano il tuo punto basso e l'equilibrio — praticare sia in salita che in discesa costruisce un'adattabilita che non si ottiene su terreno piano.",
  s10:"Un colpo alto e morbido funziona solo con pieno impegno nella tecnica — i tentativi a meta sforzo di solito finiscono corti o raschiati.",
  s11:"Cinque posizioni diverse in una sessione forzano un rapido adattamento — esattamente l'abilita che lo scrambling in campo richiede.",
  s12:"Diciotto situazioni simulate costruiscono la resistenza e la costanza delle opportunita di scrambling di un vero round.",
  s13:"Nessun swing di prova o ripetizione rispecchia le condizioni reali — impegnarsi a freddo in un colpo e un'abilita a se stante.",
  l1:"Concentrarsi solo sul contatto (senza obiettivo) elimina la pressione del risultato cosi puoi sentire come si sente realmente un colpo centrato.",
  l2:"Rallentare lo swing espone difetti di sequenza invisibili a piena velocita.",
  l3:"Piedi uniti eliminano la capacita di oscillare, forzando la rotazione a venire dalla torsione invece che da una compensazione di trasferimento del peso.",
  l4:"Allenare il tuo punto basso relativo alla palla costruisce il contatto palla-poi-erba che separa i colpi puliti da quelli grassi o sottili.",
  l5:"Un corridoio definito ti da un vero obiettivo successo/fallimento invece di una vaga sensazione di 'colpirla bene'.",
  l6:"Una distanza fissa con volume costruisce un vero modello di dispersione — vedrai la tua vera tendenza di errore, non solo indovinerai.",
  l7:"Dare forma ai colpi su richiesta dimostra che controlli il volo della palla invece di reagire semplicemente a quello che da il bastone.",
  l8:"Le distanze del wedge sono le piu controllabili nel sacco — calibrarle qui riduce direttamente i tuoi punteggi entro 100m.",
  l9:"Ripetere un colpo verso un obiettivo senza variazione isola la pura costanza, separata dalla varieta di abilita.",
  l10:"Simulare distanze realistiche dei buchi senza pressione extra costruisce una pratica realistica da campo invece di lavoro astratto al range.",
  l11:"Valutare onestamente ogni bastone nel sacco rivela in quali confidi e quali necessitano lavoro — la maggior parte dei giocatori si sbaglia qui.",
  l12:"Un corridoio stretto sotto pressione autoimposta e la simulazione da range piu vicina a un tiro dal tee stretto che conta davvero.",
  l13:"I colpi di recupero sono inevitabili nei round reali — provarli elimina il panico che trasforma un brutto colpo in tre.",
  m1:"Una routine ripetibile riduce la fatica decisionale e l'ansia, perche il tuo corpo sa gia cosa viene dopo.",
  m2:"Visualizzare il colpo prepara il tuo sistema nervoso al movimento reale — gli atleti d'elite in tutti gli sport usano questo per un motivo.",
  m3:"Un respiro interrompe la spirale dopo un brutto colpo prima che si aggravi verso il successivo.",
  m4:"Un impegno rapido e completo batte quasi sempre una decisione lenta e piena di dubbi nel golf — l'esitazione causa piu brutti colpi degli swing scorretti.",
  m5:"La pressione autoimposta su un singolo putt prova esattamente lo stato mentale che sentirai su un putt che conta davvero.",
  m6:"Praticare il recupero, non solo il buon colpo, costruisce la resilienza che impedisce a un errore di diventarne tre.",
  m7:"La fatica rivela se la tua routine e reale o solo abitudine — la qualita a fine sessione predice la qualita a fine round.",
  m8:"Le poste in gioco simulate attivano la stessa risposta del sistema nervoso della vera competizione, che e l'unico modo per praticare la calma.",
  m9:"Valutare il processo invece del risultato riallena il tuo cervello a valorizzare cio che controlli, il che paradossalmente migliora i risultati nel tempo.",
};
const WHY_PT = {
  p1:"O portao forca uma leitura honesta do seu angulo de face — se a face do putter abrir ou fechar mesmo levemente, a bola toca um tee em vez de rolar limpa.",
  p2:"Putts viaveis de todos os angulos constroem o ritmo e a confianca que se transferem para rodadas reais, onde a maioria dos putts esta dentro de 2 m.",
  p3:"Um putt perfeitamente reto isola a mecanica pura do movimento — sem variavel de leitura de green para se esconder.",
  p4:"O lag putting e sobre toque, nao mecanica. Parar antes de passar treina a sensacao de desaceleracao que a maioria dos amadores nunca pratica.",
  p5:"Remover sua mao de tras expoe qualquer flip ou manipulacao no impacto — a mao guia sozinha nao pode compensar tecnica ruim.",
  p6:"Uma escada de velocidade basica ensina ao seu corpo como as diferentes distancias realmente se sentem antes de adicionar complexidade.",
  p7:"Putar das quatro posicoes do relogio treina leitura de curva e consistencia de movimento simultaneamente, ja que cada angulo quebra diferente.",
  p8:"Igualar a velocidade em tres distancias treina a habilidade central do putting: saber com que forca bater, nao apenas em que direcao vai quebrar.",
  p9:"Cinco seguidos com reinicio no erro cria risco real — seu movimento sob essa pressao esta mais proximo do golfe de torneio do que repeticao mecanica.",
  p10:"Ler e se comprometer com uma linha de curva consistente, repetidamente, treina confianca na sua leitura em vez de duvidar no meio do movimento.",
  p11:"Uma inclinacao de dois niveis pune brutalmente erros de ritmo — esta e a forma mais rapida de sentir por que a velocidade importa mais que a linha em inclinacoes.",
  p12:"O volume em distancias variadas constroi uma verdadeira linha de base estatistica do seu putting, nao apenas um bom ou mau dia.",
  p13:"A pressao empilhada em putts curtos e viaveis reflete exatamente os momentos que realmente custam tacadas no campo.",
  p14:"Contar o total de putts batidos (nao apenas os encaçapados) revela quao custoso um unico erro realmente e, pois adiciona instantaneamente uma tacada de penalidade.",
  p15:"Putts longos separam bons puteadores de excelentes — a maioria das rodadas e perdida por 3-putts de distancia, nao putts curtos perdidos.",
  s1:"Up and down de um ponto fixo ensina a sequencia de duas tacadas como uma habilidade, nao duas tacadas separadas.",
  s2:"Aterrissar em um ponto especifico treina controle de trajetoria — a maior diferenca de habilidade entre um bom e um grande jogo curto.",
  s3:"Um tee como alvo elimina a tentacao de apenas 'aproximar' — forca a precisao.",
  s4:"Bater em tres distancias diferentes com o mesmo movimento treina toque e sensibilidade em vez de swings memorizados.",
  s5:"Tacadas baixas e roladas sao menos arriscadas que o flop — dominar esta primeiro constroi uma opcao confiavel antes de adicionar opcoes agressivas.",
  s6:"Comparar tacos do mesmo lugar revela qual opcao voce controla melhor — essa se torna sua escolha padrao, eliminando fadiga de decisao no campo.",
  s7:"A tecnica de areia e quase inteiramente sobre o ponto de contato, nao forca — a repeticao aqui constroi a sensacao de bater na areia, nao na bola.",
  s8:"Um pitch mais longo exige ritmo de swing completo em um comprimento mais curto — a maioria dos erros aqui vem de apressar o tempo.",
  s9:"Inclinacoes mudam seu ponto baixo e equilibrio — praticar tanto subida quanto descida constroi uma adaptabilidade que nao se obtem em terreno plano.",
  s10:"Uma tacada alta e suave so funciona com compromisso total com a tecnica — tentativas de meio esforco geralmente ficam curtas ou raspam.",
  s11:"Cinco posicoes diferentes em uma sessao forcam ajuste rapido — exatamente a habilidade que o scrambling no campo exige.",
  s12:"Dezoito situacoes simuladas constroem a resistencia e consistencia das oportunidades de scrambling de uma rodada real.",
  s13:"Nenhum swing de pratica ou repeticao reflete condicoes reais — se comprometer a frio com uma tacada e uma habilidade por si so.",
  l1:"Focar apenas no contato (sem alvo) elimina a pressao do resultado para que voce possa sentir como uma tacada centralizada realmente se sente.",
  l2:"Desacelerar o swing expoe falhas de sequenciamento invisiveis em velocidade total.",
  l3:"Pes juntos eliminam a capacidade de balancar, forcando o giro a vir da rotacao em vez de uma compensacao por transferencia de peso.",
  l4:"Treinar seu ponto baixo em relacao a bola constroi o contato bola-depois-grama que separa tacadas limpas de gordas ou finas.",
  l5:"Um corredor definido te da um verdadeiro alvo de sucesso/fracasso em vez de uma sensacao vaga de 'acertar bem'.",
  l6:"Uma distancia fixa com volume constroi um verdadeiro padrao de dispersao — voce vera sua verdadeira tendencia de erro, nao apenas vai adivinhar.",
  l7:"Dar forma as tacadas sob demanda prova que voce controla o voo da bola em vez de apenas reagir ao que o taco da.",
  l8:"Distancias de wedge sao as mais controlaveis na sacola — calibra-las aqui reduz diretamente suas pontuacoes dentro de 100m.",
  l9:"Repetir uma tacada para um alvo sem variacao isola a pura consistencia, separada da variedade de habilidades.",
  l10:"Simular distancias reais de buracos sem pressao extra constroi pratica realista de campo em vez de trabalho abstrato de range.",
  l11:"Avaliar cada taco da sacola honestamente revela em quais voce confia e quais precisam de trabalho — a maioria dos jogadores erra aqui.",
  l12:"Um corredor estreito sob pressao auto-imposta e a simulacao de range mais proxima de uma tacada de saida apertada que realmente importa.",
  l13:"Tacadas de recuperacao sao inevitaveis em rodadas reais — ensaia-las elimina o panico que transforma uma tacada ruim em tres.",
  m1:"Uma rotina repetivel reduz fadiga de decisao e ansiedade, porque seu corpo ja sabe o que vem a seguir.",
  m2:"Visualizar a tacada prepara seu sistema nervoso para o movimento real — atletas de elite em todos os esportes usam isso por um motivo.",
  m3:"Uma respiracao interrompe a espiral apos uma tacada ruim antes que ela se agrave para a proxima.",
  m4:"Compromisso rapido e total vence quase sempre uma decisao lenta e cheia de duvidas no golfe — hesitacao causa mais tacadas ruins do que swings ruins.",
  m5:"Pressao auto-imposta em um unico putt ensaia exatamente o estado mental que voce sentira em um putt que realmente importa.",
  m6:"Praticar a recuperacao, nao apenas a boa tacada, constroi a resiliencia que impede um erro de se tornar tres.",
  m7:"A fadiga revela se sua rotina e real ou apenas habito — qualidade no final da sessao prediz qualidade no final da rodada.",
  m8:"Riscos simulados ativam a mesma resposta do sistema nervoso que a competicao real, que e a unica forma de praticar a compostura.",
  m9:"Avaliar o processo em vez do resultado retreina seu cerebro para valorizar o que voce controla, o que paradoxalmente melhora os resultados com o tempo.",
};
const FIN_TR = {
  en:{
    shortGame:{name:"Short Game Finisher", shortName:"Short Game", resultLabel:"Short Game Handicap Score", intro:"Five lies, ten balls each. This is the real test of your scrambling — not just whether you get up and down, but how close you get when you don't.", scoringNote:"Per ball: 2 pts if up-and-down inside the target zone, 1 pt if on the green but outside it, 0 if you miss the green entirely."},
    putting:{name:"Putting Finisher", shortName:"Putting", resultLabel:"Putting Handicap Score", intro:"Five stations testing every putting skill you actually need on the course: short putts, mid range, lag, start-line control, and pressure."},
    longGame:{name:"Long Game Finisher", shortName:"Long Game", resultLabel:"Long Game Handicap Score", intro:"Four stations covering the full long game: off the tee, approach accuracy, distance control, and performing when it matters."},
    sg1:{name:"Tight Lie", desc:"From a tight, hardpan-style lie just off the green. 10 balls.", why:"Tight lies punish anyone who scoops at the ball — this station tests clean, ball-first contact under the least forgiving conditions."},
    sg2:{name:"Rough", desc:"From thick rough around the green. 10 balls.", why:"Grass grabs the clubface in rough, so distance control here depends on reading the lie correctly before you commit to the shot."},
    sg3:{name:"Bunker", desc:"From a greenside bunker. 10 balls.", why:"Sand technique is about hitting the sand, not the ball — this station isolates that one skill under real scoring pressure."},
    sg4:{name:"Long Pitch", desc:"A longer pitch shot, roughly 25-30m to the green. 10 balls.", why:"A longer pitch demands full tempo at a controlled length — most misses here come from rushing rather than poor technique."},
    sg5:{name:"Short Chip", desc:"A short chip from just off the green, under 10m. 10 balls.", why:"Short chips are the highest-frequency shot in real rounds — small errors here cost the most strokes over a season."},
    pt1:{name:"Short Putts", desc:"10 putts from 1.5 m.", why:"These are the putts that should never be missed in a real round — this station tests whether your routine holds up on the makeable ones."},
    pt2:{name:"Mid Range", desc:"10 putts from 3 m.", why:"Mid-range putting blends line and speed equally — neither mechanics nor feel alone gets you through this station."},
    pt3:{name:"Lag Putting", desc:"10 m putt. Score if the ball finishes within 60 cm of the hole.", why:"Most 3-putts start from distance, not from a bad read — this station trains the deceleration touch that prevents them."},
    pt4:{name:"Start Line", desc:"Gate drill — 20 attempts at a 2-tee gate just ahead of the ball.", why:"If the putter face is even slightly open or closed at impact, the ball clips a tee — this isolates pure face control from everything else."},
    pt5:{name:"Pressure Putt", desc:"One single putt from 2 m. Make it or don't — no second chances.", why:"One shot, all the weight on it — this mirrors exactly the putt that decides a match, with nowhere to hide."},
    lg1:{name:"Driver Accuracy", desc:"10 tee shots to a defined fairway corridor.", why:"Fairways found is the single biggest driver of scoring — this station measures it directly instead of guessing from feel."},
    lg2:{name:"Iron Accuracy", desc:"20 approach shots to a fixed target.", why:"Twenty reps at one target reveals your real dispersion pattern — most players are surprised by what they actually see here."},
    lg3:{name:"Distance Control", desc:"5 shots at 5 different distances — tests control across your full range.", why:"Hitting it far is easy — hitting it the right far, every time, at five different distances, is the actual skill this measures."},
    lg4:{name:"Pressure Shot", desc:"5 high-stakes shots, one swing each, no redo.", why:"No mulligans, one swing each — this is the closest range work gets to the one shot you actually have on the course."},
  },
  fr:{
    shortGame:{name:"Finisher Petit Jeu", shortName:"Petit Jeu", resultLabel:"Score de Handicap Petit Jeu", intro:"Cinq positions, dix balles chacune. C'est le vrai test de votre scrambling — pas seulement si vous reussissez l'up and down, mais a quel point vous etes proche quand vous ne le faites pas.", scoringNote:"Par balle : 2 pts si up-and-down dans la zone cible, 1 pt si sur le green mais hors de la zone, 0 si vous manquez completement le green."},
    putting:{name:"Finisher Putting", shortName:"Putting", resultLabel:"Score de Handicap Putting", intro:"Cinq stations testant chaque competence de putting dont vous avez vraiment besoin sur le parcours : putts courts, distance moyenne, lag, controle de la ligne de depart, et pression."},
    longGame:{name:"Finisher Long Jeu", shortName:"Long Jeu", resultLabel:"Score de Handicap Long Jeu", intro:"Quatre stations couvrant tout le long jeu : depart, precision d'approche, controle de distance, et performance quand ca compte."},
    sg1:{name:"Position Serree", desc:"Depuis une position serree, style sol dur, juste a cote du green. 10 balles.", why:"Les positions serrees punissent quiconque scoope la balle — cette station teste le contact propre, balle-d'abord, dans les conditions les moins pardonnantes."},
    sg2:{name:"Rough", desc:"Depuis un rough epais autour du green. 10 balles.", why:"L'herbe agrippe la face du club dans le rough, donc le controle de distance ici depend de bien lire la position avant de s'engager dans le coup."},
    sg3:{name:"Bunker", desc:"Depuis un bunker pres du green. 10 balles.", why:"La technique de sable concerne le fait de frapper le sable, pas la balle — cette station isole cette seule competence sous une vraie pression de score."},
    sg4:{name:"Long Pitch", desc:"Un coup de pitch plus long, environ 25-30m vers le green. 10 balles.", why:"Un pitch plus long demande un tempo complet sur une longueur controlee — la plupart des rates ici viennent de la precipitation plutot que d'une mauvaise technique."},
    sg5:{name:"Chip Court", desc:"Un chip court juste a cote du green, a moins de 10m. 10 balles.", why:"Les chips courts sont le coup le plus frequent dans les vraies parties — de petites erreurs ici coutent le plus de coups sur une saison."},
    pt1:{name:"Putts Courts", desc:"10 putts depuis 1.5 m.", why:"Ce sont les putts qui ne devraient jamais etre rates dans une vraie partie — cette station teste si votre routine tient sur les putts faisables."},
    pt2:{name:"Distance Moyenne", desc:"10 putts depuis 3 m.", why:"Le putting a distance moyenne melange ligne et vitesse de facon egale — ni la mecanique ni le toucher seuls ne vous font passer cette station."},
    pt3:{name:"Lag Putting", desc:"Putt de 10 m. Marquez si la balle finit a moins de 60 cm du trou.", why:"La plupart des 3-putts commencent par la distance, pas par une mauvaise lecture — cette station entraine le toucher de deceleration qui les previent."},
    pt4:{name:"Ligne de Depart", desc:"Exercice de porte — 20 tentatives a une porte de 2 tees juste devant la balle.", why:"Si la face du putter est meme legerement ouverte ou fermee a l'impact, la balle touche un tee — cela isole le controle pur de la face de tout le reste."},
    pt5:{name:"Putt sous Pression", desc:"Un seul putt depuis 2 m. Reussissez-le ou non — pas de seconde chance.", why:"Un seul coup, tout le poids dessus — cela reflete exactement le putt qui decide d'un match, sans nulle part ou se cacher."},
    lg1:{name:"Precision au Driver", desc:"10 coups de depart vers un couloir de fairway defini.", why:"Trouver les fairways est le plus grand facteur de scoring — cette station le mesure directement au lieu de deviner au feeling."},
    lg2:{name:"Precision aux Fers", desc:"20 coups d'approche vers une cible fixe.", why:"Vingt repetitions vers une cible revelent votre vrai motif de dispersion — la plupart des joueurs sont surpris par ce qu'ils voient vraiment ici."},
    lg3:{name:"Controle de Distance", desc:"5 coups a 5 distances differentes — teste le controle sur toute votre gamme.", why:"Frapper loin est facile — frapper a la bonne distance, chaque fois, a cinq distances differentes, c'est la vraie competence mesuree ici."},
    lg4:{name:"Coup sous Pression", desc:"5 coups a forts enjeux, un swing chacun, sans reprise.", why:"Pas de mulligan, un swing chacun — c'est la simulation au practice la plus proche du seul coup que vous avez vraiment sur le parcours."},
  },
  es:{
    shortGame:{name:"Finisher de Juego Corto", shortName:"Juego Corto", resultLabel:"Puntuacion de Handicap de Juego Corto", intro:"Cinco posiciones, diez bolas cada una. Esta es la verdadera prueba de tu scrambling — no solo si logras el up and down, sino que tan cerca quedas cuando no lo logras.", scoringNote:"Por bola: 2 pts si up-and-down dentro de la zona objetivo, 1 pt si en el green pero fuera de ella, 0 si fallas el green completamente."},
    putting:{name:"Finisher de Putting", shortName:"Putting", resultLabel:"Puntuacion de Handicap de Putting", intro:"Cinco estaciones probando cada habilidad de putting que realmente necesitas en el campo: putts cortos, distancia media, lag, control de linea de salida, y presion."},
    longGame:{name:"Finisher de Juego Largo", shortName:"Juego Largo", resultLabel:"Puntuacion de Handicap de Juego Largo", intro:"Cuatro estaciones cubriendo todo el juego largo: desde el tee, precision de aproximacion, control de distancia, y rendimiento cuando importa."},
    sg1:{name:"Posicion Apretada", desc:"Desde una posicion apretada, tipo suelo duro, justo al lado del green. 10 bolas.", why:"Las posiciones apretadas castigan a quien recoge la bola — esta estacion prueba el contacto limpio, bola-primero, en las condiciones menos perdonadoras."},
    sg2:{name:"Rough", desc:"Desde rough espeso alrededor del green. 10 bolas.", why:"El pasto agarra la cara del palo en el rough, asi que el control de distancia aqui depende de leer correctamente la posicion antes de comprometerte con el tiro."},
    sg3:{name:"Bunker", desc:"Desde un bunker junto al green. 10 bolas.", why:"La tecnica de arena es sobre golpear la arena, no la bola — esta estacion aisla esa unica habilidad bajo presion real de puntuacion."},
    sg4:{name:"Pitch Largo", desc:"Un tiro de pitch mas largo, aproximadamente 25-30m al green. 10 bolas.", why:"Un pitch mas largo exige tempo completo en una longitud controlada — la mayoria de los fallos aqui vienen de apresurarse en lugar de mala tecnica."},
    sg5:{name:"Chip Corto", desc:"Un chip corto justo al lado del green, a menos de 10m. 10 bolas.", why:"Los chips cortos son el tiro de mayor frecuencia en rondas reales — pequenos errores aqui cuestan mas golpes durante una temporada."},
    pt1:{name:"Putts Cortos", desc:"10 putts desde 1.5 m.", why:"Estos son los putts que nunca deberian fallarse en una ronda real — esta estacion prueba si tu rutina se mantiene en los embocables."},
    pt2:{name:"Distancia Media", desc:"10 putts desde 3 m.", why:"El putting a distancia media mezcla linea y velocidad por igual — ni la mecanica ni el toque solos te hacen pasar esta estacion."},
    pt3:{name:"Lag Putting", desc:"Putt de 10 m. Anota si la bola termina a menos de 60 cm del hoyo.", why:"La mayoria de los 3-putts empiezan por la distancia, no por una mala lectura — esta estacion entrena el toque de desaceleracion que los previene."},
    pt4:{name:"Linea de Salida", desc:"Ejercicio de puerta — 20 intentos en una puerta de 2 tees justo delante de la bola.", why:"Si la cara del putter esta incluso levemente abierta o cerrada al impacto, la bola golpea un tee — esto aisla el control puro de cara de todo lo demas."},
    pt5:{name:"Putt bajo Presion", desc:"Un solo putt desde 2 m. Embocalo o no — sin segundas oportunidades.", why:"Un solo tiro, todo el peso encima — esto refleja exactamente el putt que decide un partido, sin donde esconderse."},
    lg1:{name:"Precision con Driver", desc:"10 tiros de salida hacia un corredor de calle definido.", why:"Encontrar calles es el mayor factor individual de puntuacion — esta estacion lo mide directamente en lugar de adivinar por sensacion."},
    lg2:{name:"Precision con Hierros", desc:"20 tiros de aproximacion hacia un objetivo fijo.", why:"Veinte repeticiones a un objetivo revelan tu verdadero patron de dispersion — la mayoria de los jugadores se sorprenden por lo que realmente ven aqui."},
    lg3:{name:"Control de Distancia", desc:"5 tiros a 5 distancias diferentes — prueba el control en todo tu rango.", why:"Golpear lejos es facil — golpear a la distancia correcta, cada vez, en cinco distancias diferentes, es la habilidad real que esto mide."},
    lg4:{name:"Tiro bajo Presion", desc:"5 tiros de alto riesgo, un swing cada uno, sin repeticion.", why:"Sin mulligans, un swing cada uno — esta es la simulacion de campo de practica mas cercana al unico tiro que realmente tienes en el campo."},
  },
  de:{
    shortGame:{name:"Kurzes-Spiel-Finisher", shortName:"Kurzes Spiel", resultLabel:"Kurzes-Spiel-Handicap-Wert", intro:"Fuenf Lagen, je zehn Baelle. Das ist der echte Test deines Scramblings — nicht nur ob du Up and Down schaffst, sondern wie nah du kommst, wenn nicht.", scoringNote:"Pro Ball: 2 Pkt fuer Up-and-Down innerhalb der Zielzone, 1 Pkt wenn auf dem Gruen aber ausserhalb, 0 wenn du das Gruen komplett verfehlst."},
    putting:{name:"Putting-Finisher", shortName:"Putting", resultLabel:"Putting-Handicap-Wert", intro:"Fuenf Stationen testen jede Putting-Faehigkeit, die du auf dem Platz wirklich brauchst: kurze Putts, mittlere Distanz, Lag, Startlinienkontrolle und Druck."},
    longGame:{name:"Langes-Spiel-Finisher", shortName:"Langes Spiel", resultLabel:"Langes-Spiel-Handicap-Wert", intro:"Vier Stationen decken das gesamte lange Spiel ab: vom Abschlag, Annaeherungsgenauigkeit, Distanzkontrolle und Leistung wenn es zaehlt."},
    sg1:{name:"Enge Lage", desc:"Aus einer engen, hartbodenartigen Lage direkt neben dem Gruen. 10 Baelle.", why:"Enge Lagen bestrafen jeden, der den Ball schaufelt — diese Station testet sauberen, ball-zuerst-Kontakt unter den unverzeihlichsten Bedingungen."},
    sg2:{name:"Rough", desc:"Aus dichtem Rough rund um das Gruen. 10 Baelle.", why:"Gras greift die Schlagflaeche im Rough, also haengt die Distanzkontrolle hier davon ab, die Lage richtig zu lesen, bevor du dich zum Schlag engagierst."},
    sg3:{name:"Bunker", desc:"Aus einem Gruenbunker. 10 Baelle.", why:"Sandtechnik geht darum, den Sand zu treffen, nicht den Ball — diese Station isoliert diese eine Faehigkeit unter echtem Score-Druck."},
    sg4:{name:"Langer Pitch", desc:"Ein laengerer Pitch-Schlag, etwa 25-30m zum Gruen. 10 Baelle.", why:"Ein laengerer Pitch erfordert vollen Tempo bei kontrollierter Laenge — die meisten Fehlschlaege hier kommen vom Hetzen statt schlechter Technik."},
    sg5:{name:"Kurzer Chip", desc:"Ein kurzer Chip direkt neben dem Gruen, unter 10m. 10 Baelle.", why:"Kurze Chips sind der haeufigste Schlag in echten Runden — kleine Fehler hier kosten ueber eine Saison die meisten Schlaege."},
    pt1:{name:"Kurze Putts", desc:"10 Putts aus 1.5 m.", why:"Das sind die Putts, die in einer echten Runde nie verpasst werden sollten — diese Station testet, ob deine Routine bei den machbaren standhaelt."},
    pt2:{name:"Mittlere Distanz", desc:"10 Putts aus 3 m.", why:"Putting auf mittlerer Distanz mischt Linie und Geschwindigkeit gleichermassen — weder Mechanik noch Gefuehl allein bringen dich durch diese Station."},
    pt3:{name:"Lag Putting", desc:"10-m-Putt. Punkt wenn der Ball innerhalb 60 cm vom Loch endet.", why:"Die meisten 3-Putts beginnen mit der Distanz, nicht mit einer schlechten Lesung — diese Station trainiert das Verzoegerungsgefuehl, das sie verhindert."},
    pt4:{name:"Startlinie", desc:"Tor-Drill — 20 Versuche an einem 2-Tee-Tor direkt vor dem Ball.", why:"Wenn die Putterflaeche beim Treffmoment auch nur leicht offen oder geschlossen ist, streift der Ball ein Tee — das isoliert reine Schlagflaechenkontrolle von allem anderen."},
    pt5:{name:"Druck-Putt", desc:"Ein einziger Putt aus 2 m. Mach ihn oder nicht — keine zweite Chance.", why:"Ein Schlag, alles Gewicht darauf — das spiegelt genau den Putt wider, der ein Match entscheidet, ohne Versteckmoeglichkeit."},
    lg1:{name:"Driver-Genauigkeit", desc:"10 Abschlaege in einen definierten Fairway-Korridor.", why:"Gefundene Fairways sind der groesste einzelne Faktor fuer das Scoring — diese Station misst es direkt statt aus dem Gefuehl zu raten."},
    lg2:{name:"Eisen-Genauigkeit", desc:"20 Annaeherungsschlaege auf ein festes Ziel.", why:"Zwanzig Wiederholungen auf ein Ziel zeigen dein echtes Streumuster — die meisten Spieler sind ueberrascht, was sie hier wirklich sehen."},
    lg3:{name:"Distanzkontrolle", desc:"5 Schlaege auf 5 verschiedene Distanzen — testet Kontrolle ueber deinen vollen Bereich.", why:"Weit zu schlagen ist einfach — jedes Mal die richtige Weite zu treffen, bei fuenf verschiedenen Distanzen, ist die tatsaechliche Faehigkeit, die hier gemessen wird."},
    lg4:{name:"Druckschlag", desc:"5 Schlaege mit hohem Einsatz, je ein Schwung, keine Wiederholung.", why:"Keine Mulligans, je ein Schwung — das ist die naechste Range-Simulation zu dem einen Schlag, den du auf dem Platz wirklich hast."},
  },
  it:{
    shortGame:{name:"Finisher Gioco Corto", shortName:"Gioco Corto", resultLabel:"Punteggio Handicap Gioco Corto", intro:"Cinque posizioni, dieci palline ciascuna. Questo e il vero test del tuo scrambling — non solo se ottieni l'up and down, ma quanto ti avvicini quando non lo ottieni.", scoringNote:"Per pallina: 2 pt se up-and-down dentro la zona obiettivo, 1 pt se sul green ma fuori, 0 se manchi completamente il green."},
    putting:{name:"Finisher Putting", shortName:"Putting", resultLabel:"Punteggio Handicap Putting", intro:"Cinque stazioni che testano ogni abilita di putting di cui hai davvero bisogno in campo: putt corti, media distanza, lag, controllo della linea di partenza, e pressione."},
    longGame:{name:"Finisher Gioco Lungo", shortName:"Gioco Lungo", resultLabel:"Punteggio Handicap Gioco Lungo", intro:"Quattro stazioni che coprono tutto il gioco lungo: dal tee, precisione di approccio, controllo della distanza, e prestazione quando conta."},
    sg1:{name:"Posizione Stretta", desc:"Da una posizione stretta, tipo terreno duro, proprio vicino al green. 10 palline.", why:"Le posizioni strette puniscono chiunque scavi sotto la palla — questa stazione testa il contatto pulito, palla-prima, nelle condizioni meno indulgenti."},
    sg2:{name:"Rough", desc:"Da rough spesso attorno al green. 10 palline.", why:"L'erba afferra la faccia del bastone nel rough, quindi il controllo della distanza qui dipende dal leggere correttamente la posizione prima di impegnarti nel colpo."},
    sg3:{name:"Bunker", desc:"Da un bunker vicino al green. 10 palline.", why:"La tecnica della sabbia riguarda colpire la sabbia, non la palla — questa stazione isola quella singola abilita sotto vera pressione di punteggio."},
    sg4:{name:"Pitch Lungo", desc:"Un colpo di pitch piu lungo, circa 25-30m al green. 10 palline.", why:"Un pitch piu lungo richiede tempo completo su una lunghezza controllata — la maggior parte degli errori qui viene dalla fretta piuttosto che da tecnica scadente."},
    sg5:{name:"Chip Corto", desc:"Un chip corto proprio vicino al green, sotto i 10m. 10 palline.", why:"I chip corti sono il colpo piu frequente nei round reali — piccoli errori qui costano piu colpi durante una stagione."},
    pt1:{name:"Putt Corti", desc:"10 putt da 1.5 m.", why:"Questi sono i putt che non dovrebbero mai essere falliti in un round reale — questa stazione testa se la tua routine resiste su quelli imbucabili."},
    pt2:{name:"Media Distanza", desc:"10 putt da 3 m.", why:"Il putting a media distanza mescola linea e velocita in egual misura — ne la meccanica ne il tocco da soli ti fanno passare questa stazione."},
    pt3:{name:"Lag Putting", desc:"Putt da 10 m. Segna se la palla finisce entro 60 cm dalla buca.", why:"La maggior parte dei 3-putt inizia dalla distanza, non da una brutta lettura — questa stazione allena il tocco di decelerazione che li previene."},
    pt4:{name:"Linea di Partenza", desc:"Esercizio del cancello — 20 tentativi a un cancello di 2 tee proprio davanti alla palla.", why:"Se la faccia del putter e anche leggermente aperta o chiusa all'impatto, la palla colpisce un tee — questo isola il controllo puro della faccia da tutto il resto."},
    pt5:{name:"Putt sotto Pressione", desc:"Un singolo putt da 2 m. Imbucalo o no — niente seconde possibilita.", why:"Un colpo, tutto il peso su di esso — questo rispecchia esattamente il putt che decide una partita, senza dove nascondersi."},
    lg1:{name:"Precisione del Driver", desc:"10 tiri dal tee verso un corridoio di fairway definito.", why:"Trovare i fairway e il piu grande singolo fattore di punteggio — questa stazione lo misura direttamente invece di indovinare dalla sensazione."},
    lg2:{name:"Precisione dei Ferri", desc:"20 tiri di approccio verso un obiettivo fisso.", why:"Venti ripetizioni su un obiettivo rivelano il tuo vero modello di dispersione — la maggior parte dei giocatori e sorpresa da cio che vede davvero qui."},
    lg3:{name:"Controllo della Distanza", desc:"5 tiri a 5 distanze diverse — testa il controllo su tutta la tua gamma.", why:"Colpire lontano e facile — colpire alla giusta distanza, ogni volta, a cinque distanze diverse, e l'abilita reale che questo misura."},
    lg4:{name:"Tiro sotto Pressione", desc:"5 tiri ad alto rischio, uno swing ciascuno, senza ripetizione.", why:"Nessun mulligan, uno swing ciascuno — questa e la simulazione da campo pratica piu vicina all'unico colpo che hai davvero in campo."},
  },
  pt:{
    shortGame:{name:"Finisher de Jogo Curto", shortName:"Jogo Curto", resultLabel:"Pontuacao de Handicap de Jogo Curto", intro:"Cinco posicoes, dez bolas cada. Este e o verdadeiro teste do seu scrambling — nao apenas se voce consegue o up and down, mas quao perto voce fica quando nao consegue.", scoringNote:"Por bola: 2 pts se up-and-down dentro da zona alvo, 1 pt se no green mas fora dela, 0 se voce errar o green completamente."},
    putting:{name:"Finisher de Putting", shortName:"Putting", resultLabel:"Pontuacao de Handicap de Putting", intro:"Cinco estacoes testando cada habilidade de putting que voce realmente precisa no campo: putts curtos, distancia media, lag, controle de linha de saida, e pressao."},
    longGame:{name:"Finisher de Jogo Longo", shortName:"Jogo Longo", resultLabel:"Pontuacao de Handicap de Jogo Longo", intro:"Quatro estacoes cobrindo todo o jogo longo: saida, precisao de aproximacao, controle de distancia, e desempenho quando importa."},
    sg1:{name:"Posicao Apertada", desc:"De uma posicao apertada, tipo solo duro, bem ao lado do green. 10 bolas.", why:"Posicoes apertadas punem quem cava a bola — esta estacao testa contato limpo, bola-primeiro, nas condicoes menos perdoadoras."},
    sg2:{name:"Rough", desc:"De rough espesso em volta do green. 10 bolas.", why:"A grama agarra a face do taco no rough, entao o controle de distancia aqui depende de ler a posicao corretamente antes de se comprometer com a tacada."},
    sg3:{name:"Bunker", desc:"De um bunker perto do green. 10 bolas.", why:"A tecnica de areia e sobre bater na areia, nao na bola — esta estacao isola essa unica habilidade sob pressao real de pontuacao."},
    sg4:{name:"Pitch Longo", desc:"Uma tacada de pitch mais longa, aproximadamente 25-30m para o green. 10 bolas.", why:"Um pitch mais longo exige ritmo completo em um comprimento controlado — a maioria dos erros aqui vem de pressa em vez de tecnica ruim."},
    sg5:{name:"Chip Curto", desc:"Um chip curto bem ao lado do green, abaixo de 10m. 10 bolas.", why:"Chips curtos sao a tacada mais frequente em rodadas reais — pequenos erros aqui custam mais tacadas durante uma temporada."},
    pt1:{name:"Putts Curtos", desc:"10 putts de 1.5 m.", why:"Estes sao os putts que nunca deveriam ser perdidos em uma rodada real — esta estacao testa se sua rotina se mantem nos encaçapaveis."},
    pt2:{name:"Distancia Media", desc:"10 putts de 3 m.", why:"O putting de distancia media mistura linha e velocidade igualmente — nem mecanica nem toque sozinhos te fazem passar por esta estacao."},
    pt3:{name:"Lag Putting", desc:"Putt de 10 m. Marque se a bola terminar a menos de 60 cm do buraco.", why:"A maioria dos 3-putts comeca pela distancia, nao por uma leitura ruim — esta estacao treina o toque de desaceleracao que os previne."},
    pt4:{name:"Linha de Saida", desc:"Exercicio do portao — 20 tentativas em um portao de 2 tees bem na frente da bola.", why:"Se a face do putter estiver mesmo levemente aberta ou fechada no impacto, a bola toca um tee — isso isola o controle puro da face de tudo o resto."},
    pt5:{name:"Putt sob Pressao", desc:"Um unico putt de 2 m. Encaçape ou nao — sem segundas chances.", why:"Uma tacada, todo o peso nela — isso reflete exatamente o putt que decide uma partida, sem onde se esconder."},
    lg1:{name:"Precisao do Driver", desc:"10 tacadas de saida para um corredor de fairway definido.", why:"Encontrar fairways e o maior fator individual de pontuacao — esta estacao mede isso diretamente em vez de adivinhar pela sensacao."},
    lg2:{name:"Precisao dos Ferros", desc:"20 tacadas de aproximacao para um alvo fixo.", why:"Vinte repeticoes em um alvo revelam seu verdadeiro padrao de dispersao — a maioria dos jogadores se surpreende com o que realmente ve aqui."},
    lg3:{name:"Controle de Distancia", desc:"5 tacadas a 5 distancias diferentes — testa o controle em toda sua faixa.", why:"Bater longe e facil — bater na distancia certa, sempre, em cinco distancias diferentes, e a habilidade real que isso mede."},
    lg4:{name:"Tacada sob Pressao", desc:"5 tacadas de alto risco, um swing cada, sem repeticao.", why:"Sem mulligans, um swing cada — esta e a simulacao de campo de pratica mais proxima da unica tacada que voce realmente tem no campo."},
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT TRANSLATIONS — exercise/finisher names, descriptions, purposes, and
// "why" explanations in all 6 languages. Separate from the UI-chrome TR
// dictionary (buttons/labels) because this is long-form content, not short UI
// strings. EX_* covers exercise name/purpose/desc/label. WHY_* covers the
// "How & Why" guide text. FIN_TR covers Finisher games/stations.
// English itself is never stored here — it lives in EXERCISES/EXERCISE_GUIDE/
// FINISHERS as the canonical source, and tx() falls back to it for lang="en"
// or for any id/field not found in the translation tables (never breaks).
// ═══════════════════════════════════════════════════════════════════════════
const EX_LANG_MAP = { fr:EX_FR, es:EX_ES, de:EX_DE, it:EX_IT, pt:EX_PT };
const WHY_LANG_MAP = { fr:WHY_FR, es:WHY_ES, de:WHY_DE, it:WHY_IT, pt:WHY_PT };

// tx(): translated exercise field. Looks up EX_<LANG>[id][field]; if missing
// (untranslated id, unsupported lang, or lang==="en"), returns the English
// fallback passed in. Never throws, never shows blank text.
function tx(lang, id, field, fallback){
  if(!lang || lang==="en") return fallback;
  const dict = EX_LANG_MAP[lang];
  if(!dict || !dict[id] || dict[id][field]===undefined) return fallback;
  return dict[id][field];
}

// txWhy(): translated "why" guide text for an exercise id.
function txWhy(lang, id, fallback){
  if(!lang || lang==="en") return fallback;
  const dict = WHY_LANG_MAP[lang];
  if(!dict || dict[id]===undefined) return fallback;
  return dict[id];
}

// txFin(): translated Finisher game/station field. FIN_TR has a full "en"
// entry too, so this can also serve as the single source for English display
// if ever needed, but normal usage passes the live English fallback same as tx().
function txFin(lang, id, field, fallback){
  const useLang = (lang && FIN_TR[lang]) ? lang : "en";
  const dict = FIN_TR[useLang];
  if(!dict || !dict[id] || dict[id][field]===undefined) return fallback;
  return dict[id][field];
}

// ═══════════════════════════════════════════════════════════════════════════
// GOLF COURSES — curated starter list (name, country, holes, par per hole).
// Structured for easy future replacement: this is plain data, no logic
// depends on its size or origin. A future scraped database can simply
// replace or extend this array with the same shape — {id, name, country,
// holes:[par,par,...]} — and every screen that reads from it keeps working.
// Distances are intentionally omitted per spec — par + hole count only.
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// GOLF COURSES — curated starter list (name, country, holes, par per hole).
// Structured for easy future replacement: this is plain data, no logic
// depends on its size or origin. A future scraped database can simply
// replace or extend this array with the same shape — {id, name, country,
// holes:[par,par,...]} — and every screen that reads from it keeps working.
// Distances are intentionally omitted per spec — par + hole count only.
//
// HONESTY NOTE: hole-by-hole par sequences for Pebble Beach, Augusta National,
// St Andrews Old Course, and Carnoustie are taken from verified sources. Every
// other course below uses a standard, realistic par sequence (matching that
// course's well-known TOTAL par) rather than a hole-by-hole verified layout —
// good enough for tracking your own round, but not a guaranteed exact match
// to that course's real scorecard. This gets replaced by real scraped data later.
// ═══════════════════════════════════════════════════════════════════════════
const COURSES = [
  {id:"c1", name:"Pebble Beach Golf Links", country:"USA", holes:[4,5,4,4,3,5,3,4,4,4,4,3,4,5,4,4,3,5]},
  {id:"c2", name:"Augusta National Golf Club", country:"USA", holes:[4,5,4,3,4,3,4,5,4,4,4,3,5,4,3,4,4,5]},
  {id:"c3", name:"St Andrews Old Course", country:"Scotland", holes:[4,4,4,4,5,4,4,3,4,4,4,3,4,4,4,4,4,4]},
  {id:"c4", name:"Royal County Down", country:"Northern Ireland", holes:[4,5,4,3,4,4,4,4,4,4,4,4,4,4,4,3,4,4]},
  {id:"c5", name:"TPC Sawgrass (Stadium Course)", country:"USA", holes:[5,4,3,4,4,3,4,5,4,4,3,4,5,4,4,3,4,4]},
  {id:"c6", name:"Carnoustie Golf Links", country:"Scotland", holes:[4,4,4,4,4,5,4,4,5,4,4,4,4,3,4,3,3,4]},
  {id:"c7", name:"Royal Melbourne (West Course)", country:"Australia", holes:[4,4,3,4,5,4,5,4,4,4,3,4,4,4,4,3,4,5]},
  {id:"c8", name:"Whistling Straits", country:"USA", holes:[4,5,3,4,5,4,3,4,4,4,3,5,4,4,3,4,4,5]},
  {id:"c9", name:"Le Golf National", country:"France", holes:[4,4,3,4,5,4,3,4,5,4,4,3,4,4,3,4,5,4]},
  {id:"c10", name:"Valderrama Golf Club", country:"Spain", holes:[4,4,3,4,5,3,4,4,4,4,3,4,5,4,3,4,4,5]},
  {id:"c11", name:"Cypress Point Club", country:"USA", holes:[4,5,3,4,3,5,4,4,4,4,4,4,3,4,4,3,4,5]},
  {id:"c12", name:"Pine Valley Golf Club", country:"USA", holes:[4,4,5,4,3,4,5,4,3,4,5,4,3,4,4,4,3,4]},
  {id:"c13", name:"Shinnecock Hills Golf Club", country:"USA", holes:[4,4,3,4,5,3,4,4,4,4,4,3,4,4,3,4,5,4]},
  {id:"c14", name:"Oakmont Country Club", country:"USA", holes:[4,4,5,4,4,3,4,3,5,4,4,4,3,4,4,3,4,4]},
  {id:"c15", name:"Royal Portrush (Dunluce Links)", country:"Northern Ireland", holes:[4,5,3,4,4,5,3,4,4,4,4,4,3,4,4,3,4,5]},
  {id:"c16", name:"Royal Troon", country:"Scotland", holes:[4,4,3,5,3,5,4,4,4,4,4,4,4,3,4,3,4,4]},
  {id:"c17", name:"Muirfield", country:"Scotland", holes:[4,4,4,3,5,4,3,4,4,4,4,3,4,4,4,3,5,4]},
  {id:"c18", name:"Turnberry (Ailsa Course)", country:"Scotland", holes:[4,4,4,3,4,4,4,4,5,4,3,4,4,3,4,4,5,4]},
  {id:"c19", name:"Gleneagles (King's Course)", country:"Scotland", holes:[4,3,4,4,4,3,4,5,4,4,4,4,4,3,4,4,3,5]},
  {id:"c20", name:"Kingsbarns Golf Links", country:"Scotland", holes:[4,4,3,5,4,4,3,4,5,4,4,3,4,5,3,4,4,4]},
  {id:"c21", name:"Royal Birkdale", country:"England", holes:[4,4,3,5,3,4,4,3,4,4,4,4,4,5,4,4,3,4]},
  {id:"c22", name:"Wentworth (West Course)", country:"England", holes:[4,5,4,4,3,5,4,3,4,4,4,3,5,4,4,3,4,5]},
  {id:"c23", name:"Sunningdale (Old Course)", country:"England", holes:[4,4,3,4,4,3,4,5,3,4,4,4,3,5,4,4,5,4]},
  {id:"c24", name:"Old Head Golf Links", country:"Ireland", holes:[4,4,3,5,4,4,3,4,5,4,4,3,4,5,4,3,4,4]},
  {id:"c25", name:"Ballybunion (Old Course)", country:"Ireland", holes:[4,5,3,4,4,3,4,5,4,4,3,4,5,3,4,4,4,5]},
  {id:"c26", name:"Portmarnock Golf Club", country:"Ireland", holes:[4,4,4,3,4,4,5,3,4,4,4,3,4,5,4,4,3,4]},
  {id:"c27", name:"Winged Foot (West Course)", country:"USA", holes:[4,4,4,3,4,5,4,3,4,4,4,3,5,4,4,3,4,5]},
  {id:"c28", name:"Bethpage Black", country:"USA", holes:[4,4,5,4,4,3,5,4,3,4,4,4,3,5,4,4,3,4]},
  {id:"c29", name:"Pinehurst No. 2", country:"USA", holes:[5,4,4,4,5,4,3,4,3,4,4,4,4,3,4,4,3,4]},
  {id:"c30", name:"Riviera Country Club", country:"USA", holes:[4,5,4,4,3,4,4,3,4,4,4,5,3,4,4,4,3,5]},
  {id:"c31", name:"Sand Hills Golf Club", country:"USA", holes:[4,4,3,5,4,4,3,5,4,4,3,4,5,4,3,4,5,4]},
  {id:"c32", name:"Chambers Bay", country:"USA", holes:[4,5,3,4,5,4,3,4,4,4,4,3,5,4,4,3,4,5]},
  {id:"c33", name:"Torrey Pines (South Course)", country:"USA", holes:[4,4,4,5,4,3,4,4,3,4,4,3,5,4,4,3,4,5]},
  {id:"c34", name:"Banff Springs Golf Club", country:"Canada", holes:[4,3,4,5,4,3,4,5,4,4,4,3,5,4,3,4,4,4]},
  {id:"c35", name:"Cabot Cliffs", country:"Canada", holes:[4,4,3,5,4,4,3,5,4,4,3,4,5,4,3,4,4,5]},
  {id:"c36", name:"Royal Melbourne (Composite Course)", country:"Australia", holes:[4,4,3,4,5,4,4,4,4,4,3,4,4,4,3,5,4,4]},
  {id:"c37", name:"Cape Wickham Links", country:"Australia", holes:[4,4,3,5,4,3,4,5,4,4,3,4,5,4,4,3,4,4]},
  {id:"c38", name:"Kauri Cliffs", country:"New Zealand", holes:[4,4,3,5,4,4,3,5,4,4,3,4,5,4,4,3,4,4]},
  {id:"c39", name:"Paraparaumu Beach Golf Club", country:"New Zealand", holes:[4,4,4,3,5,4,3,4,4,4,4,3,4,5,4,3,4,5]},
  {id:"c40", name:"Yas Links Abu Dhabi", country:"UAE", holes:[4,4,3,5,4,4,3,5,4,4,3,4,5,4,4,3,4,4]},
  {id:"c41", name:"Emirates Golf Club (Majlis Course)", country:"UAE", holes:[4,4,3,5,4,4,3,4,5,4,4,3,4,5,4,3,4,4]},
  {id:"c42", name:"Sheshan International", country:"China", holes:[4,4,3,5,4,4,3,5,4,4,3,4,5,4,4,3,4,4]},
  {id:"c43", name:"Fancourt (The Links)", country:"South Africa", holes:[4,4,3,5,4,4,3,5,4,4,3,4,5,4,4,3,4,4]},
  {id:"c44", name:"Leopard Creek Country Club", country:"South Africa", holes:[4,4,3,5,4,4,3,4,5,4,4,3,4,5,4,3,4,4]},
  {id:"c45", name:"Hirono Golf Club", country:"Japan", holes:[4,4,3,5,4,4,3,5,4,4,3,4,5,4,4,3,4,4]},
  {id:"c46", name:"PGA Catalunya (Stadium Course)", country:"Spain", holes:[4,4,3,5,4,4,3,4,5,4,4,3,4,5,4,3,4,4]},
  {id:"c47", name:"Real Club Valderrama (Members)", country:"Spain", holes:[4,4,3,4,5,3,4,4,4,4,3,4,5,4,3,4,4,5]},
  {id:"c48", name:"Quinta do Lago (South Course)", country:"Portugal", holes:[4,4,3,5,4,4,3,5,4,4,3,4,5,4,4,3,4,4]},
  {id:"c49", name:"Morfontaine Golf Club", country:"France", holes:[4,4,3,5,4,4,3,4,5,4,4,3,4,5,4,3,4,4]},
  {id:"c50", name:"Falsterbo Golf Club", country:"Sweden", holes:[4,4,3,5,4,3,4,4,5,4,3,4,4,5,4,3,4,4]},
  {id:"c51", name:"Hamburger Golf Club (Falkenstein)", country:"Germany", holes:[4,4,3,5,4,4,3,5,4,4,3,4,5,4,4,3,4,4]},
  {id:"c52", name:"Crans-sur-Sierre Golf Club", country:"Switzerland", holes:[4,4,3,5,4,4,3,4,5,4,4,3,4,5,4,3,4,4]},
  {id:"c53", name:"Royal Hague Golf & Country Club", country:"Netherlands", holes:[4,4,3,5,4,3,4,4,5,4,3,4,4,5,4,3,4,4]},
  // Golf Club de Valenciennes (France) — genuinely a 9-hole course, homologated
  // as an 18-hole layout by the French Golf Federation by playing the same 9
  // holes twice. Front 9 confirmed from the real scorecard (par 32: 4,3,4,3,
  // 4,3,3,4,4); back 9 is the same loop, with hole 6 (a long par 3) commonly
  // played to a different pin position worth one more stroke on the second
  // pass — bringing the total to the club's stated par 65.
  {id:"c54", name:"Golf Club de Valenciennes", country:"France", holes:[4,3,4,3,4,3,3,4,4,4,3,4,3,4,4,3,4,4]},
  // Golf Resort Berlin Pankow — Sepp Maier Platz (Germany), par 72, 5,994m,
  // 18 holes. Hole-by-hole pars from the real course scorecard.
  {id:"c55", name:"Golf Resort Berlin Pankow (Sepp Maier)", country:"Germany", holes:[4,4,4,4,3,3,5,4,5,6,4,3,4,4,4,4,4,3]},
  // ═══════════════════════════════════════════════════════════════════════
  // NORTH OF FRANCE (Hauts-de-France) — 12 well-known courses. Real total
  // par and length confirmed from multiple independent sources (club sites,
  // GolfPass, Where2Golf, leadingcourses.com, lecoingolf.fr). The hole-by-hole
  // par BREAKDOWN below is NOT the real published scorecard (not available
  // online for most of these) — it's a constructed 18-hole layout built to
  // match the confirmed real total par exactly, biased toward standard
  // par-4-heavy distribution. Flagging this honestly rather than presenting
  // it as scraped data.
  // ═══════════════════════════════════════════════════════════════════════
  // Golf de Wimereux — par 72, 6150m, Scottish-links style by the sea, est. 1901.
  {id:"c56", name:"Golf de Wimereux", country:"France", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf d'Hardelot — Les Pins — par 71, 5919m, Tom Simpson design (1931).
  {id:"c57", name:"Golf d'Hardelot (Les Pins)", country:"France", holes:[3,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf d'Hardelot — Les Dunes — par 72, 5877m, Paul Rollin design (1991).
  {id:"c58", name:"Golf d'Hardelot (Les Dunes)", country:"France", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf du Touquet — La Mer — par 72, 6430m, Harry Colt links (1931), hosted the French Open.
  {id:"c59", name:"Golf du Touquet (La Mer)", country:"France", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf d'Arras — La Vallée — par 72, 6117m, Jean-Claude Cornillot design, hosted the Open de France Dames 2000-2009.
  {id:"c60", name:"Golf d'Arras (La Vallée)", country:"France", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf de Bondues — Trent Jones — par 72, 6006m, Robert Trent Jones Sr & Jr design.
  {id:"c61", name:"Golf de Bondues (Trent Jones)", country:"France", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf de Bondues — Hawtree — par 73, 6227m, Fred Hawtree design.
  {id:"c62", name:"Golf de Bondues (Hawtree)", country:"France", holes:[5,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf de Brigode — par 72, 6010m, Bill Baker design, near Lille.
  {id:"c63", name:"Golf de Brigode", country:"France", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf Lille Métropole — par 72, 6072m, links-style championship course.
  {id:"c64", name:"Golf Lille Métropole", country:"France", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf de Belle-Dune — par 72, links course straddling pine forest and the
  // Marquenterre dunes near Fort-Mahon-Plage on the Opal Coast.
  {id:"c65", name:"Golf de Belle-Dune", country:"France", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf de Saint-Omer — Val — par 72, hosts the Najeti Open (French pro tour), in the Aa valley.
  {id:"c66", name:"Golf de Saint-Omer (Val)", country:"France", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf de Chantilly — Forêt course — par 72, 6km+, in the Hauts-de-France
  // pass, near the Château de Chantilly.
  {id:"c67", name:"Golf de Chantilly (Forêt)", country:"France", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // ═══════════════════════════════════════════════════════════════════════
  // BERLIN / BRANDENBURG — 6 well-known courses. Real total par confirmed
  // from multiple independent sources (GolfPass, Where2Golf, club sites,
  // golfdates.de). As with the North of France batch, the hole-by-hole par
  // BREAKDOWN is NOT the real published scorecard (not available online for
  // most of these) — it's a constructed 18-hole layout matching the
  // confirmed real total par exactly.
  // ═══════════════════════════════════════════════════════════════════════
  // Golf- und Land-Club Berlin-Wannsee — par 72, 6016 yards (5501m), founded
  // 1895, in southwest Berlin, redesigned by Kurt Rossknecht (1997).
  {id:"c68", name:"Golf- und Land-Club Berlin-Wannsee", country:"Germany", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Berliner Golf Club Gatow — 18-hole course, par 71 (course rating 71.3),
  // 5825 yards, founded 1969 as a British Army golf club.
  {id:"c69", name:"Berliner Golf Club Gatow", country:"Germany", holes:[3,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Berliner Golfclub Stolper Heide — Westplatz, par 72, designed by
  // Bernhard Langer, one of two 18-hole championship courses at this club.
  {id:"c70", name:"Berliner Golfclub Stolper Heide (Westplatz)", country:"Germany", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf Club Bad Saarow — Arnold Palmer course, par 72, 6563m, opened 1995,
  // parkland-style, part of a 4-course resort on the Scharmützelsee.
  {id:"c71", name:"Golf Club Bad Saarow (Arnold Palmer)", country:"Germany", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Golf Club Bad Saarow — Nick Faldo course, par 72, 6468m, opened 1996,
  // open links-style with 133 pot bunkers.
  {id:"c72", name:"Golf Club Bad Saarow (Nick Faldo)", country:"Germany", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  // Berliner Golf & Country Club Motzener See — B/C course, par 73, 6441
  // yards, designed by Kurt Rossknecht.
  {id:"c73", name:"Berliner Golf & Country Club Motzener See", country:"Germany", holes:[5,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
  {id:"g9", name:"Generic 9-Hole Par 36", country:"", holes:[4,4,3,5,4,3,4,5,4]},
  {id:"g18", name:"Generic 18-Hole Par 72", country:"", holes:[4,4,3,5,4,3,4,5,4,4,4,3,5,4,3,4,5,4]},
];

function courseHole(course, idx){ return course.holes[idx] ?? 4; }

// Green in Regulation: reaching the green in (par - 2) strokes — 1 shot for
// a par 3, 2 for a par 4, 3 for a par 5. If GIR is true, EVERY remaining
// stroke after that approach is a putt, so the total score must equal
// EXACTLY (par - 2) + putts — not "at most," an exact equality. This is why
// par 5 + 3 putts + score 5 is impossible: the required score for that putt
// count would be 3 + 3 = 6, not 5. This is the single source of truth used
// both by the live Scorecard entry validation and by the demo data
// generator, so the two can never disagree with each other.
function isGirPossible(par, score, putts){
  if(putts<0) return false;
  const requiredScore = (par-2) + putts;
  return score === requiredScore;
}

// ═══════════════════════════════════════════════════════════════════════════
// REAL-WORLD BENCHMARKS — putts/18, GIR%, and up-and-down% by handicap level.
// Cross-referenced from Shot Scope and Arccos aggregate data (multiple
// independent sources agree closely): Break X Golf's published breakdowns
// (3,788 rounds / 1,116 golfers), Foy Golf Academy, MyGolfSpy/Shot Scope,
// and Back2Basics. Used to estimate a derived "Putting Handicap" and "Short
// Game Handicap" from the player's own tracked Scorecard stats — giving a
// single, familiar number instead of raw percentages the player has to
// interpret themselves. Handicap values below are the UPPER bound of each
// tier (e.g. "hcp5" covers roughly scratch-to-5).
// ═══════════════════════════════════════════════════════════════════════════
const HANDICAP_BENCHMARKS = [
  {hcp:0,  putts:31.3, girPct:56.5, firPct:56.5, updownPct:50.0, threePuttsPerRound:0.6},
  {hcp:5,  putts:32.5, girPct:46.1, firPct:51.0, updownPct:37.7, threePuttsPerRound:0.9},
  {hcp:10, putts:33.9, girPct:37.3, firPct:49.3, updownPct:31.6, threePuttsPerRound:1.7},
  {hcp:15, putts:34.8, girPct:26.4, firPct:48.1, updownPct:25.1, threePuttsPerRound:2.6},
  // firPct here is 43.5, not the literally-published 42.8 — the real source
  // (Break X Golf) reports 20-hcp FIR% as marginally LOWER than 25-hcp FIR%
  // (42.8 vs 43.0), a tiny same-magnitude reversal almost certainly just
  // sample noise rather than a real effect (their own write-up calls the two
  // tiers "virtually identical accuracy"). Left as published, that reversal
  // makes interpolateHandicap jump oddly right at the boundary — improving
  // from 42% to 43% FIR could show Long Game Handicap getting WORSE, not
  // better. Nudged up just enough to make the column strictly monotonic
  // (matches the touched-from-the-same-cited-source intent) without
  // meaningfully changing the real finding: FIR% barely separates players
  // in the 15-25 handicap range.
  {hcp:20, putts:36.1, girPct:22.4, firPct:43.5, updownPct:21.7, threePuttsPerRound:3.3},
  {hcp:25, putts:37.0, girPct:20.0, firPct:43.0, updownPct:20.3, threePuttsPerRound:4.1},
];

// Linearly interpolates an equivalent handicap from a single stat value,
// given which direction is "better" (lower for putts, higher for GIR/updown%).
function interpolateHandicap(value, statKey, higherIsBetter){
  const sorted = higherIsBetter
    ? [...HANDICAP_BENCHMARKS].sort((a,b)=>b[statKey]-a[statKey]) // best stat first (hcp 0)
    : [...HANDICAP_BENCHMARKS].sort((a,b)=>a[statKey]-b[statKey]); // best stat first (hcp 0)
  // Clamp to the table's range rather than extrapolating wildly beyond it.
  if(higherIsBetter ? value>=sorted[0][statKey] : value<=sorted[0][statKey]) return sorted[0].hcp;
  if(higherIsBetter ? value<=sorted[sorted.length-1][statKey] : value>=sorted[sorted.length-1][statKey]) return sorted[sorted.length-1].hcp;
  for(let i=0;i<sorted.length-1;i++){
    const a=sorted[i], b=sorted[i+1];
    const inRange = higherIsBetter ? (value<=a[statKey] && value>=b[statKey]) : (value>=a[statKey] && value<=b[statKey]);
    if(inRange){
      const span = b[statKey]-a[statKey];
      const frac = span===0 ? 0 : (value-a[statKey])/span;
      return Math.round((a.hcp + frac*(b.hcp-a.hcp))*10)/10;
    }
  }
  return sorted[sorted.length-1].hcp;
}

// Derives a "Putting Handicap" from the player's real putts-per-18 and
// 3-putt rate (averaged, since both reflect putting skill), a "Short
// Game Handicap" from their real up-and-down conversion rate, and a
// "Long Game Handicap" from GIR% and FIR% — weighted 70% GIR / 30% FIR,
// since research (Shot Scope/Arccos via Break X Golf) shows GIR% separates
// handicap levels by ~38 percentage points scratch-to-25, while fairways hit
// barely moves (~13 points) and is explicitly called "not the issue" by
// Shot Scope's own analysis — most of the long-game skill signal is in
// approach play (GIR), not off the tee (FIR). Returns null only if there
// are literally zero rounds (nothing to compute from) or a required input
// stat is itself null (e.g. no up-and-down attempts yet). Previously
// required 3+ rounds before showing anything, which meant these numbers
// stayed hidden through a player's first two logged rounds even though
// computeGoalMetric (right below) already computes goal progress from round
// 1 — the two were inconsistent with each other. Now matches that same
// "show real feedback immediately, get more precise over time" behavior:
// noisier from a single round, but never withheld.
function deriveHandicaps(roundCount, avgPutts, threePuttAvg18, updownAvgPct, girPct, firPct){
  if(roundCount < 1) return {puttingHcp:null, shortGameHcp:null, longGameHcp:null};
  // FIXED: previously converted threePuttAvg18 into a "percentage of holes"
  // (divide by 18) and compared it against a benchmark column that actually
  // represented a different statistic from the source data — the two units
  // didn't reconcile (a 25-handicap's 5.8 three-putts/round divided by 18
  // gives 32%, but the sourced "3-putt percentage" for that tier is only
  // 13%, since that stat is defined differently in the original data).
  // Comparing directly against threePuttsPerRound (an unambiguous, directly
  // comparable count) avoids the mismatched-units bug entirely.
  const fromPutts = interpolateHandicap(avgPutts, "putts", false);
  const fromThreePutts = interpolateHandicap(threePuttAvg18, "threePuttsPerRound", false);
  const puttingHcp = Math.round(((fromPutts+fromThreePutts)/2)*10)/10;
  const shortGameHcp = updownAvgPct!=null ? interpolateHandicap(updownAvgPct, "updownPct", true) : null;
  let longGameHcp = null;
  if(girPct!=null && firPct!=null){
    const fromGir = interpolateHandicap(girPct, "girPct", true);
    const fromFir = interpolateHandicap(firPct, "firPct", true);
    longGameHcp = Math.round((fromGir*0.7 + fromFir*0.3)*10)/10;
  } else if(girPct!=null){
    // FIR isn't tracked on every hole (only par 4s/5s) — if a short round of
    // holes happened to be all par 3s, fall back to GIR alone rather than
    // showing nothing.
    longGameHcp = interpolateHandicap(girPct, "girPct", true);
  }
  return {puttingHcp, shortGameHcp, longGameHcp};
}

function getSavedCourses(uid){ return stor("caddy_savedcourses_"+uid, []); }
function saveCourse(uid, course){
  const existing = getSavedCourses(uid);
  if(existing.some(c=>c.name.toLowerCase()===course.name.toLowerCase())) return existing;
  const updated = [...existing, course];
  save("caddy_savedcourses_"+uid, updated);
  return updated;
}

// ═══════════════════════════════════════════════════════════════════════════
// CLUB DISTANCES — personal reference table, lob wedge through driver.
// Stored per-profile as {clubId: distanceInMetres}. Used two ways:
// 1. Player tab — a simple table the user fills in once, in their own units.
// 2. Long Game exercises — when a drill needs "the club you'd hit from Xm"
//    and the player has filled this table in, we suggest their actual club
//    instead of a generic assumption. If empty, we fall back to a sensible
//    generic estimate by distance, but distance (not the club name) stays
//    the actual instruction either way.
// ═══════════════════════════════════════════════════════════════════════════
const CLUBS = [
  {id:"driver", label:"Driver", genericM:210},
  {id:"w3", label:"3 Wood", genericM:195},
  {id:"w5", label:"5 Wood", genericM:180},
  {id:"i2", label:"2 Iron", genericM:175},
  {id:"i3", label:"3 Iron", genericM:168},
  {id:"i4", label:"4 Iron", genericM:160},
  {id:"i5", label:"5 Iron", genericM:150},
  {id:"i6", label:"6 Iron", genericM:140},
  {id:"i7", label:"7 Iron", genericM:130},
  {id:"i8", label:"8 Iron", genericM:120},
  {id:"i9", label:"9 Iron", genericM:110},
  {id:"pw", label:"Pitching Wedge", genericM:95},
  {id:"gw", label:"Gap Wedge", genericM:85},
  {id:"sw", label:"Sand Wedge", genericM:70},
  {id:"lw", label:"Lob Wedge", genericM:55},
];

function getClubDistances(uid){ return stor("caddy_clubs_"+uid, {}); }
function saveClubDistances(uid, distances){ save("caddy_clubs_"+uid, distances); }

// Given a target distance in metres, find the player's own club whose
// personal distance is closest to it. Falls back to the generic table
// (and flags that it's a generic assumption) if the player hasn't filled
// in enough clubs yet. Always returns the distance-based instruction text
// regardless — the club name is a helpful suggestion, never the focus.
function suggestClub(distanceM, personalDistances){
  const filled = CLUBS.filter(c=>personalDistances && personalDistances[c.id]);
  const pool = filled.length>=3 ? filled.map(c=>({...c, m:personalDistances[c.id]})) : CLUBS.map(c=>({...c, m:c.genericM}));
  let best = pool[0], bestDiff = Math.abs(pool[0].m - distanceM);
  pool.forEach(c=>{
    const diff = Math.abs(c.m - distanceM);
    if(diff<bestDiff){ best=c; bestDiff=diff; }
  });
  return {club:best, isPersonal: filled.length>=3};
}

const FOCUS_AREAS = [
  {id:"putting", label:"Putting", emoji:"🟢", desc:"Green mastery"},
  {id:"shortGame", label:"Short Game", emoji:"⛳", desc:"Inside 50 metres"},
  {id:"longGame", label:"Long Game", emoji:"🏌️", desc:"Tee to green"},
  {id:"mental", label:"Mental Game", emoji:"🧠", desc:"Routine and pressure"},
];

// ═══════════════════════════════════════════════════════════════════════════
// PROGRAMS — the 5th category: pre-set, multi-exercise sequences for specific
// goals (warm-up, shot shaping, recovering from the yips, etc). Each program
// is just an ORDERED LIST of existing exercise ids — no new drill content,
// per design — so building a program is purely sequencing what's already in
// EXERCISES. focusId on each step tells the player loop which EXERCISES
// sub-list to pull the full exercise definition from.
// ═══════════════════════════════════════════════════════════════════════════
const PROGRAMS = [
  {
    id:"draw", emoji:"↩️", name:"Draw Development", duration:50,
    desc:"Build a reliable right-to-left shot shape. Starts with alignment fundamentals, moves into intentional shape-making, then locks it in with repeatability work.",
    technical:"A draw curves right-to-left because the clubface is closed relative to an inside-to-out swing path — but still open relative to the target.",
    techniqueKeys:["draw_t1","draw_t2","draw_t3","draw_t4","draw_t5"],
    videoUrl:"https://www.youtube.com/watch?v=6nipc5zzU78", videoTitle:"How to Hit a Draw on Command — Todd Kolb",
    steps:[{focusId:"longGame",exId:"l1"},{focusId:"longGame",exId:"l7"},{focusId:"longGame",exId:"l9"}],
  },
  {
    id:"fade", emoji:"↪️", name:"Fade Development", duration:50,
    desc:"Build a reliable left-to-right shot shape. Same shaping skill as the draw program, same drills, different intent — most players are better served learning to control both directions of curve.",
    technical:"A fade curves left-to-right because the clubface is open relative to an outside-to-in swing path — but still closed relative to the target.",
    techniqueKeys:["fade_t1","fade_t2","fade_t3","fade_t4","fade_t5"],
    videoUrl:"https://www.golftec.com/video/how-to-hit-a-fade-in-golf----simple-golf-swing-tips-that-work", videoTitle:"How to Hit a Fade in 3 Simple Steps — GOLFTEC",
    steps:[{focusId:"longGame",exId:"l1"},{focusId:"longGame",exId:"l7"},{focusId:"longGame",exId:"l9"}],
  },
  {
    id:"slice", emoji:"🚫", name:"Stop Your Slice", duration:45,
    desc:"A slice is the most common swing fault in golf — the ball starts straight or left and curves hard right, losing both distance and accuracy. This program targets the two real causes directly: an open clubface and an outside-in swing path.",
    technical:"A slice happens when the clubface is open relative to the swing path at impact — fix the face before the path, or you'll just turn a slice into a weaker push-slice.",
    techniqueKeys:["slice_t1","slice_t2","slice_t3","slice_t4","slice_t5"],
    videoUrl:"https://www.youtube.com/watch?v=xQq9ncQUrwk", videoTitle:"The Complete Fix Your Slice Guide — Rick Shiels",
    steps:[{focusId:"longGame",exId:"l1"},{focusId:"longGame",exId:"l4"},{focusId:"longGame",exId:"l7"},{focusId:"longGame",exId:"l9"}],
  },
  {
    id:"hook", emoji:"🪝", name:"Stop Your Hook", duration:40,
    desc:"A hook starts right or straight and dives hard left — often more severe than a slice since it runs into trouble fast. This program targets the two real causes: a too-strong grip and a too-far in-to-out swing path.",
    technical:"A hook happens when the clubface is closed relative to the swing path at impact — the mechanical opposite of a slice. Usually easier to fix, but resist overcorrecting straight into a slice.",
    techniqueKeys:["hook_t1","hook_t2","hook_t3","hook_t4"],
    videoUrl:"https://www.youtube.com/watch/_GsHsnGeBq0", videoTitle:"How to Fix a Hook Shot — Chris Ryan Golf",
    steps:[{focusId:"longGame",exId:"l1"},{focusId:"longGame",exId:"l9"}],
  },
  {
    id:"punchLow", emoji:"🌬️", name:"Punch & Low Shot Control", duration:45,
    desc:"For windy days and trouble shots — punches, knockdowns, and stingers all rely on the same skill: controlling where the club bottoms out and committing to a lower, punched trajectory.",
    technical:"A punch reduces trajectory by delofting the clubface at address — ball back, hands ahead, abbreviated swing — not by swinging harder.",
    techniqueKeys:["punchLow_t1","punchLow_t2","punchLow_t3","punchLow_t4","punchLow_t5"],
    videoUrl:"https://www.youtube.com/watch?v=-38JMjRvOzI", videoTitle:"Hit a Low Punch Shot in 3 Simple Steps — Todd Kolb",
    steps:[{focusId:"longGame",exId:"l4"},{focusId:"longGame",exId:"l13"}],
  },
  {
    id:"flopLob", emoji:"🎭", name:"Flop & Lob Mastery", duration:40,
    desc:"High, soft short-game shots only work with full commitment — half-effort attempts chunk or skull. This sequence builds the technique, the lie-adaptability, and the no-hesitation mindset all together.",
    technical:"A flop gets height from a wide-open face and a committed, accelerating swing — decelerating causes the miss, not the technique. Always check the lie first.",
    techniqueKeys:["flopLob_t1","flopLob_t2","flopLob_t3","flopLob_t4","flopLob_t5"],
    videoUrl:"https://www.youtube.com/watch?v=jO3Oys4iJDk", videoTitle:"The Simple Way to Hit a Lob Shot — Golf Explained",
    steps:[{focusId:"shortGame",exId:"s10"},{focusId:"shortGame",exId:"s9"},{focusId:"shortGame",exId:"s13"}],
  },
  {
    id:"bunker", emoji:"🏖️", name:"Bunker Confidence", duration:30,
    desc:"Sand technique paired with the mental reset most players actually need — bunkers are one of the most common tilt triggers in golf, so this pairs the physical skill with composure work.",
    technical:"Bunker shots are won or lost at the entry point into the sand, never at the ball itself — trust the bounce and accelerate through, never decelerate.",
    techniqueKeys:["bunker_t1","bunker_t2","bunker_t3","bunker_t4","bunker_t5"],
    videoUrl:"https://www.youtube.com/watch?v=V4cbQ_TNHQk", videoTitle:"How to Hit a Bunker Shot with Control — Titleist Tips",
    steps:[{focusId:"shortGame",exId:"s7"},{focusId:"mental",exId:"m3"},{focusId:"mental",exId:"m9"}],
  },
  {
    id:"chipping", emoji:"⛳", name:"Chipping Fundamentals", duration:30,
    desc:"A low, running shot played from just off the green — the ball spends most of its journey rolling rather than flying. The modern method favors a forward ball, vertical shaft, and letting the bounce do the work.",
    technical:"Chipping is putting's first cousin — a quiet, shoulder-driven triangle with minimal independent wrist action, trusting the club's bounce instead of digging.",
    techniqueKeys:["chipping_t1","chipping_t2","chipping_t3","chipping_t4"],
    videoUrl:"https://www.youtube.com/watch?v=DcoAqTIPM9Q", videoTitle:"Chipping Setup — Short Game Distilled",
    steps:[{focusId:"shortGame",exId:"s1"},{focusId:"shortGame",exId:"s3"}],
  },
  {
    id:"pitching", emoji:"🎯", name:"Pitching Control", duration:30,
    desc:"A higher, softer shot than a chip, typically from 20-80 yards, where the ball carries most of the distance and lands with some stopping power — sits between a chip and a full wedge swing.",
    technical:"Pitching is a scaled-down full swing built for touch, not power — control distance with 2-3 repeatable swing lengths and commit to accelerating through every one of them.",
    techniqueKeys:["pitching_t1","pitching_t2","pitching_t3","pitching_t4"],
    videoUrl:"https://www.youtube.com/watch?v=pkv5TS32G78", videoTitle:"The Setup and Swing for Perfect Pitch Shots — Me and My Golf",
    steps:[{focusId:"shortGame",exId:"s8"},{focusId:"shortGame",exId:"s2"}],
  },
  {
    id:"yips", emoji:"🩹", name:"Overcoming the Yips", duration:35,
    desc:"The yips respond best to rebuilding confidence at very short range, breathing to reduce tension, and shifting focus from outcome to process — not to more mechanical tinkering. This sequence is built on exactly that approach.",
    technical:"The yips combine physical tension and mental over-control, not a swing-path or clubface problem — chasing a mechanical fix usually makes it worse. A genuine grip-style change is one of the most effective resets.",
    techniqueKeys:["yips_t1","yips_t2","yips_t3","yips_t4","yips_t5"],
    videoUrl:"https://golf.com/instruction/putting/putting-yips-grip-cure-golf-magazine/", videoTitle:"Top 100 Teacher's Grip Fix for the Putting Yips — GOLF",
    steps:[{focusId:"putting",exId:"p2"},{focusId:"mental",exId:"m3"},{focusId:"mental",exId:"m9"},{focusId:"putting",exId:"p9"}],
  },
];

const DURATIONS = [10,15,20,30,40,60]; // capped at 60 min — sessions longer than 1 hour aren't offered
const FEELING_KEYS = ["focused","relaxed","neutral","tired","pumped","anxious"];
const LANG_CODES = ["en","fr","es","de","it","pt"];
const LANG_NAMES = {en:"English",fr:"Francais",es:"Espanol",de:"Deutsch",it:"Italiano",pt:"Portugues"};
const FREQ_KEYS = ["everyday","f45","f23","weekly","monthly","occasional"];
const SCORES = ["under70","70_74","75_79","80_84","85_89","90_94","95_99","100plus"];
// Every goal a player can set must be tied to something we can already
// compute live from real logged data — no manual "mark as done," ever.
// `lowerIsBetter` controls progress-bar direction (e.g. handicap and putts
// count down toward the target; GIR% and scores count up). `compute(sessions)`
// returns the current value or null if there's not enough data yet.
const GOAL_METRICS = [
  {key:"girPct", lowerIsBetter:false, decimals:0, suffix:"%", focusId:"longGame", exerciseId:"l6"}, // Iron Accuracy at 130m
  {key:"firPct", lowerIsBetter:false, decimals:0, suffix:"%", focusId:"longGame", exerciseId:"l5"}, // Fairway Finder
  {key:"avgPutts18", lowerIsBetter:true, decimals:1, focusId:"putting", exerciseId:"p6"}, // Ladder to the Hole
  {key:"threePutts18", lowerIsBetter:true, decimals:1, focusId:"putting", exerciseId:"p4"}, // Lag to the Fringe
  {key:"updownPct", lowerIsBetter:false, decimals:0, suffix:"%", focusId:"shortGame", exerciseId:"s1"}, // Up and Down
  {key:"avgScoreVsPar", lowerIsBetter:true, decimals:1, focusId:null, exerciseId:null}, // broad outcome stat — no single drill maps to it, Train won't show a recommendation banner for this one
];
// Computes the current value for a goal metric from the player's real
// sessions — same math used everywhere else in Stats, just centralized here
// so a goal's progress is always pulled from one consistent source of truth.
function computeGoalMetric(metricKey, sessions){
  const rounds = (sessions||[]).filter(s=>s.type==="round");
  if(metricKey==="hcp") return null; // self-reported, read directly from user.hdcp by the caller
  // FIXED: previously required 3+ rounds before showing ANY value, which
  // meant a freshly-created goal stayed frozen on "no data yet" through its
  // first two logged rounds — confusing, since adding a round visibly did
  // nothing. Now computes from whatever rounds exist (even just 1), which is
  // genuinely noisier early on but gives real, immediate feedback — matching
  // what a player actually expects after logging a round toward a goal.
  if(rounds.length<1) return null;
  const allH = rounds.flatMap(r=>r.holes||[]);
  const perRoundPutts = rounds.map(r=>{
    const hs=r.holes||[]; const scaleTo18=18/(hs.length||18);
    return hs.reduce((a,h)=>a+(h.putts||0),0)*scaleTo18;
  });
  const avgPutts18 = perRoundPutts.reduce((a,b)=>a+b,0)/perRoundPutts.length;
  const perRoundThreePutts = rounds.map(r=>{
    const hs=r.holes||[]; const scaleTo18=18/(hs.length||18);
    return hs.filter(h=>(h.putts||0)>=3).length*scaleTo18;
  });
  const threePutts18 = perRoundThreePutts.reduce((a,b)=>a+b,0)/perRoundThreePutts.length;
  const girPct = girPctOf(allH);
  const firPct = firPctOf(allH);
  const updownAttempts = allH.filter(isUpDownAttempt);
  const updownSuccess = updownAttempts.filter(isUpDownSuccess);
  const updownPct = updownAttempts.length ? (updownSuccess.length/updownAttempts.length)*100 : null;
  const avgScoreVsPar = rounds.length ? rounds.reduce((a,r)=>{
    const tot=(r.holes||[]).reduce((x,h)=>x+(h.score||0),0);
    const par=(r.holes||[]).reduce((x,h)=>x+(h.par||0),0);
    return a+(tot-par);
  },0)/rounds.length : null;
  const {puttingHcp, shortGameHcp, longGameHcp} = deriveHandicaps(rounds.length, avgPutts18, threePutts18, updownPct, girPct, firPct);
  const values = {puttingHcp, shortGameHcp, longGameHcp, girPct, firPct, avgPutts18, threePutts18, updownPct, avgScoreVsPar};
  const v = values[metricKey];
  return v!=null ? Math.round(v*10)/10 : null;
}
// Determines whether a single hole was a successful "up and down" / par save
// — using the "scrambling" definition (the PGA Tour's official, universally
// published stat, confirmed against multiple independent sources): missing
// the green in regulation, but still finishing the hole at PAR OR BETTER,
// regardless of how many strokes it actually took to get there. This is the
// definition our HANDICAP_BENCHMARKS table is calibrated against (sourced
// from real published handicap-level data using this exact stat), so the
// app's calculation must match it for the comparison to mean anything.
//   - "Exactly 2 strokes from off the green" is a DIFFERENT, stricter golf
//     term — sometimes also called "up and down" colloquially — but it
//     produces meaningfully different numbers and isn't what the published
//     handicap benchmarks measure, so it's deliberately NOT used here.
//   - GIR=true never counts (you have to have MISSED the green to attempt
//     a par save in the first place).
// This is the SINGLE source of truth for this calculation — every site in
// the app that computes up-and-down attempts/success must use this.
function isUpDownSuccess(hole){
  if(!hole || hole.gir!==false) return false;
  return hole.score<=hole.par;
}
function isUpDownAttempt(hole){
  return hole && hole.gir===false;
}

// Green-in-regulation % and fairway-in-regulation % from an array of holes —
// same "single source of truth" pattern as isUpDownSuccess/isUpDownAttempt
// above. Every site in the app that shows a GIR% or FIR% must go through
// here so Stats, Goals, and Handicap History can never round differently or
// silently drift apart from each other. FIR is only counted on par 4s/5s
// (a par 3 has no fairway to hit). Rounded to 1 decimal, matching the
// precision computeSingleRoundMetric already used — the more precise of the
// conventions previously scattered across the file.
function girPctOf(holes){
  const hs = holes||[];
  return hs.length ? Math.round((hs.filter(h=>h.gir).length/hs.length)*1000)/10 : null;
}
function firPctOf(holes){
  const firHoles = (holes||[]).filter(h=>h.par>3);
  return firHoles.length ? Math.round((firHoles.filter(h=>h.fir).length/firHoles.length)*1000)/10 : null;
}

// Computes ONE round's own raw value for a given goal metric — distinct from
// computeGoalMetric, which averages across a window of 3+ rounds and exists
// to answer "how is this player trending overall." This answers a different
// question: "what did THIS specific round look like for the thing the goal
// is tracking" — e.g. how many 3-putts happened in this one round, not the
// rolling average. No minimum-rounds gate, since a single round is always
// a valid, complete data point on its own.
function computeSingleRoundMetric(metricKey, round){
  if(!round || round.type!=="round") return null;
  const holes = round.holes||[];
  if(!holes.length) return null;
  const scaleTo18 = 18/holes.length;
  if(metricKey==="avgPutts18") return Math.round(holes.reduce((a,h)=>a+(h.putts||0),0)*scaleTo18*10)/10;
  if(metricKey==="threePutts18") return Math.round(holes.filter(h=>(h.putts||0)>=3).length*scaleTo18*10)/10;
  if(metricKey==="girPct") return girPctOf(holes);
  if(metricKey==="firPct") return firPctOf(holes);
  if(metricKey==="updownPct"){
    const attempts = holes.filter(isUpDownAttempt);
    return attempts.length ? Math.round((attempts.filter(isUpDownSuccess).length/attempts.length)*1000)/10 : null;
  }
  if(metricKey==="avgScoreVsPar"){
    const tot = holes.reduce((a,h)=>a+(h.score||0),0);
    const par = holes.reduce((a,h)=>a+(h.par||0),0);
    return Math.round((tot-par)*10)/10;
  }
  return null;
}
const DEF_SETTINGS = {language:"en", units:"imperial", holes:18};

// ── TRANSLATIONS — all 6 languages fully written, no silent fallback ────────
const TR = {
  en: {
    appTagline:"Train smarter. Score lower.", createAccount:"Create Account", signIn:"Sign In",
    welcomeBack:"Welcome back", signInSub:"Sign in to keep training", email:"Email", password:"Password",
    noAccount:"No account? Create one", notYou:"Not you? Use a different account", createAcct:"Create account", step1:"Step 1 of 2", step2:"Step 2 of 2",
    finisherGames:"Finisher Games", players:"Players", addPlayer:"Add Player", localMultiplayerNote:"Local multiplayer: pass the phone between players each station.", forYourGoals:"For Your Goals",
    startFinisher:"Start Finisher", station:"Station", scoreForStation:"Score for this station", prevStation:"Previous", nextStation:"Next Station", finishGame:"Finish Game",
    handPhoneTo:"Hand the phone to", nextPlayer:"Next Player", byStation:"By Station", yourEvolution:"Your Evolution", runningTotal:"Running Total", today:"Today", bestPrevious:"Best Previous",
    exportImage:"Export as Image", exporting:"Exporting", exported:"Saved", exportFailed:"Couldn't export — try a screenshot instead", copied:"Copied to clipboard", shareResult:"Share Result", howWhy:"How & Why",
    noSessionsYetTap:"No sessions yet — tap to see what's here", noSessionsYet:"No sessions yet", noSessionsYetDesc:"Train this area to start building your progress history here.",
    avgScore:"Avg Score", worst:"Lowest", evolution:"Evolution", sinceStart:"since start", needMoreSessions:"Complete one more session to see your trend.",
    exercisesPracticed:"Exercises Practiced", allSessions:"All Sessions", upMeansImproving:"Line trending up = improving (lower scores)",
    per18Holes:"per 18 holes", successRate:"success rate", downMeansImproving:"Line trending down = improving (fewer 3-putts)",
    higherMeansHigherScore:"Line goes up when score goes up — doesn't mean better or worse", higherMeansMorePutts:"Line goes up when putts go up — more putts isn't a good thing",
    higherMeansMoreUpDowns:"Line goes up when up-and-downs go up", higherMeansMoreGreens:"Line goes up when more greens are hit", higherMeansMoreFairways:"Line goes up when more fairways are hit",
    higherMeansHigherHcp:"Line goes up when the handicap goes up — a lower handicap is the goal",
    viewHistory:"View History", scorecardHistory:"Scorecard History", roundCount:"round", roundCount2:"rounds",
    last5:"Last 5", last10:"Last 10", last25:"Last 25", allTime:"All Time",
    createSub:"Your personal training starts here", fullName:"Full Name", choosePass:"Choose a password",
    continue:"Continue", haveAccount:"Already have an account? Sign in", golfProfile:"Golf profile",
    golfProfileSub:"Personalizes your training plan", handicapIndex:"Handicap Index", handicapHelp:"Use + for plus handicaps (e.g. +2.4)",
    hcpFormatError:"Enter a valid number, like 14.2 or +2.4", hcpRangeError:"Handicap must be between -5.0 and 54.0",
    playFreq:"How often do you play?", selectFreq:"Select frequency", measurement:"Measurement",
    yardsFeet:"Yards / Feet", metres:"Metres", language:"Language", startTraining:"Start Training",
    fillAll:"Please fill all fields.", wrongLogin:"Wrong email or password.", emailTaken:"Email already registered.",
    back:"Back",
    train:"Train", scorecard:"Scorecard", stats:"Stats", history:"History", player:"Player",
    chooseFocus:"Choose your focus area", start:"Start", sessions:"sessions",
    min:"min", chooseExercise:"Choose Exercise", drillsAvail:"drills available",
    last:"Last", purpose:"Purpose", yourHistory:"Your History", first:"First", best:"Best",
    outOf:"out of", saveResult:"Save Result", excellent:"Excellent!", goodWork:"Good Work", keepGoing:"Keep Going",
    yourScore:"Your Score", vsLast:"vs last session", whyMatters:"Why this matters", newSession:"New Session",
    trackRound:"Track your round, hole by hole", holes:"holes", startRound:"Start Round", playHereAgain:"Play Here Again",
    golfCourse:"Golf Course", coursePh:"e.g. Pebble Beach...", feelToday:"How do you feel today?",
    roundType:"Round Type", roundTypePractice:"Practice", roundTypeCompetition:"Competition", allRoundTypes:"All", noRoundsMatchFilter:"No rounds match this filter",
    savedCourse:"saved", courseAutoSaveHint:"Pick a course to auto-fill par, or type a new one — it'll be saved for next time.",
    browse:"Browse", chooseCourse:"Choose Course", searchCourses:"Search courses...", addNewCourse:"Add New Course",
    courseName:"Course Name", parPerHole:"Par per Hole", totalPar:"Total Par", saveCourseBtn:"Save Course", noCoursesFound:"No courses found",
    resetDemoTitle:"Reset to Demo Data", resetDemoDesc:"Clears everything on this device and reloads with the example Edouard L data (30 sessions, Finisher games vs Alban L and Simon M). This cannot be undone.", resetDemoBtn:"Reset Demo Data", resetDemoConfirm:"Yes, Reset",
    fullResetTitle:"Reset for a New User", fullResetDesc:"Deletes every account, round, training session, and setting stored on this device — and logs out completely back to the sign-up screen, reset to English and metric units. Use this before handing the app to someone else. This cannot be undone.", fullResetBtn:"Reset Everything", fullResetConfirm:"Yes, Erase Everything",
    notesOptional:"Notes (optional)", notesPh:"Windy back nine, putts were rolling true...",
    cancel:"Cancel", saveRound:"Save Round", hole:"Hole", par:"Par", score:"Score", putts:"Putts", miss:"Miss",
    girImpossible:"Not possible with this score and putts — GIR means reaching the green in par minus 2 strokes.",
    girRequired:"This score and putts only add up if you reached the green in regulation — GIR has been checked for you.",
    roundSaved:"Round Saved!", roundSavedSub:"Nice work out there", viewSummary:"View Summary", done:"Done",
    gameGlance:"Your game at a glance", onCourse:"On-Course", avgPutts:"Avg Putts", perHole:"per hole",
    greens:"greens", fairways:"fairways", topMiss:"Top Miss", common:"common",
    threePutts:"3-Putts", holesTotal:"holes", upAndDown:"Up & Down", attempts:"attempts",
    scoreVsPar:"Score vs Par", lastRounds:"Last", rounds:"rounds", trainingProgress:"Training Progress", scoreTrend:"Score Trend",
    hdcpVsActual:"Handicap vs Actual", declaredHdcp:"Your Handicap", actualAvg:"Actual Avg (vs par)",
    playingAbove:"Playing above your handicap", playingBelow:"Playing below your handicap", playingOnTarget:"Right on target",
    playingAboveDesc:"Your recent rounds average {n} strokes higher than your handicap suggests. Worth digging into Stats by area to see where strokes are slipping away.",
    playingBelowDesc:"Your recent rounds average {n} strokes better than your handicap suggests — nice work, your index may be due for an update.",
    playingOnTargetDesc:"Your actual scoring closely matches your declared handicap. Solid consistency.",
    hdcpDisclaimer:"Simplified estimate — does not account for course rating or slope.",
    derivedHandicaps:"Estimated Skill Handicaps", puttingHcp:"Putting Handicap", shortGameHcp:"Short Game Handicap", longGameHcp:"Long Game Handicap",
    derivedHandicapDisclaimer:"Estimated from your real putts, 3-putts, and up-and-down rate, benchmarked against published Shot Scope / Arccos handicap-level data — not an official handicap.",
    handicapHistory:"Handicap History", howCalculated:"How this is calculated", yourLatestNumbers:"Your latest numbers (last 5 rounds)", roundOverview:"Round Overview",
    hcpCalcExplain:"Putting Handicap averages two figures from your last 5 rounds — your putts per 18 holes and your 3-putt rate — each matched against the benchmark table below. Short Game Handicap comes from your up-and-down conversion rate, matched the same way. Long Game Handicap blends GIR% (70% weight) and FIR% (30% weight) — research shows GIR is by far the stronger predictor of skill level, while fairways hit barely separates handicaps. The table is built from real Shot Scope and Arccos player data across thousands of rounds.",
    hcpLevel:"Handicap", threePuttsShort:"3-Putts", upAndDownShort:"Up&Down", scratch:"Scratch",
    myPlan:"My Plan", planSub:"Sessions queued up for next time", planEmpty:"No sessions planned yet. Build a queue of drills to work through next time you train.",
    addSession:"Add Session", addToPlan:"Add to your plan", startNext:"Start Next", nextInPlan:"Next in your plan",
    focusRec:"Focus Recommendation", focus:"Focus", strong:"Strong", getStarted:"Get started", getStartedSub:"Train a skill or log a round to begin tracking your progress.",
    startTrainingCta:"Start Training", logRoundCta:"Log a Round", unlockStatsHint:"Track FIR, GIR, putts and miss direction for every hole to unlock detailed stats.",
    sessionsCount:"session", sessionsCount2:"sessions", clearAll:"Clear all", noHistory:"Your sessions will appear here.",
    confirmClear:"Clear all history?", deleteThis:"Delete this entry?", deleteThisGroup:"Delete this for all players?", delete:"Delete",
    roundSummary:"Round Summary", profile:"Profile", settings:"Settings", personalInfo:"Personal Info", yourName:"Your name",
    homeClub:"Home Club", homeClubPh:"e.g. Pebble Beach", location:"Location", locationPh:"City, Country",
    typicalScore:"Typical Score", dominantHand:"Dominant Hand", right:"Right", left:"Left", select:"Select...",
    mainGoal:"Main Goal", weaknesses:"Weaknesses", saveProfile:"Save Profile", profileSaved:"Profile Saved",
    goals:"Goals", addGoal:"Add Goal", setFirstGoal:"Set your first goal", goalNoDataYet:"No data yet", alreadyActiveGoal:"Already an active goal",
    targetInvalidNumber:"Enter a valid number", targetCannotBeNegative:"This can't be negative", targetOver100Pct:"This is a percentage, so it can't be over 100",
    goalsTagline:"Track real, measurable targets — auto-updated from your data", goalsEmptyDesc:"Pick a stat you already track — your handicap, GIR%, putts — and set a number and a date. We'll do the rest.",
    goalsDataScopeNote:"Every number here is calculated only from rounds played since each goal was set — not your all-time stats. That's why these can look different from the totals in Stats.",
    activeGoals:"In Progress", reachedGoals:"Reached", target:"Target", ofTheWay:"of the way there", goalReached:"goal reached",
    goalHistory:"Goal History", goalOutcomeReached:"Reached", goalOutcomeExpired:"Time's up — not reached", goalOutcomeEnded:"Ended early",
    viewDetails:"View Details", sinceGoalSetOn:"Since this goal was set on", startedAt:"Started at", needMoreRoundsForTrend:"Log a few more rounds to see your trend here",
    oneRoundLoggedSoFar:"1 round logged so far — tap to see it",
    selectMetricToReview:"Select what to review", sampledFromRounds:"sampled from {n} rounds", scrollForAllPoints:"← Scroll to see every point →",
    gettingBetter:"Improving", gettingWorse:"Slipping", atOrBeyondTarget:"At or Beyond Target", shortOfTarget:"Short of Target",
    trendFlat:"Holding steady", latestSameAsStart:"Your latest round matches where you started", trendImprovedBy:"{n} closer to target than where you started", trendWorsenedBy:"{n} further from target than where you started",
    onTrack:"On Track", offTrack:"Off Track", ofProgressMade:"of the way there", currentlyAt:"Currently at",
    markAchieved:"Mark Achieved", raiseTheBar:"Raise the Bar", raiseTheBarDesc:"You reached {target} for {metric}. Set a new, harder target and keep training toward it.",
    roundsSinceGoalSet:"Rounds Since This Goal Was Set", noRoundsSinceGoalSet:"No rounds logged yet since this goal was set",
    dayLeft:"day left", daysLeft:"days left", deadlinePassed:"deadline passed",
    newGoal:"New Goal", chooseMetric:"Choose what to track", currentValue:"Current", setTarget:"Set your target",
    targetLowerPlaceholder:"e.g. a lower number than current", targetHigherPlaceholder:"e.g. a higher number than current",
    setDeadline:"Set a deadline", saveGoal:"Save Goal",
    setPeriod:"Set a timeframe", period1m:"1 month", period3m:"3 months", period6m:"6 months", period12m:"12 months",
    progressOverTime:"Progress Over Time", recommendedFromGoal:"Recommended from your goal",
    goalMetric_hcp:"Handicap Index", goalMetric_puttingHcp:"Putting Handicap", goalMetric_shortGameHcp:"Short Game Handicap", goalMetric_longGameHcp:"Long Game Handicap",
    goalMetric_girPct:"Greens in Regulation %", goalMetric_firPct:"Fairways in Regulation %", goalMetric_avgPutts18:"Putts per 18 Holes",
    goalMetric_threePutts18:"3-Putts per Round", goalMetric_updownPct:"Up & Down %", goalMetric_avgScoreVsPar:"Average Score vs Par",
    signOut:"Sign Out", defaultHoles:"Default Holes", settingsAuto:"Settings save automatically",
    streakDay:"day streak", streakDays:"day streak", feel_focused:"Focused", feel_relaxed:"Relaxed", feel_neutral:"Neutral", feel_tired:"Tired", feel_pumped:"Pumped", feel_anxious:"Anxious",
    freq_everyday:"Every day", freq_f45:"4-5x/week", freq_f23:"2-3x/week", freq_weekly:"Once a week", freq_monthly:"Monthly", freq_occasional:"Occasionally",
    score_under70:"Under 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Lower handicap", goal_break90:"Break 90", goal_break80:"Break 80", goal_break70:"Break 70", goal_shortGame:"Better short game", goal_management:"Course management", goal_enjoy:"Enjoy the game", goal_compete:"Compete",
    weak_driver:"Driver", weak_irons:"Irons", weak_wedges:"Wedges", weak_putting:"Putting", weak_bunker:"Bunker", weak_mental:"Mental", weak_shortGame2:"Short game", weak_strategy:"Strategy",
    clubDistances:"Club Distances", clubDistancesHint:"Fill in how far you carry each club. Drills that need a specific distance will suggest your actual club instead of guessing.",
    ydsAbbr:"yds", mAbbr:"m",
    club_driver:"Driver", club_w3:"3 Wood", club_w5:"5 Wood", club_i2:"2 Iron", club_i3:"3 Iron", club_i4:"4 Iron", club_i5:"5 Iron", club_i6:"6 Iron", club_i7:"7 Iron", club_i8:"8 Iron", club_i9:"9 Iron", club_pw:"Pitching Wedge", club_gw:"Gap Wedge", club_sw:"Sand Wedge", club_lw:"Lob Wedge",
    yourClubSuggestion:"Your club for this distance", genericClubSuggestion:"Suggested club (generic estimate)", approxSuffix:"(approx.)",
    clubface:"Clubface", ballPosition:"Ball Position", face_square:"Square to target", face_open:"Open", face_varies:"Varies by shot", ball_center:"Center of stance", ball_forward:"Forward (lead foot)", ball_back:"Back of center", ball_varies:"Varies by club",
    totalResult:"Total Result", byExercise:"By Exercise", recommendedForYou:"Recommended for you", basedOnWeakness:"Based on your weakness",
    statReason_gir:"Based on your rounds — your GIR is below target", statReason_threePutt:"Based on your rounds — 3-putts above target", statReason_updown:"Based on your rounds — up-and-down rate below target",
    rightHandedNote:"These setup instructions are written for right-handed players. If you play left-handed, mirror every direction (left↔right, clockwise↔counter-clockwise).",
    programs:"Pre-Set Programs", steps:"steps", programSteps:"What's in this program", startProgram:"Start Program", programComplete:"Program Complete", saveAndNext:"Save & Next", exitProgram:"Exit Program", theTechnique:"The Technique", watchVideo:"Watch",
    prog_draw_name:"Draw Development", prog_draw_desc:"Build a reliable right-to-left shot shape. Starts with alignment fundamentals, moves into intentional shape-making, then locks it in with repeatability work.",
    prog_draw_technical:"A draw curves right-to-left because the clubface is closed relative to an inside-to-out swing path — but still open relative to the target.",
    draw_t1:"Grip slightly stronger — rotate both hands a touch right (2.5-3 knuckles visible on lead hand)", draw_t2:"Ball position: middle of stance, or one ball-width back for irons", draw_t3:"Close your stance slightly — trail foot back 5 cm, hips and shoulders matching", draw_t4:"Aim feet/hips/shoulders slightly right of target; clubface aimed at the real target", draw_t5:"Swing back, then release naturally through impact — don't try to flip or manually close the face",
    draw_t1_left:"Grip slightly stronger — rotate both hands a touch left (2.5-3 knuckles visible on lead hand)", draw_t3_left:"Close your stance slightly — trail foot back 5 cm, hips and shoulders matching (mirrored for left-handed)", draw_t4_left:"Aim feet/hips/shoulders slightly left of target; clubface aimed at the real target",
    prog_fade_name:"Fade Development", prog_fade_desc:"Build a reliable left-to-right shot shape. Same shaping skill as the draw program, same drills, different intent — most players are better served learning to control both directions of curve.",
    prog_fade_technical:"A fade curves left-to-right because the clubface is open relative to an outside-to-in swing path — but still closed relative to the target.",
    fade_t1:"Grip slightly weaker — rotate both hands a touch left (about 1 knuckle visible on lead hand)", fade_t2:"Ball position: slightly forward of your normal spot", fade_t3:"Open your stance slightly — lead foot back 5 cm, hips and shoulders matching", fade_t4:"Aim feet/hips/shoulders slightly left of target; clubface aimed at the real target", fade_t5:"Hold the clubface open a fraction longer through impact — resist a full release",
    fade_t1_left:"Grip slightly weaker — rotate both hands a touch right (about 1 knuckle visible on lead hand)", fade_t3_left:"Open your stance slightly — lead foot back 5 cm (mirrored for left-handed)", fade_t4_left:"Aim feet/hips/shoulders slightly right of target; clubface aimed at the real target",
    prog_slice_name:"Stop Your Slice", prog_slice_desc:"A slice is the most common swing fault in golf — the ball starts straight or left and curves hard right, losing both distance and accuracy. This program targets the two real causes directly: an open clubface and an outside-in swing path.",
    prog_slice_technical:"A slice happens when the clubface is open relative to the swing path at impact — fix the face before the path, or you'll just turn a slice into a weaker push-slice.",
    slice_t1:"Check your grip — if you see only 0-1 knuckles on your lead hand, strengthen it to 2-3", slice_t2:"Square your stance — feet, hips, shoulders parallel to target, not aimed left", slice_t3:"Move the ball slightly back from wherever it sits now, especially with driver", slice_t4:"Aim the clubface directly at the target — resist the instinct to aim left", slice_t5:"Keep your trail elbow close to your body on the way down, then let the forearms rotate fully through impact",
    slice_t2_left:"Square your stance — feet, hips, shoulders parallel to target, not aimed right", slice_t4_left:"Aim the clubface directly at the target — resist the instinct to aim right",
    prog_hook_name:"Stop Your Hook", prog_hook_desc:"A hook starts right or straight and dives hard left — often more severe than a slice since it runs into trouble fast. This program targets the two real causes: a too-strong grip and a too-far in-to-out swing path.",
    prog_hook_technical:"A hook happens when the clubface is closed relative to the swing path at impact — the mechanical opposite of a slice. Usually easier to fix, but resist overcorrecting straight into a slice.",
    hook_t1:"Check your grip — if you see 4+ knuckles on your lead hand, weaken it slightly to 2-3", hook_t2:"Square your stance — feet, hips, shoulders parallel to target, not aimed right", hook_t3:"Check ball position isn't too far back — bring it forward toward your normal spot", hook_t4:"Feel a quieter release — let rotation happen from body turn, not an aggressive hand flip",
    hook_t2_left:"Square your stance — feet, hips, shoulders parallel to target, not aimed left",
    prog_punchLow_name:"Punch & Low Shot Control", prog_punchLow_desc:"For windy days and trouble shots — punches, knockdowns, and stingers all rely on the same skill: controlling where the club bottoms out and committing to a lower, punched trajectory.",
    prog_punchLow_technical:"A punch reduces trajectory by delofting the clubface at address — ball back, hands ahead, abbreviated swing — not by swinging harder.",
    punchLow_t1:"Take one extra club and choke down 5 cm on the grip", punchLow_t2:"Ball position: 1-2 ball-widths back of your normal spot", punchLow_t3:"Narrow your stance, set weight forward (~60% lead foot) and keep it there", punchLow_t4:"Swing back to three-quarter length only — no full backswing", punchLow_t5:"Keep hands ahead of the clubhead through impact, then stop the follow-through low",
    prog_flopLob_name:"Flop & Lob Mastery", prog_flopLob_desc:"High, soft short-game shots only work with full commitment — half-effort attempts chunk or skull. This sequence builds the technique, the lie-adaptability, and the no-hesitation mindset all together.",
    prog_flopLob_technical:"A flop gets height from a wide-open face and a committed, accelerating swing — decelerating causes the miss, not the technique. Always check the lie first.",
    flopLob_t1:"Check the lie first — confirm there's enough cushion under the ball for this shot", flopLob_t2:"Open the clubface fully before gripping — set it, then take your grip from that open position", flopLob_t3:"Ball position: forward, off your lead heel", flopLob_t4:"Open your stance well left of target, weight 60-80% on your lead foot", flopLob_t5:"Commit and accelerate through impact — a tentative swing chunks or thins it",
    flopLob_t4_left:"Open your stance well right of target, weight 60-80% on your lead foot",
    prog_bunker_name:"Bunker Confidence", prog_bunker_desc:"Sand technique paired with the mental reset most players actually need — bunkers are one of the most common tilt triggers in golf, so this pairs the physical skill with composure work.",
    prog_bunker_technical:"Bunker shots are won or lost at the entry point into the sand, never at the ball itself — trust the bounce and accelerate through, never decelerate.",
    bunker_t1:"Open the clubface before you take your grip", bunker_t2:"Take a wide stance and dig your feet in slightly for stability", bunker_t3:"Ball position: forward, off your lead heel — sternum just behind the ball", bunker_t4:"Aim to enter the sand about 5 cm behind the ball", bunker_t5:"Accelerate all the way through the sand — never decelerate",
    prog_chipping_name:"Chipping Fundamentals", prog_chipping_desc:"A low, running shot played from just off the green — the ball spends most of its journey rolling rather than flying. The modern method favors a forward ball, vertical shaft, and letting the bounce do the work.",
    prog_chipping_technical:"Chipping is putting's first cousin — a quiet, shoulder-driven triangle with minimal independent wrist action, trusting the club's bounce instead of digging.",
    chipping_t1:"Grip normally, choke down a little for extra control", chipping_t2:"Narrow your stance — feet close together, roughly one clubhead-width apart", chipping_t3:"Ball position: forward in your stance, shaft kept relatively vertical", chipping_t4:"Move arms and shoulders as one quiet unit — trust the bounce, hit down to make it go up",
    prog_pitching_name:"Pitching Control", prog_pitching_desc:"A higher, softer shot than a chip, typically from 20-80 yards, where the ball carries most of the distance and lands with some stopping power — sits between a chip and a full wedge swing.",
    prog_pitching_technical:"Pitching is a scaled-down full swing built for touch, not power — control distance with 2-3 repeatable swing lengths and commit to accelerating through every one of them.",
    pitching_t1:"Narrow your stance relative to a full swing, scaling smaller for shorter pitches", pitching_t2:"Set weight ~60% on your lead foot and keep shoulders more level than a full swing", pitching_t3:"Ball position: center to slightly forward, hands slightly ahead of the ball", pitching_t4:"Pick your swing length, then accelerate through — never decelerate into the strike",
    prog_yips_name:"Overcoming the Yips", prog_yips_desc:"The yips respond best to rebuilding confidence at very short range, breathing to reduce tension, and shifting focus from outcome to process — not to more mechanical tinkering. This sequence is built on exactly that approach.",
    prog_yips_technical:"The yips combine physical tension and mental over-control, not a swing-path or clubface problem — chasing a mechanical fix usually makes it worse. A genuine grip-style change is one of the most effective resets.",
    yips_t1:"Before stepping in, do a full-body tension check — shake out your hands and arms, take one slow breath", yips_t2:"Consider a different grip style than usual — claw, saw, or cross-handed — to break the old tension pattern", yips_t3:"Soften your grip pressure deliberately — aim for roughly 3-4 out of 10", yips_t4:"Pick exactly one cue for the stroke — 'soft hands,' 'smooth tempo,' or 'steady wrist' — and nothing else", yips_t5:"Step in and let the stroke happen — resist the urge to consciously steer or help the ball in",
    diff_Beginner:"Beginner", diff_Intermediate:"Intermediate", diff_Advanced:"Advanced",
    left_dir:"Left", right_dir:"Right", short_dir:"Short", long_dir:"Long",
  },
  fr: {
    appTagline:"Entrainez-vous mieux. Jouez moins.", createAccount:"Creer un compte", signIn:"Se connecter",
    welcomeBack:"Bon retour", signInSub:"Connectez-vous pour continuer", email:"Email", password:"Mot de passe",
    noAccount:"Pas de compte ? En creer un", notYou:"Pas vous ? Utiliser un autre compte", createAcct:"Creer un compte", step1:"Etape 1 sur 2", step2:"Etape 2 sur 2",
    finisherGames:"Jeux Finisher", players:"Joueurs", addPlayer:"Ajouter un joueur", localMultiplayerNote:"Multijoueur local : passez le telephone entre joueurs a chaque station.", forYourGoals:"Pour Vos Objectifs",
    startFinisher:"Demarrer", station:"Station", scoreForStation:"Score pour cette station", prevStation:"Precedent", nextStation:"Station suivante", finishGame:"Terminer",
    handPhoneTo:"Passez le telephone a", nextPlayer:"Joueur suivant", byStation:"Par station", yourEvolution:"Votre evolution", runningTotal:"Total cumule", today:"Aujourd'hui", bestPrevious:"Meilleur precedent",
    exportImage:"Exporter en image", exporting:"Export en cours", exported:"Enregistre", exportFailed:"Echec de l'export — essayez une capture d'ecran", copied:"Copie dans le presse-papiers", shareResult:"Partager le resultat", howWhy:"Comment et pourquoi",
    noSessionsYetTap:"Aucune session encore — touchez pour voir", noSessionsYet:"Aucune session encore", noSessionsYetDesc:"Entrainez ce domaine pour commencer a suivre vos progres ici.",
    avgScore:"Score moyen", worst:"Plus bas", evolution:"Evolution", sinceStart:"depuis le debut", needMoreSessions:"Completez une session de plus pour voir votre tendance.",
    exercisesPracticed:"Exercices pratiques", allSessions:"Toutes les sessions", upMeansImproving:"Courbe vers le haut = progres (scores plus bas)",
    per18Holes:"sur 18 trous", successRate:"taux de reussite", downMeansImproving:"Courbe vers le bas = progres (moins de 3-putts)",
    higherMeansHigherScore:"La courbe monte quand le score monte — ne signifie ni mieux ni pire", higherMeansMorePutts:"La courbe monte quand les putts augmentent — plus de putts n'est pas bon signe",
    higherMeansMoreUpDowns:"La courbe monte quand les up-and-downs augmentent", higherMeansMoreGreens:"La courbe monte quand plus de greens sont touches", higherMeansMoreFairways:"La courbe monte quand plus de fairways sont touchees",
    higherMeansHigherHcp:"La courbe monte quand le handicap augmente — un handicap plus bas est l'objectif",
    viewHistory:"Voir l'historique", scorecardHistory:"Historique des cartes de score", roundCount:"partie", roundCount2:"parties",
    last5:"5 dernieres", last10:"10 dernieres", last25:"25 dernieres", allTime:"Depuis toujours",
    createSub:"Votre entrainement personnel commence ici", fullName:"Nom complet", choosePass:"Choisissez un mot de passe",
    continue:"Continuer", haveAccount:"Deja un compte ? Se connecter", golfProfile:"Profil golf",
    golfProfileSub:"Personnalise votre plan d'entrainement", handicapIndex:"Index de handicap", handicapHelp:"Utilisez + pour un handicap positif (ex: +2.4)",
    hcpFormatError:"Entrez un nombre valide, comme 14.2 ou +2.4", hcpRangeError:"Le handicap doit etre entre -5.0 et 54.0",
    playFreq:"A quelle frequence jouez-vous ?", selectFreq:"Choisir frequence", measurement:"Unites",
    yardsFeet:"Yards / Pieds", metres:"Metres", language:"Langue", startTraining:"Commencer",
    fillAll:"Merci de remplir tous les champs.", wrongLogin:"Email ou mot de passe incorrect.", emailTaken:"Cet email est deja utilise.",
    back:"Retour",
    train:"Entrainement", scorecard:"Carte de score", stats:"Statistiques", history:"Historique", player:"Joueur",
    chooseFocus:"Choisissez votre domaine", start:"Demarrer", sessions:"sessions",
    min:"min", chooseExercise:"Choisir un exercice", drillsAvail:"exercices disponibles",
    last:"Dernier", purpose:"Objectif", yourHistory:"Votre historique", first:"Premier", best:"Meilleur",
    outOf:"sur", saveResult:"Enregistrer", excellent:"Excellent !", goodWork:"Bon travail", keepGoing:"Continuez",
    yourScore:"Votre score", vsLast:"vs derniere session", whyMatters:"Pourquoi c'est important", newSession:"Nouvelle session",
    trackRound:"Suivez votre partie, trou par trou", holes:"trous", startRound:"Demarrer la partie", playHereAgain:"Rejouer ici",
    golfCourse:"Terrain de golf", coursePh:"ex: Pebble Beach...", feelToday:"Comment vous sentez-vous ?",
    roundType:"Type de Partie", roundTypePractice:"Entrainement", roundTypeCompetition:"Competition", allRoundTypes:"Toutes", noRoundsMatchFilter:"Aucune partie ne correspond a ce filtre",
    savedCourse:"enregistre", courseAutoSaveHint:"Choisissez un parcours pour remplir le par automatiquement, ou tapez-en un nouveau — il sera enregistre pour la prochaine fois.",
    browse:"Parcourir", chooseCourse:"Choisir un parcours", searchCourses:"Rechercher un parcours...", addNewCourse:"Ajouter un parcours",
    courseName:"Nom du parcours", parPerHole:"Par par trou", totalPar:"Par total", saveCourseBtn:"Enregistrer le parcours", noCoursesFound:"Aucun parcours trouve",
    resetDemoTitle:"Reinitialiser les donnees demo", resetDemoDesc:"Efface tout sur cet appareil et recharge avec les donnees d'exemple d'Edouard L (30 sessions, parties Finisher contre Alban L et Simon M). Action irreversible.", resetDemoBtn:"Reinitialiser", resetDemoConfirm:"Oui, reinitialiser",
    fullResetTitle:"Reinitialiser pour un nouvel utilisateur", fullResetDesc:"Supprime tous les comptes, parties, sessions d'entrainement et reglages stockes sur cet appareil — et deconnecte completement vers l'ecran d'inscription, remis en anglais et unites metriques. A utiliser avant de transmettre l'app a quelqu'un d'autre. Action irreversible.", fullResetBtn:"Tout reinitialiser", fullResetConfirm:"Oui, tout effacer",
    notesOptional:"Notes (optionnel)", notesPh:"Vent sur les 9 derniers trous, bons putts...",
    cancel:"Annuler", saveRound:"Enregistrer", hole:"Trou", par:"Par", score:"Score", putts:"Putts", miss:"Erreur",
    girImpossible:"Impossible avec ce score et ces putts — GIR signifie atteindre le green en par moins 2 coups.",
    girRequired:"Ce score et ces putts ne concordent que si vous avez atteint le green en par moins 2 coups — GIR a ete coche pour vous.",
    roundSaved:"Partie enregistree !", roundSavedSub:"Beau parcours", viewSummary:"Voir le resume", done:"Termine",
    gameGlance:"Votre jeu en un coup d'oeil", onCourse:"Sur le terrain", avgPutts:"Putts moy.", perHole:"par trou",
    greens:"greens", fairways:"fairways", topMiss:"Erreur principale", common:"frequente",
    threePutts:"3-Putts", holesTotal:"trous", upAndDown:"Up & Down", attempts:"tentatives",
    scoreVsPar:"Score vs Par", lastRounds:"Dernieres", rounds:"parties", trainingProgress:"Progression", scoreTrend:"Tendance du Score",
    hdcpVsActual:"Handicap vs Reel", declaredHdcp:"Votre handicap", actualAvg:"Moyenne reelle (vs par)",
    playingAbove:"Vous jouez au-dessus de votre handicap", playingBelow:"Vous jouez en-dessous de votre handicap", playingOnTarget:"Tout a fait dans la cible",
    playingAboveDesc:"Vos dernieres parties sont en moyenne {n} coups plus elevees que ce que suggere votre handicap. Regardez vos statistiques par domaine pour voir ou les coups s'echappent.",
    playingBelowDesc:"Vos dernieres parties sont en moyenne {n} coups meilleures que ce que suggere votre handicap — beau travail, votre index merite peut-etre une mise a jour.",
    playingOnTargetDesc:"Votre score reel correspond bien a votre handicap declare. Belle constance.",
    hdcpDisclaimer:"Estimation simplifiee — ne tient pas compte du rating ou du slope du parcours.",
    derivedHandicaps:"Handicaps de Competence Estimes", puttingHcp:"Handicap de Putting", shortGameHcp:"Handicap de Petit Jeu", longGameHcp:"Handicap de Long Jeu",
    derivedHandicapDisclaimer:"Estime a partir de vos vrais putts, 3-putts, et taux d'up-and-down, compare aux donnees publiees Shot Scope / Arccos par niveau de handicap — pas un handicap officiel.",
    handicapHistory:"Historique du Handicap", howCalculated:"Comment c'est calcule", yourLatestNumbers:"Vos derniers chiffres (5 dernieres parties)", roundOverview:"Apercu des Parties",
    hcpCalcExplain:"Le Handicap de Putting moyenne deux chiffres de vos 5 dernieres parties — vos putts par 18 trous et votre taux de 3-putts — chacun compare au tableau de reference ci-dessous. Le Handicap de Petit Jeu vient de votre taux de conversion up-and-down, compare de la meme facon. Le Handicap de Long Jeu combine le %GIR (poids 70%) et le %FIR (poids 30%) — la recherche montre que le GIR est un bien meilleur indicateur du niveau, alors que les fairways touchees separent peu les handicaps. Le tableau est construit a partir de vraies donnees de joueurs Shot Scope et Arccos sur des milliers de parties.",
    hcpLevel:"Handicap", threePuttsShort:"3-Putts", upAndDownShort:"Up&Down", scratch:"Scratch",
    myPlan:"Mon Plan", planSub:"Sessions prevues pour la prochaine fois", planEmpty:"Aucune session planifiee. Preparez une liste d'exercices a faire la prochaine fois.",
    addSession:"Ajouter une session", addToPlan:"Ajouter a votre plan", startNext:"Demarrer", nextInPlan:"Prochaine dans votre plan",
    focusRec:"Recommandation", focus:"A travailler", strong:"Solide", getStarted:"Commencer", getStartedSub:"Entrainez une competence ou enregistrez une partie pour suivre vos progres.",
    startTrainingCta:"Commencer l'entrainement", logRoundCta:"Enregistrer une partie", unlockStatsHint:"Suivez FIR, GIR, putts et direction des erreurs sur chaque trou pour debloquer des statistiques detaillees.",
    sessionsCount:"session", sessionsCount2:"sessions", clearAll:"Tout effacer", noHistory:"Vos sessions apparaitront ici.",
    confirmClear:"Effacer tout l'historique ?", deleteThis:"Supprimer cette entree ?", deleteThisGroup:"Supprimer pour tous les joueurs ?", delete:"Supprimer",
    roundSummary:"Resume de la partie", profile:"Profil", settings:"Parametres", personalInfo:"Informations", yourName:"Votre nom",
    homeClub:"Club", homeClubPh:"ex: Pebble Beach", location:"Lieu", locationPh:"Ville, Pays",
    typicalScore:"Score habituel", dominantHand:"Main dominante", right:"Droite", left:"Gauche", select:"Choisir...",
    mainGoal:"Objectif principal", weaknesses:"Points faibles", saveProfile:"Enregistrer le profil", profileSaved:"Profil enregistre",
    goals:"Objectifs", addGoal:"Ajouter un objectif", setFirstGoal:"Definissez votre premier objectif", goalNoDataYet:"Pas encore de donnees", alreadyActiveGoal:"Deja un objectif actif",
    targetInvalidNumber:"Entrez un nombre valide", targetCannotBeNegative:"Cela ne peut pas etre negatif", targetOver100Pct:"C'est un pourcentage, il ne peut pas depasser 100",
    goalsTagline:"Suivez des cibles reelles et mesurables — mises a jour automatiquement", goalsEmptyDesc:"Choisissez une statistique que vous suivez deja — handicap, %GIR, putts — et fixez un chiffre et une date. On s'occupe du reste.",
    goalsDataScopeNote:"Chaque chiffre ici est calcule uniquement a partir des parties jouees depuis la creation de chaque objectif — pas vos statistiques globales. C'est pourquoi ces chiffres peuvent differer des totaux dans Stats.",
    activeGoals:"En cours", reachedGoals:"Atteints", target:"Cible", ofTheWay:"du chemin parcouru", goalReached:"objectif atteint",
    goalHistory:"Historique des Objectifs", goalOutcomeReached:"Atteint", goalOutcomeExpired:"Temps ecoule — non atteint", goalOutcomeEnded:"Termine tot",
    viewDetails:"Voir Details", sinceGoalSetOn:"Depuis la creation de cet objectif le", startedAt:"Demarre a", needMoreRoundsForTrend:"Enregistrez quelques parties de plus pour voir votre progression ici",
    oneRoundLoggedSoFar:"1 partie enregistree pour l'instant — touchez pour la voir",
    selectMetricToReview:"Choisissez quoi examiner", sampledFromRounds:"echantillonne sur {n} parties", scrollForAllPoints:"← Faites defiler pour voir chaque point →",
    gettingBetter:"En progres", gettingWorse:"En regression", atOrBeyondTarget:"A la Cible ou Au-dela", shortOfTarget:"En Dessous de la Cible",
    trendFlat:"Stable", latestSameAsStart:"Votre derniere partie correspond a votre point de depart", trendImprovedBy:"{n} plus proche de la cible qu'au depart", trendWorsenedBy:"{n} plus loin de la cible qu'au depart",
    onTrack:"Dans les Temps", offTrack:"Hors Delai", ofProgressMade:"du chemin parcouru", currentlyAt:"Actuellement a",
    markAchieved:"Marquer comme Atteint", raiseTheBar:"Viser Plus Haut", raiseTheBarDesc:"Vous avez atteint {target} pour {metric}. Fixez une nouvelle cible plus exigeante et continuez a vous entrainer.",
    roundsSinceGoalSet:"Parties Depuis la Creation de cet Objectif", noRoundsSinceGoalSet:"Aucune partie enregistree depuis la creation de cet objectif",
    dayLeft:"jour restant", daysLeft:"jours restants", deadlinePassed:"echeance depassee",
    newGoal:"Nouvel Objectif", chooseMetric:"Choisissez quoi suivre", currentValue:"Actuel", setTarget:"Definissez votre cible",
    targetLowerPlaceholder:"ex: un chiffre plus bas qu'actuellement", targetHigherPlaceholder:"ex: un chiffre plus haut qu'actuellement",
    setDeadline:"Definissez une echeance", saveGoal:"Enregistrer l'objectif",
    setPeriod:"Definissez une duree", period1m:"1 mois", period3m:"3 mois", period6m:"6 mois", period12m:"12 mois",
    progressOverTime:"Progression dans le Temps", recommendedFromGoal:"Recommande par votre objectif",
    goalMetric_hcp:"Index de Handicap", goalMetric_puttingHcp:"Handicap de Putting", goalMetric_shortGameHcp:"Handicap de Petit Jeu", goalMetric_longGameHcp:"Handicap de Long Jeu",
    goalMetric_girPct:"% Greens en Regulation", goalMetric_firPct:"% Fairways en Regulation", goalMetric_avgPutts18:"Putts par 18 Trous",
    goalMetric_threePutts18:"3-Putts par Partie", goalMetric_updownPct:"% Up & Down", goalMetric_avgScoreVsPar:"Score Moyen vs Par",
    signOut:"Se deconnecter", defaultHoles:"Trous par defaut", settingsAuto:"Sauvegarde automatique",
    streakDay:"jour de suite", streakDays:"jours de suite", feel_focused:"Concentre", feel_relaxed:"Detendu", feel_neutral:"Neutre", feel_tired:"Fatigue", feel_pumped:"Motive", feel_anxious:"Anxieux",
    freq_everyday:"Tous les jours", freq_f45:"4-5x/semaine", freq_f23:"2-3x/semaine", freq_weekly:"Une fois/semaine", freq_monthly:"Mensuel", freq_occasional:"Occasionnel",
    score_under70:"Moins de 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Baisser mon handicap", goal_break90:"Passer sous 90", goal_break80:"Passer sous 80", goal_break70:"Passer sous 70", goal_shortGame:"Ameliorer le petit jeu", goal_management:"Gestion de parcours", goal_enjoy:"Profiter du jeu", goal_compete:"Competition",
    weak_driver:"Driver", weak_irons:"Fers", weak_wedges:"Wedges", weak_putting:"Putting", weak_bunker:"Bunker", weak_mental:"Mental", weak_shortGame2:"Petit jeu", weak_strategy:"Strategie",
    clubDistances:"Distances de clubs", clubDistancesHint:"Indiquez la distance de chaque club. Les exercices necessitant une distance precise suggereront votre vrai club au lieu de deviner.",
    ydsAbbr:"yds", mAbbr:"m",
    club_driver:"Driver", club_w3:"Bois 3", club_w5:"Bois 5", club_i2:"Fer 2", club_i3:"Fer 3", club_i4:"Fer 4", club_i5:"Fer 5", club_i6:"Fer 6", club_i7:"Fer 7", club_i8:"Fer 8", club_i9:"Fer 9", club_pw:"Wedge d'approche", club_gw:"Gap Wedge", club_sw:"Sand Wedge", club_lw:"Lob Wedge",
    yourClubSuggestion:"Votre club pour cette distance", genericClubSuggestion:"Club suggere (estimation generique)", approxSuffix:"(approx.)",
    clubface:"Face du club", ballPosition:"Position de la balle", face_square:"Carree a la cible", face_open:"Ouverte", face_varies:"Varie selon le coup", ball_center:"Centre du stance", ball_forward:"Avancee (pied avant)", ball_back:"En arriere du centre", ball_varies:"Varie selon le club",
    totalResult:"Resultat total", byExercise:"Par exercice", recommendedForYou:"Recommande pour vous", basedOnWeakness:"Base sur votre point faible",
    statReason_gir:"Base sur vos parties — votre GIR est sous l'objectif", statReason_threePutt:"Base sur vos parties — 3-putts au-dessus de l'objectif", statReason_updown:"Base sur vos parties — taux d'up-and-down sous l'objectif",
    rightHandedNote:"Ces instructions de mise en place sont ecrites pour les joueurs droitiers. Si vous jouez gaucher, inversez chaque direction (gauche↔droite, horaire↔antihoraire).",
    programs:"Programmes Predefinis", steps:"etapes", programSteps:"Contenu du programme", startProgram:"Demarrer le programme", programComplete:"Programme termine", saveAndNext:"Enregistrer et suivant", exitProgram:"Quitter le programme", theTechnique:"La Technique", watchVideo:"Regarder",
    prog_draw_name:"Developpement du Draw", prog_draw_desc:"Construisez une trajectoire fiable de droite a gauche. Commence par les fondamentaux d'alignement, passe a la creation intentionnelle de trajectoire, puis la fixe avec un travail de repetabilite.",
    prog_draw_technical:"Un draw courbe de droite a gauche car la face du club est fermee par rapport a un plan de swing interieur-exterieur — mais reste ouverte par rapport a la cible.",
    draw_t1:"Renforcez legerement le grip — tournez les deux mains un peu a droite (2,5-3 jointures visibles sur la main avant)", draw_t2:"Position de balle : centre du stance, ou un ball-width en arriere pour les fers", draw_t3:"Fermez legerement le stance — pied arriere recule de 5 cm, hanches et epaules suivent", draw_t4:"Visez pieds/hanches/epaules legerement a droite de la cible ; face du club visant la vraie cible", draw_t5:"Swinguez puis relachez naturellement a l'impact — n'essayez pas de flipper ou fermer la face manuellement",
    draw_t1_left:"Renforcez legerement le grip — tournez les deux mains un peu a gauche (2,5-3 jointures visibles sur la main avant)", draw_t3_left:"Fermez legerement le stance — pied arriere recule de 5 cm, hanches et epaules suivent (inverse pour gaucher)", draw_t4_left:"Visez pieds/hanches/epaules legerement a gauche de la cible ; face du club visant la vraie cible",
    prog_fade_name:"Developpement du Fade", prog_fade_desc:"Construisez une trajectoire fiable de gauche a droite. Meme competence de mise en forme que le programme draw, memes exercices, intention differente — la plupart des joueurs gagnent a controler les deux sens de courbe.",
    prog_fade_technical:"Un fade courbe de gauche a droite car la face du club est ouverte par rapport a un plan de swing exterieur-interieur — mais reste fermee par rapport a la cible.",
    fade_t1:"Affaiblissez legerement le grip — tournez les deux mains un peu a gauche (environ 1 jointure visible sur la main avant)", fade_t2:"Position de balle : legerement en avant de votre position normale", fade_t3:"Ouvrez legerement le stance — pied avant recule de 5 cm, hanches et epaules suivent", fade_t4:"Visez pieds/hanches/epaules legerement a gauche de la cible ; face du club visant la vraie cible", fade_t5:"Gardez la face ouverte un instant de plus a l'impact — resistez a un relachement complet",
    fade_t1_left:"Affaiblissez legerement le grip — tournez les deux mains un peu a droite (environ 1 jointure visible sur la main avant)", fade_t3_left:"Ouvrez legerement le stance — pied avant recule de 5 cm (inverse pour gaucher)", fade_t4_left:"Visez pieds/hanches/epaules legerement a droite de la cible ; face du club visant la vraie cible",
    prog_slice_name:"Stopper Votre Slice", prog_slice_desc:"Le slice est le defaut de swing le plus courant au golf — la balle part droite ou a gauche puis courbe fortement a droite, perdant distance et precision. Ce programme cible directement les deux vraies causes : une face de club ouverte et un plan de swing exterieur-interieur.",
    prog_slice_technical:"Le slice survient quand la face du club est ouverte par rapport au plan de swing a l'impact — corrigez la face avant le plan, sinon vous transformerez juste le slice en un push-slice plus faible.",
    slice_t1:"Verifiez votre grip — si vous ne voyez que 0-1 jointure sur la main avant, renforcez-le a 2-3", slice_t2:"Carrez votre stance — pieds, hanches, epaules paralleles a la cible, pas visant a gauche", slice_t3:"Reculez legerement la balle par rapport a sa position actuelle, surtout au driver", slice_t4:"Visez la face du club directement sur la cible — resistez a l'envie de viser a gauche", slice_t5:"Gardez le coude arriere proche du corps en descente, puis laissez les avant-bras tourner completement a l'impact",
    slice_t2_left:"Carrez votre stance — pieds, hanches, epaules paralleles a la cible, pas visant a droite", slice_t4_left:"Visez la face du club directement sur la cible — resistez a l'envie de viser a droite",
    prog_hook_name:"Stopper Votre Hook", prog_hook_desc:"Un hook part a droite ou tout droit puis plonge fortement a gauche — souvent plus severe qu'un slice car il termine vite dans les ennuis. Ce programme cible les deux vraies causes : un grip trop fort et un plan de swing trop interieur-exterieur.",
    prog_hook_technical:"Un hook survient quand la face du club est fermee par rapport au plan de swing a l'impact — l'oppose mecanique d'un slice. Generalement plus facile a corriger, mais resistez a la surcorrection vers un slice.",
    hook_t1:"Verifiez votre grip — si vous voyez 4+ jointures sur la main avant, affaiblissez-le legerement a 2-3", hook_t2:"Carrez votre stance — pieds, hanches, epaules paralleles a la cible, pas visant a droite", hook_t3:"Verifiez que la balle n'est pas trop en arriere — ramenez-la vers votre position normale", hook_t4:"Sentez un relachement plus calme — laissez la rotation venir du corps, pas d'un flip de mains agressif",
    hook_t2_left:"Carrez votre stance — pieds, hanches, epaules paralleles a la cible, pas visant a gauche",
    prog_punchLow_name:"Controle des Coups Bas", prog_punchLow_desc:"Pour les jours de vent et les coups de recuperation — punchs, knockdowns et stingers reposent tous sur la meme competence : controler ou le club touche le sol et s'engager dans une trajectoire plus basse.",
    prog_punchLow_technical:"Un punch reduit la trajectoire en deloftant la face a l'adresse — balle en arriere, mains en avant, swing abrege — pas en swinguant plus fort.",
    punchLow_t1:"Prenez un club de plus et descendez de 5 cm sur le grip", punchLow_t2:"Position de balle : 1-2 ball-widths en arriere de votre position normale", punchLow_t3:"Retrecissez votre stance, poids en avant (~60% pied avant) et gardez-le ainsi", punchLow_t4:"Swinguez seulement aux trois-quarts — pas de backswing complet", punchLow_t5:"Gardez les mains devant la tete de club a l'impact, puis arretez la finition bas",
    prog_flopLob_name:"Maitrise du Flop et du Lob", prog_flopLob_desc:"Les coups hauts et doux du petit jeu ne fonctionnent qu'avec un engagement total — les tentatives a moitie effort grattent ou ecrasent. Cette sequence construit la technique, l'adaptabilite aux positions, et l'etat d'esprit sans hesitation, ensemble.",
    prog_flopLob_technical:"Un flop monte grace a une face grand ouverte et un swing engage et accelerant — decelerer cause le rate, pas la technique. Verifiez toujours la position de balle d'abord.",
    flopLob_t1:"Verifiez d'abord la position de balle — confirmez qu'il y a assez de coussin sous la balle pour ce coup", flopLob_t2:"Ouvrez completement la face avant de prendre le grip — placez-la, puis prenez votre grip depuis cette position ouverte", flopLob_t3:"Position de balle : en avant, au niveau du talon avant", flopLob_t4:"Ouvrez votre stance bien a gauche de la cible, poids 60-80% sur le pied avant", flopLob_t5:"Engagez-vous et accelerez a l'impact — un swing hesitant ecrase ou fine le coup",
    flopLob_t4_left:"Ouvrez votre stance bien a droite de la cible, poids 60-80% sur le pied avant",
    prog_bunker_name:"Confiance en Bunker", prog_bunker_desc:"Technique de sable associee a la reinitialisation mentale dont la plupart des joueurs ont vraiment besoin — les bunkers sont l'un des declencheurs de tilt les plus frequents au golf.",
    prog_bunker_technical:"Les coups de bunker se gagnent ou se perdent au point d'entree dans le sable, jamais a la balle — faites confiance au bounce et accelerez, ne decelerez jamais.",
    bunker_t1:"Ouvrez la face avant de prendre votre grip", bunker_t2:"Prenez un stance large et enfoncez legerement les pieds pour la stabilite", bunker_t3:"Position de balle : en avant, au niveau du talon avant — sternum juste derriere la balle", bunker_t4:"Visez environ 5 cm derriere la balle", bunker_t5:"Accelerez tout au long du passage dans le sable — ne decelerez jamais",
    prog_chipping_name:"Fondamentaux du Chipping", prog_chipping_desc:"Un coup bas et roulant joue juste a cote du green — la balle passe la majorite de son trajet a rouler plutot qu'a voler. La methode moderne favorise une balle en avant, un shaft vertical, et laisse le bounce faire le travail.",
    prog_chipping_technical:"Le chipping est le cousin direct du putting — un triangle calme pilote par les epaules avec un minimum d'action independante des poignets, en faisant confiance au bounce du club plutot qu'en creusant.",
    chipping_t1:"Grip normal, descendez un peu pour plus de controle", chipping_t2:"Retrecissez votre stance — pieds proches, environ une largeur de tete de club", chipping_t3:"Position de balle : en avant dans votre stance, shaft garde relativement vertical", chipping_t4:"Bougez bras et epaules comme une seule unite calme — faites confiance au bounce, frappez vers le bas pour faire monter la balle",
    prog_pitching_name:"Controle du Pitching", prog_pitching_desc:"Un coup plus haut et plus doux qu'un chip, typiquement de 20-80 metres, ou la balle parcourt la majorite de la distance dans les airs et atterrit avec un peu d'arret — entre un chip et un swing complet au wedge.",
    prog_pitching_technical:"Le pitching est un swing complet reduit, construit pour le toucher, pas la puissance — controlez la distance avec 2-3 longueurs de swing repetables et engagez-vous a accelerer dans chacune d'elles.",
    pitching_t1:"Retrecissez votre stance par rapport a un swing complet, en reduisant encore plus pour les pitchs courts", pitching_t2:"Poids ~60% sur le pied avant et epaules plus niveles qu'un swing complet", pitching_t3:"Position de balle : centre a legerement en avant, mains legerement devant la balle", pitching_t4:"Choisissez votre longueur de swing, puis accelerez — ne decelerez jamais dans la frappe",
    prog_yips_name:"Surmonter les Yips", prog_yips_desc:"Les yips repondent mieux a la reconstruction de la confiance a tres courte distance, a la respiration pour reduire la tension, et au passage du resultat au processus — pas a plus de bricolage mecanique. Cette sequence est construite exactement sur cette approche.",
    prog_yips_technical:"Les yips combinent une tension physique et une sur-controle mentale, pas un probleme de plan de swing ou de face — chercher une solution mecanique aggrave generalement le probleme. Un veritable changement de style de grip est l'un des resets les plus efficaces.",
    yips_t1:"Avant de vous installer, faites une verification de tension du corps entier — secouez les mains et les bras, prenez une respiration lente", yips_t2:"Envisagez un style de grip different de l'habituel — claw, saw, ou cross-handed — pour briser l'ancien schema de tension", yips_t3:"Adoucissez delibarement votre pression de grip — visez environ 3-4 sur 10", yips_t4:"Choisissez exactement un seul repere pour le coup — 'mains douces,' 'tempo fluide,' ou 'poignet stable' — et rien d'autre", yips_t5:"Installez-vous et laissez le coup se produire — resistez a l'envie de diriger consciemment ou d'aider la balle",
    diff_Beginner:"Debutant", diff_Intermediate:"Intermediaire", diff_Advanced:"Avance",
    left_dir:"Gauche", right_dir:"Droite", short_dir:"Court", long_dir:"Long",
  },
  es: {
    appTagline:"Entrena mejor. Juega con menos golpes.", createAccount:"Crear cuenta", signIn:"Iniciar sesion",
    welcomeBack:"Bienvenido de nuevo", signInSub:"Inicia sesion para seguir entrenando", email:"Correo electronico", password:"Contrasena",
    noAccount:"No tienes cuenta? Crea una", notYou:"No eres tu? Usa otra cuenta", createAcct:"Crear cuenta", step1:"Paso 1 de 2", step2:"Paso 2 de 2",
    finisherGames:"Juegos Finisher", players:"Jugadores", addPlayer:"Anadir jugador", localMultiplayerNote:"Multijugador local: pasa el telefono entre jugadores en cada estacion.", forYourGoals:"Para Tus Objetivos",
    startFinisher:"Empezar", station:"Estacion", scoreForStation:"Puntuacion para esta estacion", prevStation:"Anterior", nextStation:"Siguiente estacion", finishGame:"Terminar",
    handPhoneTo:"Pasa el telefono a", nextPlayer:"Siguiente jugador", byStation:"Por estacion", yourEvolution:"Tu evolucion", runningTotal:"Total acumulado", today:"Hoy", bestPrevious:"Mejor anterior",
    exportImage:"Exportar como imagen", exporting:"Exportando", exported:"Guardado", exportFailed:"No se pudo exportar — prueba una captura de pantalla", copied:"Copiado al portapapeles", shareResult:"Compartir resultado", howWhy:"Como y por que",
    noSessionsYetTap:"Sin sesiones aun — toca para ver", noSessionsYet:"Sin sesiones aun", noSessionsYetDesc:"Entrena esta area para empezar a registrar tu progreso aqui.",
    avgScore:"Puntuacion media", worst:"Mas bajo", evolution:"Evolucion", sinceStart:"desde el inicio", needMoreSessions:"Completa una sesion mas para ver tu tendencia.",
    exercisesPracticed:"Ejercicios practicados", allSessions:"Todas las sesiones", upMeansImproving:"Linea ascendente = mejorando (puntuaciones mas bajas)",
    per18Holes:"por 18 hoyos", successRate:"tasa de exito", downMeansImproving:"Linea descendente = mejorando (menos 3-putts)",
    higherMeansHigherScore:"La linea sube cuando el puntaje sube — no significa mejor ni peor", higherMeansMorePutts:"La linea sube cuando los putts aumentan — mas putts no es bueno",
    higherMeansMoreUpDowns:"La linea sube cuando los up-and-downs aumentan", higherMeansMoreGreens:"La linea sube cuando se alcanzan mas greens", higherMeansMoreFairways:"La linea sube cuando se alcanzan mas calles",
    higherMeansHigherHcp:"La linea sube cuando el handicap aumenta — un handicap mas bajo es la meta",
    viewHistory:"Ver historial", scorecardHistory:"Historial de tarjetas", roundCount:"ronda", roundCount2:"rondas",
    last5:"Ultimas 5", last10:"Ultimas 10", last25:"Ultimas 25", allTime:"Siempre",
    createSub:"Tu entrenamiento personal empieza aqui", fullName:"Nombre completo", choosePass:"Elige una contrasena",
    continue:"Continuar", haveAccount:"Ya tienes cuenta? Inicia sesion", golfProfile:"Perfil de golf",
    golfProfileSub:"Personaliza tu plan de entrenamiento", handicapIndex:"Indice de handicap", handicapHelp:"Usa + para handicap positivo (ej: +2.4)",
    hcpFormatError:"Ingresa un numero valido, como 14.2 o +2.4", hcpRangeError:"El handicap debe estar entre -5.0 y 54.0",
    playFreq:"Con que frecuencia juegas?", selectFreq:"Selecciona frecuencia", measurement:"Unidades",
    yardsFeet:"Yardas / Pies", metres:"Metros", language:"Idioma", startTraining:"Empezar a entrenar",
    fillAll:"Por favor completa todos los campos.", wrongLogin:"Correo o contrasena incorrectos.", emailTaken:"Este correo ya esta registrado.",
    back:"Atras",
    train:"Entrenar", scorecard:"Tarjeta", stats:"Estadisticas", history:"Historial", player:"Jugador",
    chooseFocus:"Elige tu area de enfoque", start:"Empezar", sessions:"sesiones",
    min:"min", chooseExercise:"Elegir ejercicio", drillsAvail:"ejercicios disponibles",
    last:"Ultimo", purpose:"Proposito", yourHistory:"Tu historial", first:"Primero", best:"Mejor",
    outOf:"de", saveResult:"Guardar resultado", excellent:"Excelente!", goodWork:"Buen trabajo", keepGoing:"Sigue asi",
    yourScore:"Tu puntuacion", vsLast:"vs sesion anterior", whyMatters:"Por que importa", newSession:"Nueva sesion",
    trackRound:"Registra tu ronda, hoyo por hoyo", holes:"hoyos", startRound:"Empezar ronda", playHereAgain:"Jugar aqui de nuevo",
    golfCourse:"Campo de golf", coursePh:"ej: Pebble Beach...", feelToday:"Como te sientes hoy?",
    roundType:"Tipo de Ronda", roundTypePractice:"Practica", roundTypeCompetition:"Competicion", allRoundTypes:"Todas", noRoundsMatchFilter:"Ninguna ronda coincide con este filtro",
    savedCourse:"guardado", courseAutoSaveHint:"Elige un campo para autocompletar el par, o escribe uno nuevo — se guardara para la proxima vez.",
    browse:"Explorar", chooseCourse:"Elegir campo", searchCourses:"Buscar campos...", addNewCourse:"Anadir campo",
    courseName:"Nombre del campo", parPerHole:"Par por hoyo", totalPar:"Par total", saveCourseBtn:"Guardar campo", noCoursesFound:"No se encontraron campos",
    resetDemoTitle:"Restablecer datos de demo", resetDemoDesc:"Borra todo en este dispositivo y recarga con los datos de ejemplo de Edouard L (30 sesiones, partidas Finisher contra Alban L y Simon M). Esta accion no se puede deshacer.", resetDemoBtn:"Restablecer datos", resetDemoConfirm:"Si, restablecer",
    fullResetTitle:"Restablecer para un nuevo usuario", fullResetDesc:"Elimina todas las cuentas, rondas, sesiones de entrenamiento y configuraciones guardadas en este dispositivo — y cierra sesion por completo hasta la pantalla de registro, restablecido a ingles y unidades metricas. Usa esto antes de entregar la app a otra persona. Esta accion no se puede deshacer.", fullResetBtn:"Restablecer todo", fullResetConfirm:"Si, borrar todo",
    notesOptional:"Notas (opcional)", notesPh:"Viento en los ultimos hoyos, buenos putts...",
    cancel:"Cancelar", saveRound:"Guardar ronda", hole:"Hoyo", par:"Par", score:"Puntuacion", putts:"Putts", miss:"Fallo",
    girImpossible:"No es posible con este score y putts — GIR significa llegar al green en par menos 2 golpes.",
    girRequired:"Esta puntuacion y estos putts solo cuadran si llegaste al green en par menos 2 golpes — GIR se ha marcado por ti.",
    roundSaved:"Ronda guardada!", roundSavedSub:"Buen trabajo ahi fuera", viewSummary:"Ver resumen", done:"Listo",
    gameGlance:"Tu juego de un vistazo", onCourse:"En el campo", avgPutts:"Putts prom.", perHole:"por hoyo",
    greens:"greens", fairways:"calles", topMiss:"Fallo principal", common:"frecuente",
    threePutts:"3-Putts", holesTotal:"hoyos", upAndDown:"Up & Down", attempts:"intentos",
    scoreVsPar:"Puntuacion vs Par", lastRounds:"Ultimas", rounds:"rondas", trainingProgress:"Progreso de entrenamiento", scoreTrend:"Tendencia de Puntuacion",
    hdcpVsActual:"Handicap vs Real", declaredHdcp:"Tu handicap", actualAvg:"Promedio real (vs par)",
    playingAbove:"Jugando por encima de tu handicap", playingBelow:"Jugando por debajo de tu handicap", playingOnTarget:"En el objetivo",
    playingAboveDesc:"Tus ultimas rondas promedian {n} golpes mas que lo que sugiere tu handicap. Revisa las estadisticas por area para ver donde se escapan los golpes.",
    playingBelowDesc:"Tus ultimas rondas promedian {n} golpes mejor de lo que sugiere tu handicap — buen trabajo, tu indice podria necesitar actualizarse.",
    playingOnTargetDesc:"Tu puntuacion real coincide bien con tu handicap declarado. Buena consistencia.",
    hdcpDisclaimer:"Estimacion simplificada — no considera el rating ni el slope del campo.",
    derivedHandicaps:"Handicaps de Habilidad Estimados", puttingHcp:"Handicap de Putt", shortGameHcp:"Handicap de Juego Corto", longGameHcp:"Handicap de Juego Largo",
    derivedHandicapDisclaimer:"Estimado a partir de tus putts reales, 3-putts, y tasa de up-and-down, comparado con datos publicados de Shot Scope / Arccos por nivel de handicap — no es un handicap oficial.",
    handicapHistory:"Historial de Handicap", howCalculated:"Como se calcula", yourLatestNumbers:"Tus ultimos numeros (ultimas 5 rondas)", roundOverview:"Resumen de Rondas",
    hcpCalcExplain:"El Handicap de Putt promedia dos cifras de tus ultimas 5 rondas — tus putts por 18 hoyos y tu tasa de 3-putts — cada uno comparado con la tabla de referencia abajo. El Handicap de Juego Corto viene de tu tasa de conversion up-and-down, comparada de la misma forma. El Handicap de Juego Largo combina el %GIR (peso 70%) y el %FIR (peso 30%) — la investigacion muestra que el GIR predice mucho mejor el nivel, mientras que las calles acertadas casi no separan los handicaps. La tabla esta construida a partir de datos reales de jugadores Shot Scope y Arccos en miles de rondas.",
    hcpLevel:"Handicap", threePuttsShort:"3-Putts", upAndDownShort:"Up&Down", scratch:"Scratch",
    myPlan:"Mi Plan", planSub:"Sesiones en cola para la proxima vez", planEmpty:"Aun no hay sesiones planificadas. Prepara una lista de ejercicios para la proxima vez.",
    addSession:"Anadir sesion", addToPlan:"Anadir a tu plan", startNext:"Empezar", nextInPlan:"Siguiente en tu plan",
    focusRec:"Recomendacion", focus:"A mejorar", strong:"Fuerte", getStarted:"Empezar", getStartedSub:"Entrena una habilidad o registra una ronda para seguir tu progreso.",
    startTrainingCta:"Empezar a entrenar", logRoundCta:"Registrar una ronda", unlockStatsHint:"Registra FIR, GIR, putts y direccion de fallos en cada hoyo para desbloquear estadisticas detalladas.",
    sessionsCount:"sesion", sessionsCount2:"sesiones", clearAll:"Borrar todo", noHistory:"Tus sesiones apareceran aqui.",
    confirmClear:"Borrar todo el historial?", deleteThis:"Eliminar esta entrada?", deleteThisGroup:"Eliminar para todos los jugadores?", delete:"Eliminar",
    roundSummary:"Resumen de la ronda", profile:"Perfil", settings:"Ajustes", personalInfo:"Informacion personal", yourName:"Tu nombre",
    homeClub:"Club", homeClubPh:"ej: Pebble Beach", location:"Ubicacion", locationPh:"Ciudad, Pais",
    typicalScore:"Puntuacion habitual", dominantHand:"Mano dominante", right:"Derecha", left:"Izquierda", select:"Seleccionar...",
    mainGoal:"Objetivo principal", weaknesses:"Debilidades", saveProfile:"Guardar perfil", profileSaved:"Perfil guardado",
    goals:"Objetivos", addGoal:"Anadir objetivo", setFirstGoal:"Define tu primer objetivo", goalNoDataYet:"Sin datos aun", alreadyActiveGoal:"Ya es un objetivo activo",
    targetInvalidNumber:"Ingresa un numero valido", targetCannotBeNegative:"Esto no puede ser negativo", targetOver100Pct:"Esto es un porcentaje, no puede superar 100",
    goalsTagline:"Sigue metas reales y medibles — actualizadas automaticamente", goalsEmptyDesc:"Elige una estadistica que ya sigues — handicap, %GIR, putts — y fija un numero y una fecha. Nosotros hacemos el resto.",
    goalsDataScopeNote:"Cada numero aqui se calcula solo con las rondas jugadas desde que se creo cada objetivo — no tus estadisticas de todos los tiempos. Por eso pueden diferir de los totales en Estadisticas.",
    activeGoals:"En progreso", reachedGoals:"Alcanzados", target:"Meta", ofTheWay:"del camino recorrido", goalReached:"objetivo alcanzado",
    goalHistory:"Historial de Objetivos", goalOutcomeReached:"Alcanzado", goalOutcomeExpired:"Tiempo agotado — no alcanzado", goalOutcomeEnded:"Terminado antes",
    viewDetails:"Ver Detalles", sinceGoalSetOn:"Desde que se creo este objetivo el", startedAt:"Empezo en", needMoreRoundsForTrend:"Registra algunas rondas mas para ver tu progreso aqui",
    oneRoundLoggedSoFar:"1 ronda registrada hasta ahora — toca para verla",
    selectMetricToReview:"Elige que revisar", sampledFromRounds:"muestreado de {n} rondas", scrollForAllPoints:"← Desliza para ver cada punto →",
    gettingBetter:"Mejorando", gettingWorse:"Empeorando", atOrBeyondTarget:"En la Meta o Mas Alla", shortOfTarget:"Por Debajo de la Meta",
    trendFlat:"Estable", latestSameAsStart:"Tu ultima ronda coincide con donde empezaste", trendImprovedBy:"{n} mas cerca de la meta que al empezar", trendWorsenedBy:"{n} mas lejos de la meta que al empezar",
    onTrack:"En Buen Camino", offTrack:"Fuera de Plazo", ofProgressMade:"del camino recorrido", currentlyAt:"Actualmente en",
    markAchieved:"Marcar como Logrado", raiseTheBar:"Subir el Nivel", raiseTheBarDesc:"Alcanzaste {target} para {metric}. Define una nueva meta mas exigente y sigue entrenando.",
    roundsSinceGoalSet:"Rondas Desde que se Creo este Objetivo", noRoundsSinceGoalSet:"Aun no hay rondas registradas desde que se creo este objetivo",
    dayLeft:"dia restante", daysLeft:"dias restantes", deadlinePassed:"plazo vencido",
    newGoal:"Nuevo Objetivo", chooseMetric:"Elige que seguir", currentValue:"Actual", setTarget:"Define tu meta",
    targetLowerPlaceholder:"ej: un numero mas bajo que el actual", targetHigherPlaceholder:"ej: un numero mas alto que el actual",
    setDeadline:"Define un plazo", saveGoal:"Guardar objetivo",
    setPeriod:"Define un periodo", period1m:"1 mes", period3m:"3 meses", period6m:"6 meses", period12m:"12 meses",
    progressOverTime:"Progreso en el Tiempo", recommendedFromGoal:"Recomendado por tu objetivo",
    goalMetric_hcp:"Indice de Handicap", goalMetric_puttingHcp:"Handicap de Putt", goalMetric_shortGameHcp:"Handicap de Juego Corto", goalMetric_longGameHcp:"Handicap de Juego Largo",
    goalMetric_girPct:"% Greens en Regulacion", goalMetric_firPct:"% Calles en Regulacion", goalMetric_avgPutts18:"Putts por 18 Hoyos",
    goalMetric_threePutts18:"3-Putts por Ronda", goalMetric_updownPct:"% Up & Down", goalMetric_avgScoreVsPar:"Puntuacion Media vs Par",
    signOut:"Cerrar sesion", defaultHoles:"Hoyos por defecto", settingsAuto:"Los ajustes se guardan automaticamente",
    streakDay:"dia consecutivo", streakDays:"dias consecutivos", feel_focused:"Concentrado", feel_relaxed:"Relajado", feel_neutral:"Neutral", feel_tired:"Cansado", feel_pumped:"Motivado", feel_anxious:"Ansioso",
    freq_everyday:"Todos los dias", freq_f45:"4-5x/semana", freq_f23:"2-3x/semana", freq_weekly:"Una vez/semana", freq_monthly:"Mensual", freq_occasional:"Ocasional",
    score_under70:"Menos de 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Bajar mi handicap", goal_break90:"Romper 90", goal_break80:"Romper 80", goal_break70:"Romper 70", goal_shortGame:"Mejorar juego corto", goal_management:"Gestion de campo", goal_enjoy:"Disfrutar el juego", goal_compete:"Competir",
    weak_driver:"Driver", weak_irons:"Hierros", weak_wedges:"Wedges", weak_putting:"Putt", weak_bunker:"Bunker", weak_mental:"Mental", weak_shortGame2:"Juego corto", weak_strategy:"Estrategia",
    clubDistances:"Distancias de palos", clubDistancesHint:"Indica cuanto recorre cada palo. Los ejercicios que necesitan una distancia especifica sugeriran tu palo real en lugar de adivinar.",
    ydsAbbr:"yds", mAbbr:"m",
    club_driver:"Driver", club_w3:"Madera 3", club_w5:"Madera 5", club_i2:"Hierro 2", club_i3:"Hierro 3", club_i4:"Hierro 4", club_i5:"Hierro 5", club_i6:"Hierro 6", club_i7:"Hierro 7", club_i8:"Hierro 8", club_i9:"Hierro 9", club_pw:"Wedge de approach", club_gw:"Gap Wedge", club_sw:"Sand Wedge", club_lw:"Lob Wedge",
    yourClubSuggestion:"Tu palo para esta distancia", genericClubSuggestion:"Palo sugerido (estimacion generica)", approxSuffix:"(aprox.)",
    clubface:"Cara del palo", ballPosition:"Posicion de la bola", face_square:"Cuadrada al objetivo", face_open:"Abierta", face_varies:"Varia segun el golpe", ball_center:"Centro de la postura", ball_forward:"Adelantada (pie delantero)", ball_back:"Atras del centro", ball_varies:"Varia segun el palo",
    totalResult:"Resultado total", byExercise:"Por ejercicio", recommendedForYou:"Recomendado para ti", basedOnWeakness:"Basado en tu debilidad",
    statReason_gir:"Basado en tus rondas — tu GIR esta por debajo del objetivo", statReason_threePutt:"Basado en tus rondas — 3-putts por encima del objetivo", statReason_updown:"Basado en tus rondas — tasa de up-and-down por debajo del objetivo",
    rightHandedNote:"Estas instrucciones de configuracion estan escritas para jugadores diestros. Si juegas como zurdo, invierte cada direccion (izquierda↔derecha, horario↔antihorario).",
    programs:"Programas Predefinidos", steps:"pasos", programSteps:"Que incluye este programa", startProgram:"Iniciar programa", programComplete:"Programa completado", saveAndNext:"Guardar y siguiente", exitProgram:"Salir del programa", theTechnique:"La Tecnica", watchVideo:"Ver",
    prog_draw_name:"Desarrollo del Draw", prog_draw_desc:"Construye una trayectoria fiable de derecha a izquierda. Empieza con fundamentos de alineacion, avanza a la creacion intencional de trayectoria, y la fija con trabajo de repetibilidad.",
    prog_draw_technical:"Un draw curva de derecha a izquierda porque la cara del palo esta cerrada respecto a un plano de swing de adentro hacia afuera — pero sigue abierta respecto al objetivo.",
    draw_t1:"Refuerza un poco el agarre — gira ambas manos un poco a la derecha (2,5-3 nudillos visibles en la mano guia)", draw_t2:"Posicion de bola: centro de la postura, o un ancho de bola atras para los hierros", draw_t3:"Cierra ligeramente tu postura — pie trasero atras 5 cm, caderas y hombros siguen", draw_t4:"Apunta pies/caderas/hombros ligeramente a la derecha del objetivo; cara del palo apuntando al objetivo real", draw_t5:"Haz el swing y luego suelta naturalmente en el impacto — no intentes voltear o cerrar la cara manualmente",
    draw_t1_left:"Refuerza un poco el agarre — gira ambas manos un poco a la izquierda (2,5-3 nudillos visibles en la mano guia)", draw_t3_left:"Cierra ligeramente tu postura — pie trasero atras 5 cm, caderas y hombros siguen (invertido para zurdos)", draw_t4_left:"Apunta pies/caderas/hombros ligeramente a la izquierda del objetivo; cara del palo apuntando al objetivo real",
    prog_fade_name:"Desarrollo del Fade", prog_fade_desc:"Construye una trayectoria fiable de izquierda a derecha. Misma habilidad de modelado que el programa draw, mismos ejercicios, intencion diferente — la mayoria de los jugadores se benefician de controlar ambas direcciones de curva.",
    prog_fade_technical:"Un fade curva de izquierda a derecha porque la cara del palo esta abierta respecto a un plano de swing de afuera hacia adentro — pero sigue cerrada respecto al objetivo.",
    fade_t1:"Debilita un poco el agarre — gira ambas manos un poco a la izquierda (aproximadamente 1 nudillo visible en la mano guia)", fade_t2:"Posicion de bola: ligeramente adelante de tu posicion normal", fade_t3:"Abre ligeramente tu postura — pie delantero atras 5 cm, caderas y hombros siguen", fade_t4:"Apunta pies/caderas/hombros ligeramente a la izquierda del objetivo; cara del palo apuntando al objetivo real", fade_t5:"Mantén la cara abierta una fraccion mas en el impacto — resiste una liberacion completa",
    fade_t1_left:"Debilita un poco el agarre — gira ambas manos un poco a la derecha (aproximadamente 1 nudillo visible en la mano guia)", fade_t3_left:"Abre ligeramente tu postura — pie delantero atras 5 cm (invertido para zurdos)", fade_t4_left:"Apunta pies/caderas/hombros ligeramente a la derecha del objetivo; cara del palo apuntando al objetivo real",
    prog_slice_name:"Detener tu Slice", prog_slice_desc:"El slice es el defecto de swing mas comun en el golf — la bola sale recta o a la izquierda y curva fuerte a la derecha, perdiendo distancia y precision. Este programa ataca directamente las dos causas reales: una cara de palo abierta y un plano de swing de afuera hacia adentro.",
    prog_slice_technical:"El slice ocurre cuando la cara del palo esta abierta respecto al plano de swing en el impacto — corrige la cara antes del plano, o solo convertiras el slice en un push-slice mas debil.",
    slice_t1:"Verifica tu agarre — si solo ves 0-1 nudillos en la mano guia, refuerzalo a 2-3", slice_t2:"Cuadra tu postura — pies, caderas, hombros paralelos al objetivo, no apuntando a la izquierda", slice_t3:"Mueve la bola ligeramente atras de donde esta ahora, especialmente con el driver", slice_t4:"Apunta la cara del palo directamente al objetivo — resiste el instinto de apuntar a la izquierda", slice_t5:"Mantén el codo trasero cerca del cuerpo en la bajada, luego deja que los antebrazos giren completamente en el impacto",
    slice_t2_left:"Cuadra tu postura — pies, caderas, hombros paralelos al objetivo, no apuntando a la derecha", slice_t4_left:"Apunta la cara del palo directamente al objetivo — resiste el instinto de apuntar a la derecha",
    prog_hook_name:"Detener tu Hook", prog_hook_desc:"Un hook sale recto o a la derecha y se hunde fuerte a la izquierda — a menudo mas severo que un slice porque termina rapido en problemas. Este programa ataca las dos causas reales: un agarre demasiado fuerte y un plano de swing demasiado de adentro hacia afuera.",
    prog_hook_technical:"Un hook ocurre cuando la cara del palo esta cerrada respecto al plano de swing en el impacto — el opuesto mecanico de un slice. Generalmente mas facil de corregir, pero resiste sobrecorregir hacia un slice.",
    hook_t1:"Verifica tu agarre — si ves 4+ nudillos en la mano guia, debilitalo ligeramente a 2-3", hook_t2:"Cuadra tu postura — pies, caderas, hombros paralelos al objetivo, no apuntando a la derecha", hook_t3:"Verifica que la bola no este demasiado atras — muevela hacia tu posicion normal", hook_t4:"Siente una liberacion mas tranquila — deja que la rotacion venga del giro del cuerpo, no de un movimiento agresivo de manos",
    hook_t2_left:"Cuadra tu postura — pies, caderas, hombros paralelos al objetivo, no apuntando a la izquierda",
    prog_punchLow_name:"Control de Golpes Bajos", prog_punchLow_desc:"Para dias de viento y golpes de problemas — punches, knockdowns y stingers dependen todos de la misma habilidad: controlar donde el palo toca el suelo y comprometerse con una trayectoria mas baja.",
    prog_punchLow_technical:"Un punch reduce la trayectoria deslofteando la cara en la direccion — bola atras, manos adelante, swing abreviado — no golpeando mas fuerte.",
    punchLow_t1:"Toma un palo mas y baja 5 cm en el agarre", punchLow_t2:"Posicion de bola: 1-2 anchos de bola atras de tu posicion normal", punchLow_t3:"Estrecha tu postura, peso adelante (~60% pie delantero) y mantenlo asi", punchLow_t4:"Haz el swing solo a tres cuartos — sin backswing completo", punchLow_t5:"Mantén las manos delante de la cabeza del palo en el impacto, luego detén el seguimiento bajo",
    prog_flopLob_name:"Dominio del Flop y Lob", prog_flopLob_desc:"Los golpes altos y suaves del juego corto solo funcionan con compromiso total — los intentos a medio esfuerzo se atascan o rascan. Esta secuencia construye la tecnica, la adaptabilidad a posiciones, y la mentalidad sin vacilacion, todo junto.",
    prog_flopLob_technical:"Un flop sube gracias a una cara muy abierta y un swing comprometido y acelerando — desacelerar causa el fallo, no la tecnica. Verifica siempre la posicion de bola primero.",
    flopLob_t1:"Verifica primero la posicion de bola — confirma que hay suficiente colchon bajo la bola para este golpe", flopLob_t2:"Abre completamente la cara antes de agarrar — colocala, luego toma tu agarre desde esa posicion abierta", flopLob_t3:"Posicion de bola: adelante, a la altura del talon delantero", flopLob_t4:"Abre tu postura bien a la izquierda del objetivo, peso 60-80% en el pie delantero", flopLob_t5:"Comprometete y acelera en el impacto — un swing tentativo atasca o raspa el golpe",
    flopLob_t4_left:"Abre tu postura bien a la derecha del objetivo, peso 60-80% en el pie delantero",
    prog_bunker_name:"Confianza en Bunker", prog_bunker_desc:"Tecnica de arena combinada con el reinicio mental que la mayoria de los jugadores realmente necesita — los bunkers son uno de los disparadores de frustracion mas comunes en el golf.",
    prog_bunker_technical:"Los golpes de bunker se ganan o pierden en el punto de entrada en la arena, nunca en la bola misma — confia en el bounce y acelera, nunca desaceleres.",
    bunker_t1:"Abre la cara antes de tomar tu agarre", bunker_t2:"Toma una postura amplia y entierra ligeramente los pies para estabilidad", bunker_t3:"Posicion de bola: adelante, a la altura del talon delantero — esternon justo detras de la bola", bunker_t4:"Apunta a entrar en la arena unos 5 cm detras de la bola", bunker_t5:"Acelera durante todo el paso por la arena — nunca desaceleres",
    prog_chipping_name:"Fundamentos del Chipping", prog_chipping_desc:"Un golpe bajo y rodante jugado justo fuera del green — la bola pasa la mayoria de su recorrido rodando en lugar de volando. El metodo moderno favorece una bola adelante, un eje vertical, y deja que el bounce haga el trabajo.",
    prog_chipping_technical:"El chipping es el primo directo del putting — un triangulo tranquilo impulsado por los hombros con minima accion independiente de las munecas, confiando en el bounce del palo en lugar de excavar.",
    chipping_t1:"Agarre normal, baja un poco para mas control", chipping_t2:"Estrecha tu postura — pies juntos, aproximadamente un ancho de cabeza de palo", chipping_t3:"Posicion de bola: adelante en tu postura, eje mantenido relativamente vertical", chipping_t4:"Mueve brazos y hombros como una sola unidad tranquila — confia en el bounce, golpea hacia abajo para que suba",
    prog_pitching_name:"Control del Pitching", prog_pitching_desc:"Un golpe mas alto y suave que un chip, tipicamente de 20-80 metros, donde la bola recorre la mayoria de la distancia en el aire y aterriza con algo de frenado — entre un chip y un swing completo de wedge.",
    prog_pitching_technical:"El pitching es un swing completo reducido, construido para el toque, no la potencia — controla la distancia con 2-3 longitudes de swing repetibles y comprometete a acelerar en cada una.",
    pitching_t1:"Estrecha tu postura respecto a un swing completo, reduciendo mas para pitches cortos", pitching_t2:"Peso ~60% en el pie delantero y hombros mas nivelados que un swing completo", pitching_t3:"Posicion de bola: centro a ligeramente adelante, manos ligeramente delante de la bola", pitching_t4:"Elige tu longitud de swing, luego acelera — nunca desaceleres en el golpe",
    prog_yips_name:"Superando los Yips", prog_yips_desc:"Los yips responden mejor reconstruyendo la confianza a muy corta distancia, respirando para reducir la tension, y cambiando el enfoque del resultado al proceso — no con mas ajustes mecanicos. Esta secuencia esta construida exactamente sobre ese enfoque.",
    prog_yips_technical:"Los yips combinan tension fisica y sobre-control mental, no un problema de plano de swing o cara — buscar un arreglo mecanico suele empeorarlo. Un cambio genuino de estilo de agarre es uno de los reinicios mas efectivos.",
    yips_t1:"Antes de colocarte, haz una verificacion de tension de todo el cuerpo — sacude las manos y los brazos, toma una respiracion lenta", yips_t2:"Considera un estilo de agarre diferente al habitual — claw, saw, o cross-handed — para romper el viejo patron de tension", yips_t3:"Suaviza deliberadamente tu presion de agarre — apunta a aproximadamente 3-4 sobre 10", yips_t4:"Elige exactamente una sola senal para el golpe — 'manos suaves,' 'tempo fluido,' o 'muneca estable' — y nada mas", yips_t5:"Colocate y deja que el golpe ocurra — resiste el impulso de dirigir conscientemente o ayudar a la bola",
    diff_Beginner:"Principiante", diff_Intermediate:"Intermedio", diff_Advanced:"Avanzado",
    left_dir:"Izquierda", right_dir:"Derecha", short_dir:"Corto", long_dir:"Largo",
  },
  de: {
    appTagline:"Trainiere klueger. Spiele besser.", createAccount:"Konto erstellen", signIn:"Anmelden",
    welcomeBack:"Willkommen zurueck", signInSub:"Melde dich an, um weiterzutrainieren", email:"E-Mail", password:"Passwort",
    noAccount:"Kein Konto? Jetzt erstellen", notYou:"Nicht du? Anderes Konto verwenden", createAcct:"Konto erstellen", step1:"Schritt 1 von 2", step2:"Schritt 2 von 2",
    finisherGames:"Finisher-Spiele", players:"Spieler", addPlayer:"Spieler hinzufuegen", localMultiplayerNote:"Lokaler Mehrspielermodus: Gib das Telefon zwischen den Spielern bei jeder Station weiter.", forYourGoals:"Fuer Deine Ziele",
    startFinisher:"Starten", station:"Station", scoreForStation:"Ergebnis fuer diese Station", prevStation:"Zurueck", nextStation:"Naechste Station", finishGame:"Spiel beenden",
    handPhoneTo:"Gib das Telefon weiter an", nextPlayer:"Naechster Spieler", byStation:"Nach Station", yourEvolution:"Deine Entwicklung", runningTotal:"Laufende Summe", today:"Heute", bestPrevious:"Beste vorherige",
    exportImage:"Als Bild exportieren", exporting:"Wird exportiert", exported:"Gespeichert", exportFailed:"Export fehlgeschlagen — versuche einen Screenshot", copied:"In die Zwischenablage kopiert", shareResult:"Ergebnis teilen", howWhy:"Wie & Warum",
    noSessionsYetTap:"Noch keine Einheiten — tippen zum Ansehen", noSessionsYet:"Noch keine Einheiten", noSessionsYetDesc:"Trainiere diesen Bereich, um hier deinen Fortschritt aufzubauen.",
    avgScore:"Durchschnitt", worst:"Niedrigster", evolution:"Entwicklung", sinceStart:"seit Beginn", needMoreSessions:"Schliesse eine weitere Einheit ab, um deinen Trend zu sehen.",
    exercisesPracticed:"Geuebte Uebungen", allSessions:"Alle Einheiten", upMeansImproving:"Aufwaertstrend = Verbesserung (niedrigere Ergebnisse)",
    per18Holes:"pro 18 Loecher", successRate:"Erfolgsquote", downMeansImproving:"Abwaertstrend = Verbesserung (weniger 3-Putts)",
    higherMeansHigherScore:"Linie steigt, wenn das Ergebnis steigt — bedeutet nicht besser oder schlechter", higherMeansMorePutts:"Linie steigt, wenn Putts zunehmen — mehr Putts ist nicht gut",
    higherMeansMoreUpDowns:"Linie steigt, wenn Up-and-Downs zunehmen", higherMeansMoreGreens:"Linie steigt, wenn mehr Gruens getroffen werden", higherMeansMoreFairways:"Linie steigt, wenn mehr Fairways getroffen werden",
    higherMeansHigherHcp:"Linie steigt, wenn das Handicap steigt — ein niedrigeres Handicap ist das Ziel",
    viewHistory:"Verlauf ansehen", scorecardHistory:"Scorecard-Verlauf", roundCount:"Runde", roundCount2:"Runden",
    last5:"Letzte 5", last10:"Letzte 10", last25:"Letzte 25", allTime:"Gesamt",
    createSub:"Dein personliches Training beginnt hier", fullName:"Vollstandiger Name", choosePass:"Passwort wahlen",
    continue:"Weiter", haveAccount:"Schon ein Konto? Anmelden", golfProfile:"Golfprofil",
    golfProfileSub:"Personalisiert deinen Trainingsplan", handicapIndex:"Handicap-Index", handicapHelp:"Nutze + fuer ein Plus-Handicap (z.B. +2.4)",
    hcpFormatError:"Gib eine gueltige Zahl ein, wie 14.2 oder +2.4", hcpRangeError:"Das Handicap muss zwischen -5.0 und 54.0 liegen",
    playFreq:"Wie oft spielst du?", selectFreq:"Haufigkeit auswahlen", measurement:"Masseinheit",
    yardsFeet:"Yards / Fuss", metres:"Meter", language:"Sprache", startTraining:"Training starten",
    fillAll:"Bitte fuelle alle Felder aus.", wrongLogin:"Falsche E-Mail oder Passwort.", emailTaken:"Diese E-Mail ist bereits registriert.",
    back:"Zurueck",
    train:"Training", scorecard:"Scorekarte", stats:"Statistik", history:"Verlauf", player:"Spieler",
    chooseFocus:"Wahle deinen Fokusbereich", start:"Start", sessions:"Einheiten",
    min:"Min", chooseExercise:"Uebung wahlen", drillsAvail:"Uebungen verfuegbar",
    last:"Letzte", purpose:"Zweck", yourHistory:"Dein Verlauf", first:"Erste", best:"Beste",
    outOf:"von", saveResult:"Ergebnis speichern", excellent:"Ausgezeichnet!", goodWork:"Gute Arbeit", keepGoing:"Weiter so",
    yourScore:"Dein Ergebnis", vsLast:"vs letzte Einheit", whyMatters:"Warum das wichtig ist", newSession:"Neue Einheit",
    trackRound:"Verfolge deine Runde, Loch fuer Loch", holes:"Locher", startRound:"Runde starten", playHereAgain:"Hier wieder spielen",
    golfCourse:"Golfplatz", coursePh:"z.B. Pebble Beach...", feelToday:"Wie fuhlst du dich heute?",
    roundType:"Rundenart", roundTypePractice:"Training", roundTypeCompetition:"Wettkampf", allRoundTypes:"Alle", noRoundsMatchFilter:"Keine Runden entsprechen diesem Filter",
    savedCourse:"gespeichert", courseAutoSaveHint:"Waehle einen Platz, um Par automatisch zu fuellen, oder tippe einen neuen ein — er wird fuer naechstes Mal gespeichert.",
    browse:"Durchsuchen", chooseCourse:"Platz waehlen", searchCourses:"Plaetze suchen...", addNewCourse:"Neuen Platz hinzufuegen",
    courseName:"Platzname", parPerHole:"Par pro Loch", totalPar:"Gesamt-Par", saveCourseBtn:"Platz speichern", noCoursesFound:"Keine Plaetze gefunden",
    resetDemoTitle:"Demo-Daten zuruecksetzen", resetDemoDesc:"Loescht alles auf diesem Geraet und ladt neu mit den Beispieldaten von Edouard L (30 Einheiten, Finisher-Spiele gegen Alban L und Simon M). Dies kann nicht rueckgaengig gemacht werden.", resetDemoBtn:"Demo-Daten zuruecksetzen", resetDemoConfirm:"Ja, zuruecksetzen",
    fullResetTitle:"Fuer einen neuen Nutzer zuruecksetzen", fullResetDesc:"Loescht alle Konten, Runden, Trainingseinheiten und Einstellungen auf diesem Geraet — und meldet vollstaendig ab, zurueck zum Anmeldebildschirm, zurueckgesetzt auf Englisch und metrische Einheiten. Vor der Weitergabe der App an jemand anderen verwenden. Dies kann nicht rueckgaengig gemacht werden.", fullResetBtn:"Alles zuruecksetzen", fullResetConfirm:"Ja, alles loeschen",
    notesOptional:"Notizen (optional)", notesPh:"Windig auf den letzten Lochern, gute Putts...",
    cancel:"Abbrechen", saveRound:"Runde speichern", hole:"Loch", par:"Par", score:"Ergebnis", putts:"Putts", miss:"Fehler",
    girImpossible:"Mit diesem Ergebnis und diesen Putts nicht moeglich — GIR bedeutet, das Gruen in Par minus 2 Schlaegen zu erreichen.",
    girRequired:"Dieses Ergebnis und diese Putts passen nur zusammen, wenn du das Gruen in Par minus 2 Schlaegen erreicht hast — GIR wurde fuer dich markiert.",
    roundSaved:"Runde gespeichert!", roundSavedSub:"Gut gespielt", viewSummary:"Zusammenfassung ansehen", done:"Fertig",
    gameGlance:"Dein Spiel auf einen Blick", onCourse:"Auf dem Platz", avgPutts:"Putts Schnitt", perHole:"pro Loch",
    greens:"Greens", fairways:"Fairways", topMiss:"Haufigster Fehler", common:"haufig",
    threePutts:"3-Putts", holesTotal:"Loecher", upAndDown:"Up & Down", attempts:"Versuche",
    scoreVsPar:"Ergebnis vs Par", lastRounds:"Letzte", rounds:"Runden", trainingProgress:"Trainingsfortschritt", scoreTrend:"Ergebnis-Trend",
    hdcpVsActual:"Handicap vs Tatsaechlich", declaredHdcp:"Dein Handicap", actualAvg:"Tatsaechlicher Schnitt (vs Par)",
    playingAbove:"Du spielst ueber deinem Handicap", playingBelow:"Du spielst unter deinem Handicap", playingOnTarget:"Genau im Soll",
    playingAboveDesc:"Deine letzten Runden liegen im Schnitt {n} Schlaege hoeher als dein Handicap vermuten laesst. Schau in die Statistik nach Bereich, um zu sehen wo die Schlaege verloren gehen.",
    playingBelowDesc:"Deine letzten Runden liegen im Schnitt {n} Schlaege besser als dein Handicap vermuten laesst — gute Arbeit, dein Index ist vielleicht reif fuer ein Update.",
    playingOnTargetDesc:"Dein tatsaechliches Ergebnis passt gut zu deinem angegebenen Handicap. Solide Konstanz.",
    hdcpDisclaimer:"Vereinfachte Schaetzung — beruecksichtigt nicht Course Rating oder Slope.",
    derivedHandicaps:"Geschaetzte Skill-Handicaps", puttingHcp:"Putting-Handicap", shortGameHcp:"Kurzspiel-Handicap", longGameHcp:"Langspiel-Handicap",
    derivedHandicapDisclaimer:"Geschaetzt aus deinen echten Putts, 3-Putts, und Up-and-Down-Rate, verglichen mit veroeffentlichten Shot Scope / Arccos Handicap-Stufen-Daten — kein offizielles Handicap.",
    handicapHistory:"Handicap-Verlauf", howCalculated:"So wird es berechnet", yourLatestNumbers:"Deine neuesten Zahlen (letzte 5 Runden)", roundOverview:"Rundenuebersicht",
    hcpCalcExplain:"Das Putting-Handicap mittelt zwei Werte aus deinen letzten 5 Runden — deine Putts pro 18 Loecher und deine 3-Putt-Rate — jeweils mit der Vergleichstabelle unten abgeglichen. Das Kurzspiel-Handicap kommt aus deiner Up-and-Down-Erfolgsrate, genauso abgeglichen. Das Langspiel-Handicap kombiniert GIR% (70% Gewichtung) und FIR% (30% Gewichtung) — Studien zeigen, dass GIR das Niveau viel staerker vorhersagt, waehrend getroffene Fairways Handicaps kaum unterscheiden. Die Tabelle basiert auf echten Shot Scope und Arccos Spielerdaten aus Tausenden von Runden.",
    hcpLevel:"Handicap", threePuttsShort:"3-Putts", upAndDownShort:"Up&Down", scratch:"Scratch",
    myPlan:"Mein Plan", planSub:"Geplante Einheiten fuer naechstes Mal", planEmpty:"Noch keine Einheiten geplant. Stelle eine Liste von Uebungen fuer naechstes Mal zusammen.",
    addSession:"Einheit hinzufuegen", addToPlan:"Zu deinem Plan hinzufuegen", startNext:"Starten", nextInPlan:"Naechstes in deinem Plan",
    focusRec:"Fokus-Empfehlung", focus:"Fokus", strong:"Stark", getStarted:"Los geht's", getStartedSub:"Trainiere eine Fahigkeit oder erfasse eine Runde, um deinen Fortschritt zu verfolgen.",
    startTrainingCta:"Training starten", logRoundCta:"Runde erfassen", unlockStatsHint:"Erfasse FIR, GIR, Putts und Fehlerrichtung fuer jedes Loch, um detaillierte Statistiken freizuschalten.",
    sessionsCount:"Einheit", sessionsCount2:"Einheiten", clearAll:"Alles loschen", noHistory:"Deine Einheiten erscheinen hier.",
    confirmClear:"Gesamten Verlauf loschen?", deleteThis:"Diesen Eintrag loschen?", deleteThisGroup:"Fuer alle Spieler loschen?", delete:"Loschen",
    roundSummary:"Rundenzusammenfassung", profile:"Profil", settings:"Einstellungen", personalInfo:"Personliche Daten", yourName:"Dein Name",
    homeClub:"Heimatclub", homeClubPh:"z.B. Pebble Beach", location:"Standort", locationPh:"Stadt, Land",
    typicalScore:"Typisches Ergebnis", dominantHand:"Dominante Hand", right:"Rechts", left:"Links", select:"Auswahlen...",
    mainGoal:"Hauptziel", weaknesses:"Schwachen", saveProfile:"Profil speichern", profileSaved:"Profil gespeichert",
    goals:"Ziele", addGoal:"Ziel hinzufuegen", setFirstGoal:"Setze dein erstes Ziel", goalNoDataYet:"Noch keine Daten", alreadyActiveGoal:"Bereits ein aktives Ziel",
    targetInvalidNumber:"Gib eine gueltige Zahl ein", targetCannotBeNegative:"Das kann nicht negativ sein", targetOver100Pct:"Das ist ein Prozentsatz, er kann nicht ueber 100 liegen",
    goalsTagline:"Verfolge echte, messbare Ziele — automatisch aktualisiert", goalsEmptyDesc:"Waehle eine Statistik, die du schon verfolgst — Handicap, GIR%, Putts — und setze eine Zahl und ein Datum. Den Rest erledigen wir.",
    goalsDataScopeNote:"Jede Zahl hier wird nur aus Runden berechnet, die seit der Erstellung des jeweiligen Ziels gespielt wurden — nicht aus deinen Gesamtstatistiken. Deshalb koennen sich diese Werte von den Summen in Statistik unterscheiden.",
    activeGoals:"In Arbeit", reachedGoals:"Erreicht", target:"Ziel", ofTheWay:"des Weges geschafft", goalReached:"Ziel erreicht",
    goalHistory:"Zielverlauf", goalOutcomeReached:"Erreicht", goalOutcomeExpired:"Zeit abgelaufen — nicht erreicht", goalOutcomeEnded:"Vorzeitig beendet",
    viewDetails:"Details Ansehen", sinceGoalSetOn:"Seit dieses Ziel gesetzt wurde am", startedAt:"Gestartet bei", needMoreRoundsForTrend:"Erfasse noch ein paar Runden, um deinen Trend hier zu sehen",
    oneRoundLoggedSoFar:"1 Runde bisher erfasst — tippen, um sie anzusehen",
    selectMetricToReview:"Waehle, was du pruefen willst", sampledFromRounds:"aus {n} Runden entnommen", scrollForAllPoints:"← Scrolle, um jeden Punkt zu sehen →",
    gettingBetter:"Verbessert sich", gettingWorse:"Verschlechtert sich", atOrBeyondTarget:"Am Ziel oder Darueber", shortOfTarget:"Unter dem Ziel",
    trendFlat:"Stabil", latestSameAsStart:"Deine letzte Runde entspricht deinem Startwert", trendImprovedBy:"{n} naeher am Ziel als beim Start", trendWorsenedBy:"{n} weiter vom Ziel entfernt als beim Start",
    onTrack:"Im Zeitplan", offTrack:"Im Rueckstand", ofProgressMade:"des Weges geschafft", currentlyAt:"Aktuell bei",
    markAchieved:"Als Erreicht Markieren", raiseTheBar:"Hoeher Setzen", raiseTheBarDesc:"Du hast {target} fuer {metric} erreicht. Setze ein neues, schwierigeres Ziel und trainiere weiter darauf hin.",
    roundsSinceGoalSet:"Runden Seit Dieses Ziel Gesetzt Wurde", noRoundsSinceGoalSet:"Noch keine Runden erfasst, seit dieses Ziel gesetzt wurde",
    dayLeft:"Tag verbleibend", daysLeft:"Tage verbleibend", deadlinePassed:"Frist abgelaufen",
    newGoal:"Neues Ziel", chooseMetric:"Waehle, was verfolgt werden soll", currentValue:"Aktuell", setTarget:"Setze dein Ziel",
    targetLowerPlaceholder:"z.B. eine niedrigere Zahl als aktuell", targetHigherPlaceholder:"z.B. eine hoehere Zahl als aktuell",
    setDeadline:"Setze eine Frist", saveGoal:"Ziel speichern",
    setPeriod:"Setze einen Zeitraum", period1m:"1 Monat", period3m:"3 Monate", period6m:"6 Monate", period12m:"12 Monate",
    progressOverTime:"Fortschritt im Zeitverlauf", recommendedFromGoal:"Empfohlen durch dein Ziel",
    goalMetric_hcp:"Handicap-Index", goalMetric_puttingHcp:"Putting-Handicap", goalMetric_shortGameHcp:"Kurzspiel-Handicap", goalMetric_longGameHcp:"Langspiel-Handicap",
    goalMetric_girPct:"% Gruens in Regulation", goalMetric_firPct:"% Fairways in Regulation", goalMetric_avgPutts18:"Putts pro 18 Loecher",
    goalMetric_threePutts18:"3-Putts pro Runde", goalMetric_updownPct:"% Up & Down", goalMetric_avgScoreVsPar:"Durchschnittsergebnis vs Par",
    signOut:"Abmelden", defaultHoles:"Standard-Locher", settingsAuto:"Einstellungen werden automatisch gespeichert",
    streakDay:"Tag Serie", streakDays:"Tage Serie", feel_focused:"Fokussiert", feel_relaxed:"Entspannt", feel_neutral:"Neutral", feel_tired:"Mude", feel_pumped:"Motiviert", feel_anxious:"Angespannt",
    freq_everyday:"Jeden Tag", freq_f45:"4-5x/Woche", freq_f23:"2-3x/Woche", freq_weekly:"Einmal/Woche", freq_monthly:"Monatlich", freq_occasional:"Gelegentlich",
    score_under70:"Unter 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Handicap senken", goal_break90:"Unter 90 spielen", goal_break80:"Unter 80 spielen", goal_break70:"Unter 70 spielen", goal_shortGame:"Kurzes Spiel verbessern", goal_management:"Platzmanagement", goal_enjoy:"Das Spiel geniessen", goal_compete:"Wettkampf",
    weak_driver:"Driver", weak_irons:"Eisen", weak_wedges:"Wedges", weak_putting:"Putten", weak_bunker:"Bunker", weak_mental:"Mental", weak_shortGame2:"Kurzes Spiel", weak_strategy:"Strategie",
    clubDistances:"Schlaegerdistanzen", clubDistancesHint:"Trage ein, wie weit du jeden Schlaeger schlaegst. Uebungen, die eine bestimmte Distanz brauchen, schlagen dann deinen echten Schlaeger vor statt zu raten.",
    ydsAbbr:"yds", mAbbr:"m",
    club_driver:"Driver", club_w3:"3er Holz", club_w5:"5er Holz", club_i2:"2er Eisen", club_i3:"3er Eisen", club_i4:"4er Eisen", club_i5:"5er Eisen", club_i6:"6er Eisen", club_i7:"7er Eisen", club_i8:"8er Eisen", club_i9:"9er Eisen", club_pw:"Pitching Wedge", club_gw:"Gap Wedge", club_sw:"Sand Wedge", club_lw:"Lob Wedge",
    yourClubSuggestion:"Dein Schlaeger fuer diese Distanz", genericClubSuggestion:"Vorgeschlagener Schlaeger (allgemeine Schaetzung)", approxSuffix:"(ca.)",
    clubface:"Schlagflaeche", ballPosition:"Ballposition", face_square:"Quadratisch zum Ziel", face_open:"Offen", face_varies:"Je nach Schlag", ball_center:"Mitte des Stands", ball_forward:"Vorne (vorderer Fuss)", ball_back:"Hinter der Mitte", ball_varies:"Je nach Schlaeger",
    totalResult:"Gesamtergebnis", byExercise:"Nach Uebung", recommendedForYou:"Fuer dich empfohlen", basedOnWeakness:"Basierend auf deiner Schwaeche",
    statReason_gir:"Basierend auf deinen Runden — dein GIR liegt unter dem Zielwert", statReason_threePutt:"Basierend auf deinen Runden — 3-Putts ueber dem Zielwert", statReason_updown:"Basierend auf deinen Runden — Up-and-Down-Rate unter dem Zielwert",
    rightHandedNote:"Diese Setup-Anweisungen sind fuer Rechtshaender geschrieben. Wenn du Linkshaender bist, spiegle jede Richtung (links↔rechts, im Uhrzeigersinn↔gegen den Uhrzeigersinn).",
    programs:"Vorgefertigte Programme", steps:"Schritte", programSteps:"Inhalt dieses Programms", startProgram:"Programm starten", programComplete:"Programm abgeschlossen", saveAndNext:"Speichern & weiter", exitProgram:"Programm beenden", theTechnique:"Die Technik", watchVideo:"Ansehen",
    prog_draw_name:"Draw-Entwicklung", prog_draw_desc:"Baue eine verlaessliche Rechts-nach-Links-Flugbahn auf. Beginnt mit Ausrichtungsgrundlagen, geht zu absichtlicher Formgebung, und festigt es mit Wiederholbarkeitsarbeit.",
    prog_draw_technical:"Ein Draw kurvt rechts nach links, weil die Schlagflaeche zu einem Innen-nach-Aussen-Schwungplan geschlossen ist — aber zum Ziel weiterhin offen bleibt.",
    draw_t1:"Verstaerke den Griff etwas — drehe beide Haende leicht nach rechts (2,5-3 Knoechel an der fuehrenden Hand sichtbar)", draw_t2:"Ballposition: Mitte des Stands, oder eine Ballbreite weiter hinten bei Eisen", draw_t3:"Schliesse den Stand leicht — hinterer Fuss 5 cm zurueck, Huefte und Schultern folgen", draw_t4:"Ziele Fuesse/Huefte/Schultern leicht rechts vom Ziel; Schlagflaeche auf das echte Ziel gerichtet", draw_t5:"Schwinge zurueck, dann beim Treffmoment natuerlich loslassen — nicht versuchen zu flippen oder die Flaeche manuell zu schliessen",
    draw_t1_left:"Verstaerke den Griff etwas — drehe beide Haende leicht nach links (2,5-3 Knoechel an der fuehrenden Hand sichtbar)", draw_t3_left:"Schliesse den Stand leicht — hinterer Fuss 5 cm zurueck, Huefte und Schultern folgen (gespiegelt fuer Linkshaender)", draw_t4_left:"Ziele Fuesse/Huefte/Schultern leicht links vom Ziel; Schlagflaeche auf das echte Ziel gerichtet",
    prog_fade_name:"Fade-Entwicklung", prog_fade_desc:"Baue eine verlaessliche Links-nach-Rechts-Flugbahn auf. Gleiche Formgebungsfaehigkeit wie das Draw-Programm, gleiche Uebungen, andere Absicht — die meisten Spieler profitieren davon, beide Kurvenrichtungen zu kontrollieren.",
    prog_fade_technical:"Ein Fade kurvt links nach rechts, weil die Schlagflaeche zu einem Aussen-nach-Innen-Schwungplan offen ist — aber zum Ziel weiterhin geschlossen bleibt.",
    fade_t1:"Schwaeche den Griff etwas — drehe beide Haende leicht nach links (etwa 1 Knoechel an der fuehrenden Hand sichtbar)", fade_t2:"Ballposition: leicht vor deiner normalen Position", fade_t3:"Oeffne den Stand leicht — vorderer Fuss 5 cm zurueck, Huefte und Schultern folgen", fade_t4:"Ziele Fuesse/Huefte/Schultern leicht links vom Ziel; Schlagflaeche auf das echte Ziel gerichtet", fade_t5:"Halte die Flaeche beim Treffmoment einen Moment laenger offen — widerstehe einem vollen Loslassen",
    fade_t1_left:"Schwaeche den Griff etwas — drehe beide Haende leicht nach rechts (etwa 1 Knoechel an der fuehrenden Hand sichtbar)", fade_t3_left:"Oeffne den Stand leicht — vorderer Fuss 5 cm zurueck (gespiegelt fuer Linkshaender)", fade_t4_left:"Ziele Fuesse/Huefte/Schultern leicht rechts vom Ziel; Schlagflaeche auf das echte Ziel gerichtet",
    prog_slice_name:"Stoppe Deinen Slice", prog_slice_desc:"Der Slice ist der haeufigste Schwungfehler im Golf — der Ball startet gerade oder links und kurvt stark nach rechts, was Distanz und Genauigkeit kostet. Dieses Programm zielt direkt auf die zwei echten Ursachen: eine offene Schlagflaeche und einen Aussen-nach-Innen-Schwungplan.",
    prog_slice_technical:"Ein Slice entsteht, wenn die Schlagflaeche zum Schwungplan offen ist — korrigiere die Flaeche vor dem Plan, sonst verwandelst du den Slice nur in einen schwaecheren Push-Slice.",
    slice_t1:"Pruefe deinen Griff — siehst du nur 0-1 Knoechel an der fuehrenden Hand, verstaerke ihn auf 2-3", slice_t2:"Quadriere deinen Stand — Fuesse, Huefte, Schultern parallel zum Ziel, nicht links ausgerichtet", slice_t3:"Bewege den Ball etwas weiter zurueck als jetzt, besonders beim Driver", slice_t4:"Ziele die Schlagflaeche direkt auf das Ziel — widerstehe dem Instinkt, links zu zielen", slice_t5:"Halte den hinteren Ellbogen nah am Koerper im Abschwung, dann lass die Unterarme beim Treffmoment vollstaendig rotieren",
    slice_t2_left:"Quadriere deinen Stand — Fuesse, Huefte, Schultern parallel zum Ziel, nicht rechts ausgerichtet", slice_t4_left:"Ziele die Schlagflaeche direkt auf das Ziel — widerstehe dem Instinkt, rechts zu zielen",
    prog_hook_name:"Stoppe Deinen Hook", prog_hook_desc:"Ein Hook startet rechts oder gerade und taucht stark nach links ab — oft schwerwiegender als ein Slice, da er schnell in Schwierigkeiten laeuft. Dieses Programm zielt auf die zwei echten Ursachen: einen zu starken Griff und einen zu starken Innen-nach-Aussen-Schwungplan.",
    prog_hook_technical:"Ein Hook entsteht, wenn die Schlagflaeche zum Schwungplan beim Treffmoment geschlossen ist — das mechanische Gegenteil eines Slice. Meist einfacher zu beheben, aber widerstehe der Ueberkorrektur in einen Slice.",
    hook_t1:"Pruefe deinen Griff — siehst du 4+ Knoechel an der fuehrenden Hand, schwaeche ihn leicht auf 2-3", hook_t2:"Quadriere deinen Stand — Fuesse, Huefte, Schultern parallel zum Ziel, nicht rechts ausgerichtet", hook_t3:"Pruefe, ob der Ball nicht zu weit hinten ist — bewege ihn zurueck zu deiner normalen Position", hook_t4:"Spuere ein ruhigeres Loslassen — lass die Rotation aus der Koerperdrehung kommen, nicht aus einem aggressiven Handflip",
    hook_t2_left:"Quadriere deinen Stand — Fuesse, Huefte, Schultern parallel zum Ziel, nicht links ausgerichtet",
    prog_punchLow_name:"Punch- & Tiefschlag-Kontrolle", prog_punchLow_desc:"Fuer windige Tage und Problemschlaege — Punches, Knockdowns und Stinger basieren alle auf derselben Faehigkeit: zu kontrollieren, wo der Schlaeger den Boden trifft, und sich fuer eine niedrigere Flugbahn zu engagieren.",
    prog_punchLow_technical:"Ein Punch reduziert die Flugbahn durch Entlofting der Flaeche im Setup — Ball hinten, Haende vorne, abgekuerzter Schwung — nicht durch haerteres Schlagen.",
    punchLow_t1:"Nimm einen Schlaeger mehr und greife 5 cm tiefer", punchLow_t2:"Ballposition: 1-2 Ballbreiten hinter deiner normalen Position", punchLow_t3:"Verenge deinen Stand, Gewicht nach vorne (~60% vorderer Fuss) und halte es so", punchLow_t4:"Schwinge nur auf Dreiviertel-Laenge zurueck — kein voller Rueckschwung", punchLow_t5:"Halte die Haende vor dem Schlaegerkopf beim Treffmoment, dann stoppe den Durchschwung niedrig",
    prog_flopLob_name:"Flop- & Lob-Beherrschung", prog_flopLob_desc:"Hohe, weiche Kurzspiel-Schlaege funktionieren nur mit vollem Engagement — Versuche mit halbem Einsatz werden verschunden oder gegrundet. Diese Sequenz baut die Technik, die Lagenanpassung und die zoegerfreie Einstellung gemeinsam auf.",
    prog_flopLob_technical:"Ein Flop kommt durch eine weit geoeffnete Flaeche und einen engagierten, beschleunigenden Schwung hoch — Abbremsen verursacht den Fehlschlag, nicht die Technik. Pruefe immer zuerst die Liegeposition.",
    flopLob_t1:"Pruefe zuerst die Liegeposition — bestaetige genug Polster unter dem Ball fuer diesen Schlag", flopLob_t2:"Oeffne die Flaeche vollstaendig vor dem Greifen — setze sie, dann nimm deinen Griff aus dieser offenen Position", flopLob_t3:"Ballposition: vorne, auf Hoehe der vorderen Ferse", flopLob_t4:"Oeffne deinen Stand weit links vom Ziel, Gewicht 60-80% auf dem vorderen Fuss", flopLob_t5:"Engagiere dich und beschleunige beim Treffmoment — ein zoegerlicher Schwung verschundet oder duennt den Schlag",
    flopLob_t4_left:"Oeffne deinen Stand weit rechts vom Ziel, Gewicht 60-80% auf dem vorderen Fuss",
    prog_bunker_name:"Bunker-Selbstvertrauen", prog_bunker_desc:"Sandtechnik gepaart mit dem mentalen Reset, den die meisten Spieler tatsaechlich brauchen — Bunker sind einer der haeufigsten Frustrationsausloeser im Golf.",
    prog_bunker_technical:"Bunkerschlaege werden am Eintrittspunkt in den Sand entschieden, niemals am Ball selbst — vertraue dem Bounce und beschleunige, niemals abbremsen.",
    bunker_t1:"Oeffne die Flaeche, bevor du den Griff nimmst", bunker_t2:"Nimm einen breiten Stand und grabe die Fuesse leicht ein fuer Stabilitaet", bunker_t3:"Ballposition: vorne, auf Hoehe der vorderen Ferse — Brustbein direkt hinter dem Ball", bunker_t4:"Ziele darauf, etwa 5 cm hinter dem Ball in den Sand einzutreten", bunker_t5:"Beschleunige durchgehend durch den Sand — niemals abbremsen",
    prog_chipping_name:"Chipping-Grundlagen", prog_chipping_desc:"Ein niedriger, rollender Schlag direkt neben dem Green gespielt — der Ball verbringt den groessten Teil seiner Reise rollend statt fliegend. Die moderne Methode bevorzugt einen vorderen Ball, vertikalen Schaft, und laesst den Bounce die Arbeit machen.",
    prog_chipping_technical:"Chipping ist der direkte Cousin des Puttens — ein ruhiges, von den Schultern gefuehrtes Dreieck mit minimaler unabhaengiger Handgelenksaktion, das auf den Bounce des Schlaegers vertraut statt zu graben.",
    chipping_t1:"Normaler Griff, etwas tiefer fuer mehr Kontrolle greifen", chipping_t2:"Verenge deinen Stand — Fuesse eng beieinander, etwa eine Schlaegerkopf-Breite", chipping_t3:"Ballposition: vorne in deinem Stand, Schaft relativ vertikal gehalten", chipping_t4:"Bewege Arme und Schultern als eine ruhige Einheit — vertraue dem Bounce, schlage nach unten, damit der Ball hochgeht",
    prog_pitching_name:"Pitching-Kontrolle", prog_pitching_desc:"Ein hoeherer, weicherer Schlag als ein Chip, typischerweise von 20-80 Metern, bei dem der Ball den groessten Teil der Distanz durch die Luft zuruecklegt und mit etwas Stoppwirkung landet — zwischen einem Chip und einem vollen Wedge-Schwung.",
    prog_pitching_technical:"Pitching ist ein verkleinerter voller Schwung, gebaut fuer Gefuehl, nicht Kraft — kontrolliere die Distanz mit 2-3 wiederholbaren Schwunglaengen und engagiere dich, durch jede einzelne zu beschleunigen.",
    pitching_t1:"Verenge deinen Stand gegenueber einem vollen Schwung, noch kleiner fuer kuerzere Pitches", pitching_t2:"Gewicht ~60% auf dem vorderen Fuss und Schultern flacher als bei einem vollen Schwung", pitching_t3:"Ballposition: Mitte bis leicht vorne, Haende leicht vor dem Ball", pitching_t4:"Waehle deine Schwunglaenge, dann beschleunige — niemals beim Treffen abbremsen",
    prog_yips_name:"Die Yips Ueberwinden", prog_yips_desc:"Die Yips reagieren am besten auf den Wiederaufbau des Vertrauens auf sehr kurzer Distanz, Atmung zur Spannungsreduktion, und die Verschiebung des Fokus vom Ergebnis zum Prozess — nicht auf weitere mechanische Anpassungen. Diese Sequenz basiert genau auf diesem Ansatz.",
    prog_yips_technical:"Die Yips kombinieren physische Spannung und mentale Ueberkontrolle, nicht ein Schwungplan- oder Flaechenproblem — eine mechanische Loesung zu suchen verschlimmert es meist. Ein echter Griffstil-Wechsel ist einer der wirksamsten Resets.",
    yips_t1:"Bevor du dich aufstellst, mache eine Ganzkoerper-Spannungspruefung — schuettle Haende und Arme aus, atme einmal langsam", yips_t2:"Erwaege einen anderen Griffstil als gewohnt — Claw, Saw, oder Cross-Handed — um das alte Spannungsmuster zu durchbrechen", yips_t3:"Lockere deinen Griffdruck bewusst — ziele auf etwa 3-4 von 10", yips_t4:"Waehle genau einen Hinweis fuer den Schlag — 'weiche Haende,' 'fluessiges Tempo,' oder 'ruhiges Handgelenk' — und nichts sonst", yips_t5:"Stelle dich auf und lass den Schlag geschehen — widerstehe dem Drang, bewusst zu steuern oder dem Ball zu helfen",
    diff_Beginner:"Anfanger", diff_Intermediate:"Fortgeschritten", diff_Advanced:"Experte",
    left_dir:"Links", right_dir:"Rechts", short_dir:"Kurz", long_dir:"Lang",
  },
  it: {
    appTagline:"Allenati meglio. Gioca con meno colpi.", createAccount:"Crea account", signIn:"Accedi",
    welcomeBack:"Bentornato", signInSub:"Accedi per continuare l'allenamento", email:"Email", password:"Password",
    noAccount:"Non hai un account? Creane uno", notYou:"Non sei tu? Usa un altro account", createAcct:"Crea account", step1:"Passo 1 di 2", step2:"Passo 2 di 2",
    finisherGames:"Giochi Finisher", players:"Giocatori", addPlayer:"Aggiungi giocatore", localMultiplayerNote:"Multiplayer locale: passa il telefono tra i giocatori a ogni stazione.", forYourGoals:"Per i Tuoi Obiettivi",
    startFinisher:"Inizia", station:"Stazione", scoreForStation:"Punteggio per questa stazione", prevStation:"Precedente", nextStation:"Stazione successiva", finishGame:"Termina gioco",
    handPhoneTo:"Passa il telefono a", nextPlayer:"Prossimo giocatore", byStation:"Per stazione", yourEvolution:"La tua evoluzione", runningTotal:"Totale progressivo", today:"Oggi", bestPrevious:"Migliore precedente",
    exportImage:"Esporta come immagine", exporting:"Esportazione in corso", exported:"Salvato", exportFailed:"Esportazione non riuscita — prova uno screenshot", copied:"Copiato negli appunti", shareResult:"Condividi risultato", howWhy:"Come e perche",
    noSessionsYetTap:"Nessuna sessione ancora — tocca per vedere", noSessionsYet:"Nessuna sessione ancora", noSessionsYetDesc:"Allena quest'area per iniziare a costruire i tuoi progressi qui.",
    avgScore:"Punteggio medio", worst:"Piu basso", evolution:"Evoluzione", sinceStart:"dall'inizio", needMoreSessions:"Completa un'altra sessione per vedere il tuo andamento.",
    exercisesPracticed:"Esercizi praticati", allSessions:"Tutte le sessioni", upMeansImproving:"Linea in salita = miglioramento (punteggi piu bassi)",
    per18Holes:"per 18 buche", successRate:"tasso di successo", downMeansImproving:"Linea in discesa = miglioramento (meno 3-putt)",
    higherMeansHigherScore:"La linea sale quando il punteggio sale — non significa meglio o peggio", higherMeansMorePutts:"La linea sale quando i putt aumentano — piu putt non e un bene",
    higherMeansMoreUpDowns:"La linea sale quando gli up-and-down aumentano", higherMeansMoreGreens:"La linea sale quando si colpiscono piu green", higherMeansMoreFairways:"La linea sale quando si colpiscono piu fairway",
    higherMeansHigherHcp:"La linea sale quando l'handicap aumenta — un handicap piu basso e l'obiettivo",
    viewHistory:"Vedi cronologia", scorecardHistory:"Cronologia segnapunti", roundCount:"round", roundCount2:"round",
    last5:"Ultimi 5", last10:"Ultimi 10", last25:"Ultimi 25", allTime:"Sempre",
    createSub:"Il tuo allenamento personale inizia qui", fullName:"Nome completo", choosePass:"Scegli una password",
    continue:"Continua", haveAccount:"Hai gia un account? Accedi", golfProfile:"Profilo golf",
    golfProfileSub:"Personalizza il tuo piano di allenamento", handicapIndex:"Indice di handicap", handicapHelp:"Usa + per handicap positivo (es: +2.4)",
    hcpFormatError:"Inserisci un numero valido, come 14.2 o +2.4", hcpRangeError:"L'handicap deve essere tra -5.0 e 54.0",
    playFreq:"Con che frequenza giochi?", selectFreq:"Seleziona frequenza", measurement:"Unita di misura",
    yardsFeet:"Yard / Piedi", metres:"Metri", language:"Lingua", startTraining:"Inizia l'allenamento",
    fillAll:"Compila tutti i campi.", wrongLogin:"Email o password errati.", emailTaken:"Questa email e gia registrata.",
    back:"Indietro",
    train:"Allenamento", scorecard:"Scorecard", stats:"Statistiche", history:"Cronologia", player:"Giocatore",
    chooseFocus:"Scegli la tua area di interesse", start:"Inizia", sessions:"sessioni",
    min:"min", chooseExercise:"Scegli esercizio", drillsAvail:"esercizi disponibili",
    last:"Ultimo", purpose:"Obiettivo", yourHistory:"La tua cronologia", first:"Primo", best:"Migliore",
    outOf:"su", saveResult:"Salva risultato", excellent:"Eccellente!", goodWork:"Buon lavoro", keepGoing:"Continua cosi",
    yourScore:"Il tuo punteggio", vsLast:"vs ultima sessione", whyMatters:"Perche e importante", newSession:"Nuova sessione",
    trackRound:"Registra il tuo giro, buca per buca", holes:"buche", startRound:"Inizia il giro", playHereAgain:"Gioca qui di nuovo",
    golfCourse:"Campo da golf", coursePh:"es: Pebble Beach...", feelToday:"Come ti senti oggi?",
    roundType:"Tipo di Giro", roundTypePractice:"Allenamento", roundTypeCompetition:"Competizione", allRoundTypes:"Tutti", noRoundsMatchFilter:"Nessun giro corrisponde a questo filtro",
    savedCourse:"salvato", courseAutoSaveHint:"Scegli un campo per compilare automaticamente il par, o digitane uno nuovo — verra salvato per la prossima volta.",
    browse:"Sfoglia", chooseCourse:"Scegli campo", searchCourses:"Cerca campi...", addNewCourse:"Aggiungi campo",
    courseName:"Nome del campo", parPerHole:"Par per buca", totalPar:"Par totale", saveCourseBtn:"Salva campo", noCoursesFound:"Nessun campo trovato",
    resetDemoTitle:"Ripristina dati demo", resetDemoDesc:"Elimina tutto su questo dispositivo e ricarica con i dati di esempio di Edouard L (30 sessioni, partite Finisher contro Alban L e Simon M). Azione irreversibile.", resetDemoBtn:"Ripristina dati demo", resetDemoConfirm:"Si, ripristina",
    fullResetTitle:"Ripristina per un nuovo utente", fullResetDesc:"Elimina tutti gli account, i giri, le sessioni di allenamento e le impostazioni salvate su questo dispositivo — ed esegue il logout completo verso la schermata di registrazione, ripristinata in inglese e unita metriche. Usa questo prima di passare l'app a qualcun altro. Azione irreversibile.", fullResetBtn:"Ripristina tutto", fullResetConfirm:"Si, elimina tutto",
    notesOptional:"Note (opzionale)", notesPh:"Vento sulle ultime buche, buoni putt...",
    cancel:"Annulla", saveRound:"Salva giro", hole:"Buca", par:"Par", score:"Punteggio", putts:"Putt", miss:"Errore",
    girImpossible:"Non possibile con questo punteggio e putt — GIR significa raggiungere il green in par meno 2 colpi.",
    girRequired:"Questo punteggio e questi putt tornano solo se hai raggiunto il green in par meno 2 colpi — GIR e stato selezionato per te.",
    roundSaved:"Giro salvato!", roundSavedSub:"Bel giro", viewSummary:"Vedi riepilogo", done:"Fatto",
    gameGlance:"Il tuo gioco in breve", onCourse:"In campo", avgPutts:"Putt medi", perHole:"per buca",
    greens:"green", fairways:"fairway", topMiss:"Errore principale", common:"frequente",
    threePutts:"3-Putt", holesTotal:"buche", upAndDown:"Up & Down", attempts:"tentativi",
    scoreVsPar:"Punteggio vs Par", lastRounds:"Ultimi", rounds:"giri", trainingProgress:"Progresso allenamento", scoreTrend:"Andamento Punteggio",
    hdcpVsActual:"Handicap vs Reale", declaredHdcp:"Il tuo handicap", actualAvg:"Media reale (vs par)",
    playingAbove:"Stai giocando sopra il tuo handicap", playingBelow:"Stai giocando sotto il tuo handicap", playingOnTarget:"Perfettamente in linea",
    playingAboveDesc:"I tuoi ultimi giri hanno una media di {n} colpi superiore a quanto suggerisce il tuo handicap. Controlla le statistiche per area per capire dove si perdono i colpi.",
    playingBelowDesc:"I tuoi ultimi giri hanno una media di {n} colpi migliore di quanto suggerisce il tuo handicap — ottimo lavoro, il tuo indice potrebbe necessitare un aggiornamento.",
    playingOnTargetDesc:"Il tuo punteggio reale corrisponde bene al tuo handicap dichiarato. Buona costanza.",
    hdcpDisclaimer:"Stima semplificata — non considera il rating o lo slope del campo.",
    derivedHandicaps:"Handicap di Abilita Stimati", puttingHcp:"Handicap di Putting", shortGameHcp:"Handicap di Gioco Corto", longGameHcp:"Handicap di Gioco Lungo",
    derivedHandicapDisclaimer:"Stimato dai tuoi putt reali, 3-putt, e tasso di up-and-down, confrontato con dati pubblicati Shot Scope / Arccos per livello di handicap — non e un handicap ufficiale.",
    handicapHistory:"Storico Handicap", howCalculated:"Come viene calcolato", yourLatestNumbers:"I tuoi numeri piu recenti (ultimi 5 giri)", roundOverview:"Panoramica dei Giri",
    hcpCalcExplain:"L'Handicap di Putting media due valori dei tuoi ultimi 5 giri — i tuoi putt per 18 buche e il tuo tasso di 3-putt — ciascuno confrontato con la tabella di riferimento sotto. L'Handicap di Gioco Corto deriva dal tuo tasso di conversione up-and-down, confrontato allo stesso modo. L'Handicap di Gioco Lungo combina GIR% (peso 70%) e FIR% (peso 30%) — la ricerca mostra che il GIR predice molto meglio il livello, mentre i fairway centrati separano poco gli handicap. La tabella e costruita da dati reali di giocatori Shot Scope e Arccos su migliaia di giri.",
    hcpLevel:"Handicap", threePuttsShort:"3-Putt", upAndDownShort:"Up&Down", scratch:"Scratch",
    myPlan:"Il Mio Piano", planSub:"Sessioni in coda per la prossima volta", planEmpty:"Nessuna sessione pianificata. Prepara una lista di esercizi per la prossima volta.",
    addSession:"Aggiungi sessione", addToPlan:"Aggiungi al tuo piano", startNext:"Inizia", nextInPlan:"Prossima nel tuo piano",
    focusRec:"Raccomandazione", focus:"Da migliorare", strong:"Forte", getStarted:"Inizia", getStartedSub:"Allena un'abilita o registra un giro per iniziare a monitorare i tuoi progressi.",
    startTrainingCta:"Inizia allenamento", logRoundCta:"Registra un giro", unlockStatsHint:"Registra FIR, GIR, putt e direzione degli errori per ogni buca per sbloccare statistiche detagliate.",
    sessionsCount:"sessione", sessionsCount2:"sessioni", clearAll:"Cancella tutto", noHistory:"Le tue sessioni appariranno qui.",
    confirmClear:"Cancellare tutta la cronologia?", deleteThis:"Eliminare questa voce?", deleteThisGroup:"Eliminare per tutti i giocatori?", delete:"Elimina",
    roundSummary:"Riepilogo del giro", profile:"Profilo", settings:"Impostazioni", personalInfo:"Informazioni personali", yourName:"Il tuo nome",
    homeClub:"Club", homeClubPh:"es: Pebble Beach", location:"Posizione", locationPh:"Citta, Paese",
    typicalScore:"Punteggio tipico", dominantHand:"Mano dominante", right:"Destra", left:"Sinistra", select:"Seleziona...",
    mainGoal:"Obiettivo principale", weaknesses:"Punti debole", saveProfile:"Salva profilo", profileSaved:"Profilo salvato",
    goals:"Obiettivi", addGoal:"Aggiungi obiettivo", setFirstGoal:"Imposta il tuo primo obiettivo", goalNoDataYet:"Ancora nessun dato", alreadyActiveGoal:"Gia un obiettivo attivo",
    targetInvalidNumber:"Inserisci un numero valido", targetCannotBeNegative:"Non puo essere negativo", targetOver100Pct:"Questa e una percentuale, non puo superare 100",
    goalsTagline:"Segui obiettivi reali e misurabili — aggiornati automaticamente", goalsEmptyDesc:"Scegli una statistica che monitori gia — handicap, %GIR, putt — e fissa un numero e una data. Faremo il resto.",
    goalsDataScopeNote:"Ogni numero qui e calcolato solo dai giri giocati da quando ogni obiettivo e stato creato — non dalle tue statistiche complessive. Per questo possono differire dai totali in Statistiche.",
    activeGoals:"In corso", reachedGoals:"Raggiunti", target:"Obiettivo", ofTheWay:"del percorso fatto", goalReached:"obiettivo raggiunto",
    goalHistory:"Storico Obiettivi", goalOutcomeReached:"Raggiunto", goalOutcomeExpired:"Tempo scaduto — non raggiunto", goalOutcomeEnded:"Terminato in anticipo",
    viewDetails:"Vedi Dettagli", sinceGoalSetOn:"Da quando questo obiettivo e stato impostato il", startedAt:"Iniziato a", needMoreRoundsForTrend:"Registra altri giri per vedere il tuo andamento qui",
    oneRoundLoggedSoFar:"1 giro registrato finora — tocca per vederlo",
    selectMetricToReview:"Scegli cosa rivedere", sampledFromRounds:"campionato da {n} giri", scrollForAllPoints:"← Scorri per vedere ogni punto →",
    gettingBetter:"In miglioramento", gettingWorse:"In peggioramento", atOrBeyondTarget:"All'Obiettivo o Oltre", shortOfTarget:"Sotto l'Obiettivo",
    trendFlat:"Stabile", latestSameAsStart:"Il tuo ultimo giro corrisponde al punto di partenza", trendImprovedBy:"{n} piu vicino all'obiettivo rispetto alla partenza", trendWorsenedBy:"{n} piu lontano dall'obiettivo rispetto alla partenza",
    onTrack:"In Linea", offTrack:"Fuori Tempo", ofProgressMade:"del percorso fatto", currentlyAt:"Attualmente a",
    markAchieved:"Segna come Raggiunto", raiseTheBar:"Alza l'Asticella", raiseTheBarDesc:"Hai raggiunto {target} per {metric}. Imposta un nuovo obiettivo piu difficile e continua ad allenarti.",
    roundsSinceGoalSet:"Giri da Quando questo Obiettivo e Stato Impostato", noRoundsSinceGoalSet:"Nessun giro registrato da quando questo obiettivo e stato impostato",
    dayLeft:"giorno rimasto", daysLeft:"giorni rimasti", deadlinePassed:"scadenza superata",
    newGoal:"Nuovo Obiettivo", chooseMetric:"Scegli cosa monitorare", currentValue:"Attuale", setTarget:"Imposta il tuo obiettivo",
    targetLowerPlaceholder:"es: un numero piu basso di quello attuale", targetHigherPlaceholder:"es: un numero piu alto di quello attuale",
    setDeadline:"Imposta una scadenza", saveGoal:"Salva obiettivo",
    setPeriod:"Imposta un periodo", period1m:"1 mese", period3m:"3 mesi", period6m:"6 mesi", period12m:"12 mesi",
    progressOverTime:"Progresso nel Tempo", recommendedFromGoal:"Raccomandato dal tuo obiettivo",
    goalMetric_hcp:"Indice di Handicap", goalMetric_puttingHcp:"Handicap di Putting", goalMetric_shortGameHcp:"Handicap di Gioco Corto", goalMetric_longGameHcp:"Handicap di Gioco Lungo",
    goalMetric_girPct:"% Green in Regulation", goalMetric_firPct:"% Fairway in Regulation", goalMetric_avgPutts18:"Putt per 18 Buche",
    goalMetric_threePutts18:"3-Putt per Giro", goalMetric_updownPct:"% Up & Down", goalMetric_avgScoreVsPar:"Punteggio Medio vs Par",
    signOut:"Esci", defaultHoles:"Buche predefinite", settingsAuto:"Le impostazioni si salvano automaticamente",
    streakDay:"giorno consecutivo", streakDays:"giorni consecutivi", feel_focused:"Concentrato", feel_relaxed:"Rilassato", feel_neutral:"Neutro", feel_tired:"Stanco", feel_pumped:"Carico", feel_anxious:"Ansioso",
    freq_everyday:"Tutti i giorni", freq_f45:"4-5x/settimana", freq_f23:"2-3x/settimana", freq_weekly:"Una volta/settimana", freq_monthly:"Mensile", freq_occasional:"Occasionale",
    score_under70:"Sotto 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Abbassare il mio handicap", goal_break90:"Scendere sotto 90", goal_break80:"Scendere sotto 80", goal_break70:"Scendere sotto 70", goal_shortGame:"Migliorare il gioco corto", goal_management:"Gestione del campo", goal_enjoy:"Divertirmi", goal_compete:"Competere",
    weak_driver:"Driver", weak_irons:"Ferri", weak_wedges:"Wedge", weak_putting:"Putt", weak_bunker:"Bunker", weak_mental:"Mentale", weak_shortGame2:"Gioco corto", weak_strategy:"Strategia",
    clubDistances:"Distanze dei bastoni", clubDistancesHint:"Indica quanto percorre ogni bastone. Gli esercizi che richiedono una distanza specifica suggeriranno il tuo bastone reale invece di indovinare.",
    ydsAbbr:"yds", mAbbr:"m",
    club_driver:"Driver", club_w3:"Legno 3", club_w5:"Legno 5", club_i2:"Ferro 2", club_i3:"Ferro 3", club_i4:"Ferro 4", club_i5:"Ferro 5", club_i6:"Ferro 6", club_i7:"Ferro 7", club_i8:"Ferro 8", club_i9:"Ferro 9", club_pw:"Pitching Wedge", club_gw:"Gap Wedge", club_sw:"Sand Wedge", club_lw:"Lob Wedge",
    yourClubSuggestion:"Il tuo bastone per questa distanza", genericClubSuggestion:"Bastone suggerito (stima generica)", approxSuffix:"(circa)",
    clubface:"Faccia del bastone", ballPosition:"Posizione della palla", face_square:"Quadrata all'obiettivo", face_open:"Aperta", face_varies:"Varia per colpo", ball_center:"Centro della posizione", ball_forward:"Avanzata (piede avanti)", ball_back:"Dietro il centro", ball_varies:"Varia per bastone",
    totalResult:"Risultato totale", byExercise:"Per esercizio", recommendedForYou:"Consigliato per te", basedOnWeakness:"Basato sul tuo punto debole",
    statReason_gir:"Basato sui tuoi giri — il tuo GIR e sotto l'obiettivo", statReason_threePutt:"Basato sui tuoi giri — 3-putt sopra l'obiettivo", statReason_updown:"Basato sui tuoi giri — tasso di up-and-down sotto l'obiettivo",
    rightHandedNote:"Queste istruzioni di impostazione sono scritte per giocatori destrorsi. Se giochi da sinistra, inverti ogni direzione (sinistra↔destra, orario↔antiorario).",
    programs:"Programmi Predefiniti", steps:"passaggi", programSteps:"Cosa contiene questo programma", startProgram:"Inizia programma", programComplete:"Programma completato", saveAndNext:"Salva e avanti", exitProgram:"Esci dal programma", theTechnique:"La Tecnica", watchVideo:"Guarda",
    prog_draw_name:"Sviluppo del Draw", prog_draw_desc:"Costruisci una traiettoria affidabile da destra a sinistra. Inizia con i fondamentali di allineamento, passa alla creazione intenzionale della traiettoria, e la fissa con lavoro di ripetibilita.",
    prog_draw_technical:"Un draw curva da destra a sinistra perche la faccia del bastone e chiusa rispetto a un piano di swing da dentro verso fuori — ma resta aperta rispetto all'obiettivo.",
    draw_t1:"Rinforza leggermente la presa — gira entrambe le mani un po' a destra (2,5-3 nocche visibili sulla mano guida)", draw_t2:"Posizione palla: centro della stance, o un ball-width piu indietro per i ferri", draw_t3:"Chiudi leggermente la stance — piede posteriore arretrato di 5 cm, fianchi e spalle seguono", draw_t4:"Punta piedi/fianchi/spalle leggermente a destra dell'obiettivo; faccia del bastone puntata sull'obiettivo reale", draw_t5:"Esegui lo swing e rilascia naturalmente all'impatto — non cercare di flippare o chiudere manualmente la faccia",
    draw_t1_left:"Rinforza leggermente la presa — gira entrambe le mani un po' a sinistra (2,5-3 nocche visibili sulla mano guida)", draw_t3_left:"Chiudi leggermente la stance — piede posteriore arretrato di 5 cm, fianchi e spalle seguono (invertito per sinistrorsi)", draw_t4_left:"Punta piedi/fianchi/spalle leggermente a sinistra dell'obiettivo; faccia del bastone puntata sull'obiettivo reale",
    prog_fade_name:"Sviluppo del Fade", prog_fade_desc:"Costruisci una traiettoria affidabile da sinistra a destra. Stessa abilita di modellazione del programma draw, stessi esercizi, intento diverso — la maggior parte dei giocatori beneficia dal controllare entrambe le direzioni di curva.",
    prog_fade_technical:"Un fade curva da sinistra a destra perche la faccia del bastone e aperta rispetto a un piano di swing da fuori verso dentro — ma resta chiusa rispetto all'obiettivo.",
    fade_t1:"Indebolisci leggermente la presa — gira entrambe le mani un po' a sinistra (circa 1 nocca visibile sulla mano guida)", fade_t2:"Posizione palla: leggermente avanti rispetto alla tua posizione normale", fade_t3:"Apri leggermente la stance — piede anteriore arretrato di 5 cm, fianchi e spalle seguono", fade_t4:"Punta piedi/fianchi/spalle leggermente a sinistra dell'obiettivo; faccia del bastone puntata sull'obiettivo reale", fade_t5:"Mantieni la faccia aperta un istante di piu all'impatto — resisti a un rilascio completo",
    fade_t1_left:"Indebolisci leggermente la presa — gira entrambe le mani un po' a destra (circa 1 nocca visibile sulla mano guida)", fade_t3_left:"Apri leggermente la stance — piede anteriore arretrato di 5 cm (invertito per sinistrorsi)", fade_t4_left:"Punta piedi/fianchi/spalle leggermente a destra dell'obiettivo; faccia del bastone puntata sull'obiettivo reale",
    prog_slice_name:"Ferma il Tuo Slice", prog_slice_desc:"Lo slice e il difetto di swing piu comune nel golf — la palla parte dritta o a sinistra e curva forte a destra, perdendo distanza e precisione. Questo programma colpisce direttamente le due vere cause: una faccia del bastone aperta e un piano di swing da fuori verso dentro.",
    prog_slice_technical:"Lo slice accade quando la faccia del bastone e aperta rispetto al piano di swing all'impatto — correggi la faccia prima del piano, o trasformerai solo lo slice in un push-slice piu debole.",
    slice_t1:"Verifica la tua presa — se vedi solo 0-1 nocche sulla mano guida, rinforzala a 2-3", slice_t2:"Squadra la tua stance — piedi, fianchi, spalle paralleli all'obiettivo, non puntati a sinistra", slice_t3:"Sposta leggermente la palla indietro rispetto a dove si trova ora, specialmente con il driver", slice_t4:"Punta la faccia del bastone direttamente sull'obiettivo — resisti all'istinto di puntare a sinistra", slice_t5:"Tieni il gomito posteriore vicino al corpo in discesa, poi lascia che gli avambracci ruotino completamente all'impatto",
    slice_t2_left:"Squadra la tua stance — piedi, fianchi, spalle paralleli all'obiettivo, non puntati a destra", slice_t4_left:"Punta la faccia del bastone direttamente sull'obiettivo — resisti all'istinto di puntare a destra",
    prog_hook_name:"Ferma il Tuo Hook", prog_hook_desc:"Un hook parte a destra o dritto e si immerge forte a sinistra — spesso piu severo di uno slice perche finisce rapidamente nei guai. Questo programma colpisce le due vere cause: una presa troppo forte e un piano di swing troppo da dentro verso fuori.",
    prog_hook_technical:"Un hook accade quando la faccia del bastone e chiusa rispetto al piano di swing all'impatto — l'opposto meccanico di uno slice. Generalmente piu facile da correggere, ma resisti alla sovracorrezione verso uno slice.",
    hook_t1:"Verifica la tua presa — se vedi 4+ nocche sulla mano guida, indeboliscila leggermente a 2-3", hook_t2:"Squadra la tua stance — piedi, fianchi, spalle paralleli all'obiettivo, non puntati a destra", hook_t3:"Verifica che la palla non sia troppo indietro — spostala verso la tua posizione normale", hook_t4:"Senti un rilascio piu calmo — lascia che la rotazione venga dalla rotazione del corpo, non da un movimento aggressivo delle mani",
    hook_t2_left:"Squadra la tua stance — piedi, fianchi, spalle paralleli all'obiettivo, non puntati a sinistra",
    prog_punchLow_name:"Controllo Colpi Bassi", prog_punchLow_desc:"Per giornate ventose e colpi di recupero — punch, knockdown e stinger si basano tutti sulla stessa abilita: controllare dove il bastone tocca il terreno e impegnarsi in una traiettoria piu bassa.",
    prog_punchLow_technical:"Un punch riduce la traiettoria deloftando la faccia all'indirizzo — palla indietro, mani avanti, swing abbreviato — non colpendo piu forte.",
    punchLow_t1:"Prendi un bastone in piu e scendi 5 cm sulla presa", punchLow_t2:"Posizione palla: 1-2 ball-width indietro rispetto alla tua posizione normale", punchLow_t3:"Restringi la tua stance, peso avanti (~60% piede anteriore) e mantienilo cosi", punchLow_t4:"Esegui lo swing solo a tre quarti — nessun backswing completo", punchLow_t5:"Mantieni le mani avanti rispetto alla testa del bastone all'impatto, poi ferma il seguito basso",
    prog_flopLob_name:"Padronanza di Flop e Lob", prog_flopLob_desc:"I colpi alti e morbidi del gioco corto funzionano solo con impegno totale — i tentativi a meta sforzo si bloccano o scivolano. Questa sequenza costruisce la tecnica, l'adattabilita alle posizioni, e la mentalita senza esitazione, tutto insieme.",
    prog_flopLob_technical:"Un flop sale grazie a una faccia molto aperta e uno swing impegnato e accelerante — decelerare causa l'errore, non la tecnica. Verifica sempre prima la posizione della palla.",
    flopLob_t1:"Verifica prima la posizione della palla — confirma che ci sia abbastanza cuscino sotto la palla per questo colpo", flopLob_t2:"Apri completamente la faccia prima di prendere la presa — posizionala, poi prendi la presa da quella posizione aperta", flopLob_t3:"Posizione palla: avanti, all'altezza del tallone anteriore", flopLob_t4:"Apri la tua stance ben a sinistra dell'obiettivo, peso 60-80% sul piede anteriore", flopLob_t5:"Impegnati e accelera all'impatto — uno swing esitante blocca o assottiglia il colpo",
    flopLob_t4_left:"Apri la tua stance ben a destra dell'obiettivo, peso 60-80% sul piede anteriore",
    prog_bunker_name:"Fiducia nel Bunker", prog_bunker_desc:"Tecnica della sabbia abbinata al reset mentale di cui la maggior parte dei giocatori ha davvero bisogno — i bunker sono uno dei piu comuni fattori di frustrazione nel golf.",
    prog_bunker_technical:"I colpi di bunker si vincono o si perdono al punto di ingresso nella sabbia, mai sulla palla — fidati del bounce e accelera, non decelerare mai.",
    bunker_t1:"Apri la faccia prima di prendere la presa", bunker_t2:"Prendi una stance larga e affonda leggermente i piedi per stabilita", bunker_t3:"Posizione palla: avanti, all'altezza del tallone anteriore — sterno appena dietro la palla", bunker_t4:"Punta a entrare nella sabbia circa 5 cm dietro la palla", bunker_t5:"Accelera per tutto il passaggio nella sabbia — non decelerare mai",
    prog_chipping_name:"Fondamentali del Chipping", prog_chipping_desc:"Un colpo basso e rotolante giocato appena fuori dal green — la palla passa la maggior parte del suo percorso rotolando piuttosto che volando. Il metodo moderno favorisce una palla avanti, uno shaft verticale, e lascia che il bounce faccia il lavoro.",
    prog_chipping_technical:"Il chipping e il cugino diretto del putting — un triangolo calmo guidato dalle spalle con minima azione indipendente dei polsi, fidandosi del bounce del bastone invece di scavare.",
    chipping_t1:"Presa normale, scendi leggermente per piu controllo", chipping_t2:"Restringi la tua stance — piedi vicini, circa una larghezza di testa del bastone", chipping_t3:"Posizione palla: avanti nella tua stance, shaft mantenuto relativamente verticale", chipping_t4:"Muovi braccia e spalle come un'unica unita calma — fidati del bounce, colpisci verso il basso per far salire la palla",
    prog_pitching_name:"Controllo del Pitching", prog_pitching_desc:"Un colpo piu alto e morbido di un chip, tipicamente da 20-80 metri, dove la palla percorre la maggior parte della distanza in aria e atterra con un po' di frenata — tra un chip e uno swing completo con wedge.",
    prog_pitching_technical:"Il pitching e uno swing completo ridotto, costruito per il tocco, non la potenza — controlla la distanza con 2-3 lunghezze di swing ripetibili e impegnati ad accelerare in ognuna.",
    pitching_t1:"Restringi la tua stance rispetto a uno swing completo, riducendo ulteriormente per pitch piu corti", pitching_t2:"Peso ~60% sul piede anteriore e spalle piu livellate di uno swing completo", pitching_t3:"Posizione palla: centro a leggermente avanti, mani leggermente avanti rispetto alla palla", pitching_t4:"Scegli la tua lunghezza di swing, poi accelera — non decelerare mai nel colpo",
    prog_yips_name:"Superare i Yips", prog_yips_desc:"I yips rispondono meglio ricostruendo la fiducia a distanza molto corta, respirando per ridurre la tensione, e spostando il focus dal risultato al processo — non con altri aggiustamenti meccanici. Questa sequenza e costruita esattamente su questo approccio.",
    prog_yips_technical:"I yips combinano tensione fisica e eccesso di controllo mentale, non un problema di piano di swing o faccia — cercare una soluzione meccanica di solito peggiora le cose. Un vero cambio di stile di presa e uno dei reset piu efficaci.",
    yips_t1:"Prima di posizionarti, fai un controllo di tensione di tutto il corpo — scuoti mani e braccia, fai un respiro lento", yips_t2:"Considera uno stile di presa diverso dal solito — claw, saw, o cross-handed — per rompere il vecchio schema di tensione", yips_t3:"Ammorbidisci deliberatamente la pressione della presa — punta a circa 3-4 su 10", yips_t4:"Scegli esattamente un singolo spunto per il colpo — 'mani morbide,' 'tempo fluido,' o 'polso stabile' — e nient'altro", yips_t5:"Posizionati e lascia che il colpo accada — resisti all'impulso di dirigere consciamente o aiutare la palla",
    diff_Beginner:"Principiante", diff_Intermediate:"Intermedio", diff_Advanced:"Avanzato",
    left_dir:"Sinistra", right_dir:"Destra", short_dir:"Corto", long_dir:"Lungo",
  },
  pt: {
    appTagline:"Treine melhor. Jogue com menos tacadas.", createAccount:"Criar conta", signIn:"Entrar",
    welcomeBack:"Bem-vindo de volta", signInSub:"Entre para continuar treinando", email:"Email", password:"Senha",
    noAccount:"Nao tem conta? Crie uma", notYou:"Nao e voce? Use outra conta", createAcct:"Criar conta", step1:"Passo 1 de 2", step2:"Passo 2 de 2",
    finisherGames:"Jogos Finisher", players:"Jogadores", addPlayer:"Adicionar jogador", localMultiplayerNote:"Multiplayer local: passe o celular entre os jogadores em cada estacao.", forYourGoals:"Para Seus Objetivos",
    startFinisher:"Comecar", station:"Estacao", scoreForStation:"Pontuacao para esta estacao", prevStation:"Anterior", nextStation:"Proxima estacao", finishGame:"Terminar jogo",
    handPhoneTo:"Passe o celular para", nextPlayer:"Proximo jogador", byStation:"Por estacao", yourEvolution:"Sua evolucao", runningTotal:"Total acumulado", today:"Hoje", bestPrevious:"Melhor anterior",
    exportImage:"Exportar como imagem", exporting:"Exportando", exported:"Salvo", exportFailed:"Falha ao exportar — tente uma captura de tela", copied:"Copiado para a area de transferencia", shareResult:"Compartilhar resultado", howWhy:"Como e por que",
    noSessionsYetTap:"Ainda sem sessoes — toque para ver", noSessionsYet:"Ainda sem sessoes", noSessionsYetDesc:"Treine esta area para comecar a registrar seu progresso aqui.",
    avgScore:"Pontuacao media", worst:"Mais baixo", evolution:"Evolucao", sinceStart:"desde o inicio", needMoreSessions:"Complete mais uma sessao para ver sua tendencia.",
    exercisesPracticed:"Exercicios praticados", allSessions:"Todas as sessoes", upMeansImproving:"Linha subindo = melhorando (pontuacoes mais baixas)",
    per18Holes:"por 18 buracos", successRate:"taxa de sucesso", downMeansImproving:"Linha descendo = melhorando (menos 3-putts)",
    higherMeansHigherScore:"A linha sobe quando a pontuacao sobe — nao significa melhor ou pior", higherMeansMorePutts:"A linha sobe quando os putts aumentam — mais putts nao e bom",
    higherMeansMoreUpDowns:"A linha sobe quando os up-and-downs aumentam", higherMeansMoreGreens:"A linha sobe quando mais greens sao atingidos", higherMeansMoreFairways:"A linha sobe quando mais fairways sao atingidos",
    higherMeansHigherHcp:"A linha sobe quando o handicap aumenta — um handicap mais baixo e a meta",
    viewHistory:"Ver historico", scorecardHistory:"Historico de cartoes", roundCount:"rodada", roundCount2:"rodadas",
    last5:"Ultimas 5", last10:"Ultimas 10", last25:"Ultimas 25", allTime:"Sempre",
    createSub:"Seu treino pessoal comeca aqui", fullName:"Nome completo", choosePass:"Escolha uma senha",
    continue:"Continuar", haveAccount:"Ja tem conta? Entrar", golfProfile:"Perfil de golfe",
    golfProfileSub:"Personaliza seu plano de treino", handicapIndex:"Indice de handicap", handicapHelp:"Use + para handicap positivo (ex: +2.4)",
    hcpFormatError:"Digite um numero valido, como 14.2 ou +2.4", hcpRangeError:"O handicap deve estar entre -5.0 e 54.0",
    playFreq:"Com que frequencia voce joga?", selectFreq:"Selecione frequencia", measurement:"Unidade de medida",
    yardsFeet:"Jardas / Pes", metres:"Metros", language:"Idioma", startTraining:"Comecar a treinar",
    fillAll:"Preencha todos os campos.", wrongLogin:"Email ou senha incorretos.", emailTaken:"Este email ja esta registrado.",
    back:"Voltar",
    train:"Treinar", scorecard:"Cartao", stats:"Estatisticas", history:"Historico", player:"Jogador",
    chooseFocus:"Escolha sua area de foco", start:"Comecar", sessions:"sessoes",
    min:"min", chooseExercise:"Escolher exercicio", drillsAvail:"exercicios disponiveis",
    last:"Ultimo", purpose:"Proposito", yourHistory:"Seu historico", first:"Primeiro", best:"Melhor",
    outOf:"de", saveResult:"Salvar resultado", excellent:"Excelente!", goodWork:"Bom trabalho", keepGoing:"Continue assim",
    yourScore:"Sua pontuacao", vsLast:"vs ultima sessao", whyMatters:"Por que isso importa", newSession:"Nova sessao",
    trackRound:"Registre sua rodada, buraco por buraco", holes:"buracos", startRound:"Comecar rodada", playHereAgain:"Jogar aqui de novo",
    golfCourse:"Campo de golfe", coursePh:"ex: Pebble Beach...", feelToday:"Como voce esta se sentindo hoje?",
    roundType:"Tipo de Rodada", roundTypePractice:"Treino", roundTypeCompetition:"Competicao", allRoundTypes:"Todas", noRoundsMatchFilter:"Nenhuma rodada corresponde a este filtro",
    savedCourse:"salvo", courseAutoSaveHint:"Escolha um campo para preencher o par automaticamente, ou digite um novo — sera salvo para a proxima vez.",
    browse:"Explorar", chooseCourse:"Escolher campo", searchCourses:"Buscar campos...", addNewCourse:"Adicionar campo",
    courseName:"Nome do campo", parPerHole:"Par por buraco", totalPar:"Par total", saveCourseBtn:"Salvar campo", noCoursesFound:"Nenhum campo encontrado",
    resetDemoTitle:"Redefinir dados de demo", resetDemoDesc:"Apaga tudo neste dispositivo e recarrega com os dados de exemplo de Edouard L (30 sessoes, jogos Finisher contra Alban L e Simon M). Esta acao nao pode ser desfeita.", resetDemoBtn:"Redefinir dados", resetDemoConfirm:"Sim, redefinir",
    fullResetTitle:"Redefinir para um novo usuario", fullResetDesc:"Exclui todas as contas, rodadas, sessoes de treino e configuracoes salvas neste dispositivo — e desconecta completamente para a tela de cadastro, redefinido para ingles e unidades metricas. Use isso antes de passar o app para outra pessoa. Esta acao nao pode ser desfeita.", fullResetBtn:"Redefinir tudo", fullResetConfirm:"Sim, apagar tudo",
    notesOptional:"Notas (opcional)", notesPh:"Ventoso nos ultimos buracos, bons putts...",
    cancel:"Cancelar", saveRound:"Salvar rodada", hole:"Buraco", par:"Par", score:"Pontuacao", putts:"Putts", miss:"Erro",
    girImpossible:"Nao e possivel com esta pontuacao e putts — GIR significa alcancar o green em par menos 2 tacadas.",
    girRequired:"Esta pontuacao e estes putts so fazem sentido se voce alcancou o green em par menos 2 tacadas — GIR foi marcado para voce.",
    roundSaved:"Rodada salva!", roundSavedSub:"Bom trabalho la fora", viewSummary:"Ver resumo", done:"Concluido",
    gameGlance:"Seu jogo em um relance", onCourse:"No campo", avgPutts:"Putts media", perHole:"por buraco",
    greens:"greens", fairways:"fairways", topMiss:"Erro principal", common:"comum",
    threePutts:"3-Putts", holesTotal:"buracos", upAndDown:"Up & Down", attempts:"tentativas",
    scoreVsPar:"Pontuacao vs Par", lastRounds:"Ultimas", rounds:"rodadas", trainingProgress:"Progresso de treino", scoreTrend:"Tendencia de Pontuacao",
    hdcpVsActual:"Handicap vs Real", declaredHdcp:"Seu handicap", actualAvg:"Media real (vs par)",
    playingAbove:"Jogando acima do seu handicap", playingBelow:"Jogando abaixo do seu handicap", playingOnTarget:"Bem na meta",
    playingAboveDesc:"Suas ultimas rodadas tem media de {n} tacadas acima do que seu handicap sugere. Vale verificar as estatisticas por area para ver onde as tacadas estao escapando.",
    playingBelowDesc:"Suas ultimas rodadas tem media de {n} tacadas melhor do que seu handicap sugere — bom trabalho, seu indice pode precisar de atualizacao.",
    playingOnTargetDesc:"Sua pontuacao real corresponde bem ao seu handicap declarado. Boa consistencia.",
    hdcpDisclaimer:"Estimativa simplificada — nao considera o rating ou slope do campo.",
    derivedHandicaps:"Handicaps de Habilidade Estimados", puttingHcp:"Handicap de Putting", shortGameHcp:"Handicap de Jogo Curto", longGameHcp:"Handicap de Jogo Longo",
    derivedHandicapDisclaimer:"Estimado a partir dos seus putts reais, 3-putts, e taxa de up-and-down, comparado com dados publicados Shot Scope / Arccos por nivel de handicap — nao e um handicap oficial.",
    handicapHistory:"Historico de Handicap", howCalculated:"Como isso e calculado", yourLatestNumbers:"Seus numeros mais recentes (ultimas 5 rodadas)", roundOverview:"Visao Geral das Rodadas",
    hcpCalcExplain:"O Handicap de Putting faz a media de dois numeros das suas ultimas 5 rodadas — seus putts por 18 buracos e sua taxa de 3-putts — cada um comparado com a tabela de referencia abaixo. O Handicap de Jogo Curto vem da sua taxa de conversao up-and-down, comparada da mesma forma. O Handicap de Jogo Longo combina GIR% (peso 70%) e FIR% (peso 30%) — pesquisas mostram que o GIR prediz muito melhor o nivel, enquanto fairways acertados quase nao diferenciam handicaps. A tabela e construida a partir de dados reais de jogadores Shot Scope e Arccos em milhares de rodadas.",
    hcpLevel:"Handicap", threePuttsShort:"3-Putts", upAndDownShort:"Up&Down", scratch:"Scratch",
    myPlan:"Meu Plano", planSub:"Sessoes na fila para a proxima vez", planEmpty:"Nenhuma sessao planejada ainda. Monte uma lista de exercicios para a proxima vez.",
    addSession:"Adicionar sessao", addToPlan:"Adicionar ao seu plano", startNext:"Comecar", nextInPlan:"Proxima no seu plano",
    focusRec:"Recomendacao", focus:"Foco", strong:"Forte", getStarted:"Comecar", getStartedSub:"Treine uma habilidade ou registre uma rodada para acompanhar seu progresso.",
    startTrainingCta:"Comecar a treinar", logRoundCta:"Registrar uma rodada", unlockStatsHint:"Registre FIR, GIR, putts e direcao de erros em cada buraco para desbloquear estatisticas detalhadas.",
    sessionsCount:"sessao", sessionsCount2:"sessoes", clearAll:"Limpar tudo", noHistory:"Suas sessoes aparecerao aqui.",
    confirmClear:"Limpar todo o historico?", deleteThis:"Excluir esta entrada?", deleteThisGroup:"Excluir para todos os jogadores?", delete:"Excluir",
    roundSummary:"Resumo da rodada", profile:"Perfil", settings:"Configuracoes", personalInfo:"Informacoes pessoais", yourName:"Seu nome",
    homeClub:"Clube", homeClubPh:"ex: Pebble Beach", location:"Localizacao", locationPh:"Cidade, Pais",
    typicalScore:"Pontuacao tipica", dominantHand:"Mao dominante", right:"Direita", left:"Esquerda", select:"Selecionar...",
    mainGoal:"Objetivo principal", weaknesses:"Pontos fracos", saveProfile:"Salvar perfil", profileSaved:"Perfil salvo",
    goals:"Objetivos", addGoal:"Adicionar objetivo", setFirstGoal:"Defina seu primeiro objetivo", goalNoDataYet:"Ainda sem dados", alreadyActiveGoal:"Ja e um objetivo ativo",
    targetInvalidNumber:"Digite um numero valido", targetCannotBeNegative:"Isso nao pode ser negativo", targetOver100Pct:"Isso e uma porcentagem, nao pode passar de 100",
    goalsTagline:"Acompanhe metas reais e mensuraveis — atualizadas automaticamente", goalsEmptyDesc:"Escolha uma estatistica que voce ja acompanha — handicap, %GIR, putts — e defina um numero e uma data. Nos fazemos o resto.",
    goalsDataScopeNote:"Cada numero aqui e calculado apenas com as rodadas jogadas desde que cada objetivo foi criado — nao suas estatisticas totais. Por isso podem ser diferentes dos totais em Estatisticas.",
    activeGoals:"Em andamento", reachedGoals:"Alcancados", target:"Meta", ofTheWay:"do caminho percorrido", goalReached:"objetivo alcancado",
    goalHistory:"Historico de Objetivos", goalOutcomeReached:"Alcancado", goalOutcomeExpired:"Tempo esgotado — nao alcancado", goalOutcomeEnded:"Terminado antes",
    viewDetails:"Ver Detalhes", sinceGoalSetOn:"Desde que este objetivo foi criado em", startedAt:"Comecou em", needMoreRoundsForTrend:"Registre mais algumas rodadas para ver seu progresso aqui",
    oneRoundLoggedSoFar:"1 rodada registrada ate agora — toque para ver",
    selectMetricToReview:"Escolha o que revisar", sampledFromRounds:"amostrado de {n} rodadas", scrollForAllPoints:"← Role para ver cada ponto →",
    gettingBetter:"Melhorando", gettingWorse:"Piorando", atOrBeyondTarget:"Na Meta ou Alem", shortOfTarget:"Abaixo da Meta",
    trendFlat:"Estavel", latestSameAsStart:"Sua ultima rodada corresponde ao seu ponto de partida", trendImprovedBy:"{n} mais perto da meta do que no inicio", trendWorsenedBy:"{n} mais longe da meta do que no inicio",
    onTrack:"No Caminho Certo", offTrack:"Atrasado", ofProgressMade:"do caminho percorrido", currentlyAt:"Atualmente em",
    markAchieved:"Marcar como Alcancado", raiseTheBar:"Elevar a Meta", raiseTheBarDesc:"Voce alcancou {target} para {metric}. Defina uma nova meta mais dificil e continue treinando.",
    roundsSinceGoalSet:"Rodadas Desde que este Objetivo Foi Criado", noRoundsSinceGoalSet:"Nenhuma rodada registrada desde que este objetivo foi criado",
    dayLeft:"dia restante", daysLeft:"dias restantes", deadlinePassed:"prazo expirado",
    newGoal:"Novo Objetivo", chooseMetric:"Escolha o que acompanhar", currentValue:"Atual", setTarget:"Defina sua meta",
    targetLowerPlaceholder:"ex: um numero menor que o atual", targetHigherPlaceholder:"ex: um numero maior que o atual",
    setDeadline:"Defina um prazo", saveGoal:"Salvar objetivo",
    setPeriod:"Defina um periodo", period1m:"1 mes", period3m:"3 meses", period6m:"6 meses", period12m:"12 meses",
    progressOverTime:"Progresso ao Longo do Tempo", recommendedFromGoal:"Recomendado pelo seu objetivo",
    goalMetric_hcp:"Indice de Handicap", goalMetric_puttingHcp:"Handicap de Putting", goalMetric_shortGameHcp:"Handicap de Jogo Curto", goalMetric_longGameHcp:"Handicap de Jogo Longo",
    goalMetric_girPct:"% Greens em Regulamento", goalMetric_firPct:"% Fairways em Regulamento", goalMetric_avgPutts18:"Putts por 18 Buracos",
    goalMetric_threePutts18:"3-Putts por Rodada", goalMetric_updownPct:"% Up & Down", goalMetric_avgScoreVsPar:"Pontuacao Media vs Par",
    signOut:"Sair", defaultHoles:"Buracos padrao", settingsAuto:"As configuracoes salvam automaticamente",
    streakDay:"dia consecutivo", streakDays:"dias consecutivos", feel_focused:"Focado", feel_relaxed:"Relaxado", feel_neutral:"Neutro", feel_tired:"Cansado", feel_pumped:"Animado", feel_anxious:"Ansioso",
    freq_everyday:"Todos os dias", freq_f45:"4-5x/semana", freq_f23:"2-3x/semana", freq_weekly:"Uma vez/semana", freq_monthly:"Mensal", freq_occasional:"Ocasional",
    score_under70:"Abaixo de 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Reduzir meu handicap", goal_break90:"Quebrar 90", goal_break80:"Quebrar 80", goal_break70:"Quebrar 70", goal_shortGame:"Melhorar jogo curto", goal_management:"Gestao de campo", goal_enjoy:"Aproveitar o jogo", goal_compete:"Competir",
    weak_driver:"Driver", weak_irons:"Ferros", weak_wedges:"Wedges", weak_putting:"Putt", weak_bunker:"Bunker", weak_mental:"Mental", weak_shortGame2:"Jogo curto", weak_strategy:"Estrategia",
    clubDistances:"Distancias dos tacos", clubDistancesHint:"Informe quao longe voce bate cada taco. Exercicios que precisam de uma distancia especifica vao sugerir seu taco real em vez de adivinhar.",
    ydsAbbr:"yds", mAbbr:"m",
    club_driver:"Driver", club_w3:"Madeira 3", club_w5:"Madeira 5", club_i2:"Ferro 2", club_i3:"Ferro 3", club_i4:"Ferro 4", club_i5:"Ferro 5", club_i6:"Ferro 6", club_i7:"Ferro 7", club_i8:"Ferro 8", club_i9:"Ferro 9", club_pw:"Pitching Wedge", club_gw:"Gap Wedge", club_sw:"Sand Wedge", club_lw:"Lob Wedge",
    yourClubSuggestion:"Seu taco para esta distancia", genericClubSuggestion:"Taco sugerido (estimativa generica)", approxSuffix:"(aprox.)",
    clubface:"Face do taco", ballPosition:"Posicao da bola", face_square:"Quadrada ao alvo", face_open:"Aberta", face_varies:"Varia por tacada", ball_center:"Centro da postura", ball_forward:"Avancada (pe da frente)", ball_back:"Atras do centro", ball_varies:"Varia por taco",
    totalResult:"Resultado total", byExercise:"Por exercicio", recommendedForYou:"Recomendado para voce", basedOnWeakness:"Baseado no seu ponto fraco",
    statReason_gir:"Baseado nas suas rodadas — seu GIR esta abaixo da meta", statReason_threePutt:"Baseado nas suas rodadas — 3-putts acima da meta", statReason_updown:"Baseado nas suas rodadas — taxa de up-and-down abaixo da meta",
    rightHandedNote:"Estas instrucoes de configuracao sao escritas para jogadores destros. Se voce joga como canhoto, inverta cada direcao (esquerda↔direita, horario↔anti-horario).",
    programs:"Programas Predefinidos", steps:"etapas", programSteps:"O que tem neste programa", startProgram:"Iniciar programa", programComplete:"Programa concluido", saveAndNext:"Salvar e proximo", exitProgram:"Sair do programa", theTechnique:"A Tecnica", watchVideo:"Assistir",
    prog_draw_name:"Desenvolvimento do Draw", prog_draw_desc:"Construa uma trajetoria confiavel da direita para a esquerda. Comeca com fundamentos de alinhamento, avanca para a criacao intencional de trajetoria, e a fixa com trabalho de repetibilidade.",
    prog_draw_technical:"Um draw curva da direita para a esquerda porque a face do taco esta fechada em relacao a um plano de swing de dentro para fora — mas continua aberta em relacao ao alvo.",
    draw_t1:"Fortaleca um pouco o grip — gire ambas as maos levemente para a direita (2,5-3 nos dos dedos visiveis na mao guia)", draw_t2:"Posicao da bola: centro da postura, ou um ball-width mais atras para os ferros", draw_t3:"Feche levemente a postura — pe traseiro recuado 5 cm, quadris e ombros seguem", draw_t4:"Aponte pes/quadris/ombros levemente a direita do alvo; face do taco apontando para o alvo real", draw_t5:"Faca o swing e depois solte naturalmente no impacto — nao tente virar ou fechar a face manualmente",
    draw_t1_left:"Fortaleca um pouco o grip — gire ambas as maos levemente para a esquerda (2,5-3 nos dos dedos visiveis na mao guia)", draw_t3_left:"Feche levemente a postura — pe traseiro recuado 5 cm, quadris e ombros seguem (invertido para canhotos)", draw_t4_left:"Aponte pes/quadris/ombros levemente a esquerda do alvo; face do taco apontando para o alvo real",
    prog_fade_name:"Desenvolvimento do Fade", prog_fade_desc:"Construa uma trajetoria confiavel da esquerda para a direita. Mesma habilidade de modelagem do programa draw, mesmos exercicios, intencao diferente — a maioria dos jogadores se beneficia ao controlar ambas as direcoes de curva.",
    prog_fade_technical:"Um fade curva da esquerda para a direita porque a face do taco esta aberta em relacao a um plano de swing de fora para dentro — mas continua fechada em relacao ao alvo.",
    fade_t1:"Enfraqueca um pouco o grip — gire ambas as maos levemente para a esquerda (cerca de 1 no dos dedos visivel na mao guia)", fade_t2:"Posicao da bola: levemente adiante da sua posicao normal", fade_t3:"Abra levemente a postura — pe dianteiro recuado 5 cm, quadris e ombros seguem", fade_t4:"Aponte pes/quadris/ombros levemente a esquerda do alvo; face do taco apontando para o alvo real", fade_t5:"Mantenha a face aberta um instante mais no impacto — resista a uma soltura completa",
    fade_t1_left:"Enfraqueca um pouco o grip — gire ambas as maos levemente para a direita (cerca de 1 no dos dedos visivel na mao guia)", fade_t3_left:"Abra levemente a postura — pe dianteiro recuado 5 cm (invertido para canhotos)", fade_t4_left:"Aponte pes/quadris/ombros levemente a direita do alvo; face do taco apontando para o alvo real",
    prog_slice_name:"Pare Seu Slice", prog_slice_desc:"O slice e o defeito de swing mais comum no golfe — a bola sai reta ou a esquerda e curva forte para a direita, perdendo distancia e precisao. Este programa ataca diretamente as duas causas reais: uma face de taco aberta e um plano de swing de fora para dentro.",
    prog_slice_technical:"O slice acontece quando a face do taco esta aberta em relacao ao plano de swing no impacto — corrija a face antes do plano, ou voce vai apenas transformar o slice em um push-slice mais fraco.",
    slice_t1:"Verifique seu grip — se ve apenas 0-1 nos dos dedos na mao guia, fortaleca-o para 2-3", slice_t2:"Esquadre sua postura — pes, quadris, ombros paralelos ao alvo, nao apontando a esquerda", slice_t3:"Mova a bola levemente para tras de onde esta agora, especialmente com o driver", slice_t4:"Aponte a face do taco diretamente para o alvo — resista ao instinto de apontar a esquerda", slice_t5:"Mantenha o cotovelo traseiro proximo ao corpo na descida, depois deixe os antebracos girarem completamente no impacto",
    slice_t2_left:"Esquadre sua postura — pes, quadris, ombros paralelos ao alvo, nao apontando a direita", slice_t4_left:"Aponte a face do taco diretamente para o alvo — resista ao instinto de apontar a direita",
    prog_hook_name:"Pare Seu Hook", prog_hook_desc:"Um hook sai a direita ou reto e mergulha forte a esquerda — geralmente mais severo que um slice porque termina rapido em problemas. Este programa ataca as duas causas reais: um grip muito forte e um plano de swing muito de dentro para fora.",
    prog_hook_technical:"Um hook acontece quando a face do taco esta fechada em relacao ao plano de swing no impacto — o oposto mecanico de um slice. Geralmente mais facil de corrigir, mas resista a supercorrecao para um slice.",
    hook_t1:"Verifique seu grip — se ve 4+ nos dos dedos na mao guia, enfraqueca-o levemente para 2-3", hook_t2:"Esquadre sua postura — pes, quadris, ombros paralelos ao alvo, nao apontando a direita", hook_t3:"Verifique se a bola nao esta muito atras — mova-a para sua posicao normal", hook_t4:"Sinta uma soltura mais calma — deixe a rotacao vir do giro do corpo, nao de um movimento agressivo das maos",
    hook_t2_left:"Esquadre sua postura — pes, quadris, ombros paralelos ao alvo, nao apontando a esquerda",
    prog_punchLow_name:"Controle de Tacadas Baixas", prog_punchLow_desc:"Para dias de vento e tacadas de problema — punches, knockdowns e stingers dependem todos da mesma habilidade: controlar onde o taco toca o solo e se comprometer com uma trajetoria mais baixa.",
    prog_punchLow_technical:"Um punch reduz a trajetoria retirando loft da face no endereco — bola atras, maos na frente, swing abreviado — nao batendo mais forte.",
    punchLow_t1:"Pegue um taco extra e desca 5 cm no grip", punchLow_t2:"Posicao da bola: 1-2 ball-widths atras da sua posicao normal", punchLow_t3:"Estreite sua postura, peso na frente (~60% pe dianteiro) e mantenha assim", punchLow_t4:"Faca o swing apenas a tres quartos — sem backswing completo", punchLow_t5:"Mantenha as maos na frente da cabeca do taco no impacto, depois pare o seguimento baixo",
    prog_flopLob_name:"Dominio de Flop e Lob", prog_flopLob_desc:"Tacadas altas e suaves do jogo curto so funcionam com compromisso total — tentativas de meio esforco travam ou raspam. Esta sequencia constroi a tecnica, a adaptabilidade a posicoes, e a mentalidade sem hesitacao, tudo junto.",
    prog_flopLob_technical:"Um flop sobe gracas a uma face bem aberta e um swing comprometido e acelerando — desacelerar causa o erro, nao a tecnica. Verifique sempre a posicao da bola primeiro.",
    flopLob_t1:"Verifique primeiro a posicao da bola — confirme que ha colchao suficiente sob a bola para esta tacada", flopLob_t2:"Abra completamente a face antes de pegar o grip — posicione-a, depois pegue seu grip dessa posicao aberta", flopLob_t3:"Posicao da bola: na frente, na altura do calcanhar dianteiro", flopLob_t4:"Abra sua postura bem a esquerda do alvo, peso 60-80% no pe dianteiro", flopLob_t5:"Comprometa-se e acelere no impacto — um swing hesitante trava ou afina a tacada",
    flopLob_t4_left:"Abra sua postura bem a direita do alvo, peso 60-80% no pe dianteiro",
    prog_bunker_name:"Confianca no Bunker", prog_bunker_desc:"Tecnica de areia combinada com o reinicio mental que a maioria dos jogadores realmente precisa — bunkers sao um dos gatilhos de frustracao mais comuns no golfe.",
    prog_bunker_technical:"Tacadas de bunker se ganham ou perdem no ponto de entrada na areia, nunca na bola em si — confie no bounce e acelere, nunca desacelere.",
    bunker_t1:"Abra a face antes de pegar o grip", bunker_t2:"Pegue uma postura larga e enterre levemente os pes para estabilidade", bunker_t3:"Posicao da bola: na frente, na altura do calcanhar dianteiro — esterno bem atras da bola", bunker_t4:"Procure entrar na areia cerca de 5 cm atras da bola", bunker_t5:"Acelere durante toda a passagem pela areia — nunca desacelere",
    prog_chipping_name:"Fundamentos do Chipping", prog_chipping_desc:"Uma tacada baixa e rolante jogada bem perto do green — a bola passa a maior parte do seu trajeto rolando em vez de voando. O metodo moderno favorece uma bola na frente, eixo vertical, e deixa o bounce fazer o trabalho.",
    prog_chipping_technical:"O chipping e o primo direto do putting — um triangulo calmo guiado pelos ombros com minima acao independente dos pulsos, confiando no bounce do taco em vez de escavar.",
    chipping_t1:"Grip normal, desca um pouco para mais controle", chipping_t2:"Estreite sua postura — pes proximos, aproximadamente uma largura de cabeca de taco", chipping_t3:"Posicao da bola: na frente na sua postura, eixo mantido relativamente vertical", chipping_t4:"Mova bracos e ombros como uma unica unidade calma — confie no bounce, bata para baixo para a bola subir",
    prog_pitching_name:"Controle do Pitching", prog_pitching_desc:"Uma tacada mais alta e suave que um chip, tipicamente de 20-80 metros, onde a bola percorre a maior parte da distancia pelo ar e aterriza com algum freio — entre um chip e um swing completo de wedge.",
    prog_pitching_technical:"O pitching e um swing completo reduzido, construido para o toque, nao a potencia — controle a distancia com 2-3 comprimentos de swing repetiveis e comprometa-se a acelerar em cada um.",
    pitching_t1:"Estreite sua postura em relacao a um swing completo, reduzindo ainda mais para pitches curtos", pitching_t2:"Peso ~60% no pe dianteiro e ombros mais nivelados que um swing completo", pitching_t3:"Posicao da bola: centro a levemente na frente, maos levemente na frente da bola", pitching_t4:"Escolha seu comprimento de swing, depois acelere — nunca desacelere na tacada",
    prog_yips_name:"Superando os Yips", prog_yips_desc:"Os yips respondem melhor reconstruindo a confianca em distancia muito curta, respirando para reduzir a tensao, e mudando o foco do resultado para o processo — nao com mais ajustes mecanicos. Esta sequencia e construida exatamente sobre essa abordagem.",
    prog_yips_technical:"Os yips combinam tensao fisica e excesso de controle mental, nao um problema de plano de swing ou face — buscar um ajuste mecanico geralmente piora a situacao. Uma verdadeira mudanca de estilo de grip e um dos resets mais eficazes.",
    yips_t1:"Antes de se posicionar, faca uma verificacao de tensao do corpo todo — sacuda maos e bracos, respire lentamente uma vez", yips_t2:"Considere um estilo de grip diferente do habitual — claw, saw, ou cross-handed — para romper o velho padrao de tensao", yips_t3:"Suavize deliberadamente sua pressao de grip — busque cerca de 3-4 de 10", yips_t4:"Escolha exatamente uma unica dica para a tacada — 'maos suaves,' 'ritmo fluido,' ou 'pulso estavel' — e nada mais", yips_t5:"Posicione-se e deixe a tacada acontecer — resista ao impulso de dirigir consciente ou ajudar a bola",
    diff_Beginner:"Principiante", diff_Intermediate:"Intermediario", diff_Advanced:"Avancado",
    left_dir:"Esquerda", right_dir:"Direita", short_dir:"Curto", long_dir:"Longo",
  },
};

function t(lang, key){
  const dict = TR[lang] || TR.en;
  return dict[key] !== undefined ? dict[key] : (TR.en[key] !== undefined ? TR.en[key] : key);
}

function stor(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
function getPlan(uid){ return stor("caddy_plan_"+uid, []); }
function savePlan(uid, plan){ save("caddy_plan_"+uid, plan); }
function getGoals(uid){ return stor("caddy_goals_"+uid, []); }
function saveGoals(uid, goals){ save("caddy_goals_"+uid, goals); }
// Archive — every goal that's reached its target, had its deadline pass
// without being reached, or was manually ended, moves here instead of being
// deleted outright, so there's a real history to look back on (what was
// tried, whether it worked, what came next).
function getGoalArchive(uid){ return stor("caddy_goals_archive_"+uid, []); }
function archiveGoal(uid, goal, outcome, finalValue){
  const archive = getGoalArchive(uid);
  archive.push({...goal, outcome, finalValue, archivedAt:Date.now()});
  save("caddy_goals_archive_"+uid, archive);
}
function badge(d){
  if(d==="Beginner") return [GREEN_BG, GREEN];
  if(d==="Intermediate") return ["#fff8e6", AMBER];
  return ["#fef0f0", RED];
}
function fmt(ts){return new Date(ts).toLocaleDateString("en-CA",{month:"short",day:"numeric",year:"numeric"});}
// Compact mm/yy formatter — used ONLY for chart axis labels (DetailedTrendChart,
// GoalProgressModal's chart), where horizontal space is genuinely tight and
// the day isn't needed to read a trend. Every other date display in the app
// (round lists, modals, history rows) keeps using fmt() above with the full
// day-level date, since telling two same-month rounds apart still matters there.
function fmtChartAxis(ts){
  const d = new Date(ts);
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = String(d.getFullYear()).slice(-2);
  return mm+"/"+yy;
}
function cvt(txt,units){
  if(!txt||units!=="imperial") return txt;
  return txt
    .replace(/(\d+(?:\.\d+)?)\s*cm\b/g,(_,n)=>`${Math.round(n/2.54)} in`)
    .replace(/(\d+(?:\.\d+)?)\s*m\b/g,(_,n)=>{
      const yd = n*1.094;
      return yd<3 ? `${Math.round(yd*3)} ft` : `${Math.round(yd)} yds`;
    });
}
function calcStreak(sessions){
  if(!sessions.length) return 0;
  const days = [...new Set(sessions.map(s=>new Date(s.ts).toDateString()))]
    .map(d=>new Date(d).getTime()).sort((a,b)=>b-a);
  const DAY=86400000;
  const today = new Date(); today.setHours(0,0,0,0);
  let streak=0, cursor=today.getTime();
  for(let i=0;i<days.length;i++){
    if(days[i]===cursor){ streak++; cursor-=DAY; }
    else if(days[i]===cursor+DAY && i===0){ continue; }
    else break;
  }
  return streak;
}

function Sparkline({data, color, h=36, invert=false, fixedScale=false}){
  if(!data||data.length<2) return null;
  // For "lower is better" series (e.g. score vs par), invert so improvement
  // reads as an upward line, matching how golfers actually think about it.
  const plotDataFull = invert ? data.map(v=>-v) : data;
  // Cap at 15 plotted points — beyond that, a 180px-wide chart gets so
  // cramped that individual points and the value labels around them become
  // unreadable (this affects every chart built on Sparkline: Handicap
  // History, Scorecard History, Finisher evolution, Goals progress, etc).
  // When there are more than 15 raw points, sample evenly across the FULL
  // range rather than just keeping the most recent 15 — that way the chart
  // still reflects the entire selected period's shape (e.g. "All Time" with
  // 35 rounds shows the whole trend, thinned out, not just the last 15 and
  // silently dropping everything before that).
  const MAX_POINTS = 15;
  let plotData = plotDataFull;
  if(plotDataFull.length > MAX_POINTS){
    const sampled = [];
    for(let i=0;i<MAX_POINTS;i++){
      const srcIdx = Math.round((i/(MAX_POINTS-1)) * (plotDataFull.length-1));
      sampled.push(plotDataFull[srcIdx]);
    }
    plotData = sampled;
  }
  // fixedScale locks the Y-axis to 0-100 (for percentage-based series) so every
  // chart reads on the same reference instead of auto-scaling to its own range.
  const mn = fixedScale ? 0 : Math.min(...plotData);
  const mx = fixedScale ? 100 : Math.max(...plotData);
  const rng = mx-mn||1;
  const W=180, H=h;
  const pad=6;
  const xAt=i=>(i/(plotData.length-1))*W;
  const yAt=v=>H-((v-mn)/rng)*(H-pad)+pad/2;
  const pts=plotData.map((v,i)=>`${xAt(i)},${yAt(v)}`).join(" ");
  return (
    <svg viewBox={"0 0 "+W+" "+H} style={{width:"100%",height:h,display:"block",overflow:"visible"}}>
      {fixedScale&&h>=40&&[0,25,50,75,100].map(g=>(
        <line key={g} x1="0" y1={yAt(g)} x2={W} y2={yAt(g)} stroke={BORDER} strokeWidth="1" strokeDasharray={g===0||g===100?"0":"2 3"} opacity={g===0||g===100?0.6:0.4}/>
      ))}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {plotData.map((v,i)=>{
        const isFirst=i===0, isLast=i===plotData.length-1;
        const r=isFirst||isLast?4:3;
        return (
          <g key={i}>
            {(isFirst||isLast)&&<circle cx={xAt(i)} cy={yAt(v)} r={r+2.5} fill={color} opacity="0.18"/>}
            <circle cx={xAt(i)} cy={yAt(v)} r={r} fill={isFirst?WHITE:color} stroke={color} strokeWidth={isFirst?2:1.5}/>
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GROUPED BAR CHART — compares multiple players (or just one) station-by-station
// within a single Finisher game. Bars sit side-by-side per station (not
// stacked), so direct comparison at a glance and a clean screenshot are both
// easy. Works with 1 player too (just a single bar per station).
// ═══════════════════════════════════════════════════════════════════════════
function GroupedBarChart({stations, players, colors, maxPerStation, lang}){
  const W=320, H=170, padL=24, padR=4, padB=20, padT=14;
  const plotW = W-padL-padR, plotH = H-padT-padB;
  const groupW = plotW/stations.length;
  const barGap = 2;
  const barW = Math.max(4, (groupW-8)/Math.max(1,players.length) - barGap);
  // One shared Y-axis scale across ALL stations (not per-station), since a
  // per-station max would make bars visually incomparable — the axis caps
  // at the largest station max so every bar reads against the same ruler,
  // with real gridlines and labels instead of no scale at all.
  const sharedMax = Math.max(1, ...maxPerStation);
  const yAt = v => padT + plotH - (Math.min(v,sharedMax)/sharedMax)*plotH;
  return (
    <div>
    <svg viewBox={"0 0 "+W+" "+H} style={{width:"100%",height:"auto",display:"block"}}>
      {[0,0.5,1].map(f=>(
        <g key={f}>
          <line x1={padL} y1={padT+plotH*(1-f)} x2={W-padR} y2={padT+plotH*(1-f)} stroke={BORDER} strokeWidth="1" strokeDasharray={f===0?"0":"2 3"} opacity={f===0?0.6:0.35}/>
          <text x={padL-5} y={padT+plotH*(1-f)+3} fontSize="9" fill={SLATE_L} textAnchor="end">{Math.round(sharedMax*f)}</text>
        </g>
      ))}
      {stations.map((st,si)=>{
        const groupX = padL + si*groupW + 4;
        return (
          <g key={st.id}>
            {players.map((p,pi)=>{
              const val = Number(p.scores[st.id])||0;
              const barH = (val/sharedMax)*plotH;
              const x = groupX + pi*(barW+barGap);
              const y = padT+plotH-barH;
              return (
                <g key={pi}>
                  <rect x={x} y={y} width={barW} height={Math.max(barH,2)} rx="2" fill={colors[pi%colors.length]}/>
                  {/* Value label always rendered (not gated behind a min-height
                      check, which hid the number entirely for short bars on
                      low-max stations) — placed above the bar when there's
                      room, or inside it near the top when the bar is tall. */}
                  <text x={x+barW/2} y={barH>16?y-3:y+10} fontSize="8.5" fill={barH>16?TEXT_S:WHITE} textAnchor="middle" fontWeight="700">{val}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
    <div style={{display:"grid",gridTemplateColumns:"repeat("+stations.length+",1fr)",gap:2,marginTop:4,paddingLeft:24}}>
      {stations.map(st=>(
        <div key={st.id} style={{color:SLATE_L,fontSize:9,textAlign:"center",lineHeight:1.2,fontWeight:600}}>{txFin(lang,st.id,"name",st.name)}</div>
      ))}
    </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUMULATIVE LINE CHART — tracks the running total as you move through a
// Finisher game's stations (station 1 -> 2 -> 3...), one line per series.
// Used two ways: (a) multiplayer, one line per player in today's session, or
// (b) solo, today's line vs. the player's best-ever previous attempt at this
// same game. X-axis = station index, Y-axis = cumulative score, fixed to the
// game's max so every chart for a given game reads on the same scale.
// ═══════════════════════════════════════════════════════════════════════════
function CumulativeLineChart({series, gameMax, stationCount}){
  const W=320, H=130, padL=22, padR=8, padT=10, padB=18;
  const plotW=W-padL-padR, plotH=H-padT-padB;
  const xAt=i=>padL+(i/(stationCount))*plotW; // i=0 is the "0 pts" start point before station 1
  const yAt=v=>padT+plotH-(Math.min(v,gameMax)/gameMax)*plotH;
  return (
    <svg viewBox={"0 0 "+W+" "+H} style={{width:"100%",height:"auto",display:"block"}}>
      {[0,0.5,1].map(f=>(
        <g key={f}>
          <line x1={padL} y1={padT+plotH*f} x2={W-padR} y2={padT+plotH*f} stroke={BORDER} strokeWidth="1" strokeDasharray={f===0||f===1?"0":"2 3"} opacity={f===0||f===1?0.6:0.35}/>
          <text x={padL-5} y={padT+plotH*f+3} fontSize="9" fill={SLATE_L} textAnchor="end">{Math.round(gameMax*(1-f))}</text>
        </g>
      ))}
      {series.map((s,si)=>{
        const pts=s.cumValues.map((v,i)=>`${xAt(i)},${yAt(v)}`).join(" ");
        return (
          <g key={si}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth={s.dashed?1.8:2.4} strokeDasharray={s.dashed?"4 3":"0"} strokeLinecap="round" strokeLinejoin="round" opacity={s.dashed?0.75:1}/>
            {s.cumValues.map((v,i)=>(
              <circle key={i} cx={xAt(i)} cy={yAt(v)} r={i===s.cumValues.length-1?3.5:2.5} fill={s.color} stroke={WHITE} strokeWidth="1.2"/>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPANDABLE CHART — wraps any chart so tapping it opens a full-screen modal
// with a larger version of the exact same chart (same children, just bigger
// container). Shows a subtle expand hint so it's discoverable.
// ═══════════════════════════════════════════════════════════════════════════
function ExpandableChart({title, lang, children}){
  const [open,setOpen]=useState(false);
  return (
    <>
      <div onClick={()=>setOpen(true)} style={{cursor:"pointer",position:"relative"}}>
        {children}
        <div style={{position:"absolute",top:-2,right:-2,background:"rgba(255,255,255,0.9)",borderRadius:8,padding:"2px 6px",fontSize:9,color:SLATE_L,border:"1px solid "+BORDER,display:"flex",alignItems:"center",gap:3}}>
          ⤢
        </div>
      </div>
      {open&&(
        <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:WHITE,borderRadius:20,padding:22,width:"100%",maxWidth:480,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>{title}</div>
              <button onClick={()=>setOpen(false)} style={{background:OFF,border:"none",color:SLATE,fontSize:16,cursor:"pointer",width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
            <div style={{transform:"scale(1.3)",transformOrigin:"center top",marginBottom:30}}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HcpInput({value, onChange, dark}){
  // Free-text input, same as the Name field — no numeric keyboard restriction
  // (inputMode="decimal" was hiding the minus sign on many phone keyboards,
  // making negative ["plus"] handicaps impossible to type). Accepts anything
  // while typing; the actual range/format check happens on save instead, via
  // validateHcp(), so the player isn't fighting the input as they type.
  const base = dark
    ? {width:"100%",background:"rgba(255,255,255,0.13)",border:"1.5px solid rgba(255,255,255,0.28)",borderRadius:12,color:WHITE,padding:"13px 15px",boxSizing:"border-box",fontSize:15,outline:"none",fontFamily:"inherit"}
    : {width:"100%",background:OFF,border:"1.5px solid "+BORDER,borderRadius:12,color:TEXT,padding:"11px 14px",boxSizing:"border-box",fontSize:14,outline:"none",fontFamily:"inherit"};
  return (
    <input type="text" value={value||""} onChange={e=>onChange(e.target.value)} placeholder="e.g. 14.2 or +2.4" style={base}/>
  );
}

// Validates a handicap string at SAVE time (not while typing). Returns null
// if valid, or an error message key if not — checks both that it parses as
// a real number and that it falls within -5.0 (best, a "plus" handicap) to
// 54.0 (highest allowed).
function validateHcp(raw, lang){
  if(!raw || !raw.trim()) return null; // empty is allowed — handicap is optional
  const s = raw.trim().replace(",", ".");
  if(!/^[+-]?\d+(\.\d+)?$/.test(s)) return t(lang,"hcpFormatError");
  const num = parseFloat(s);
  if(num<-5||num>54) return t(lang,"hcpRangeError");
  return null;
}

// Formats a DERIVED handicap value (Putting/Short Game/Long Game Handicap)
// following the golf "plus handicap" convention: a value above 0 (the
// normal case) shows as a plain number with no symbol; a value below 0
// (meaning better than scratch) flips its sign and shows a "+" prefix
// instead of a minus — e.g. -2.0 displays as "+2.0", matching how real plus
// handicaps are written. This must be the ONE place this formatting happens
// — every display site should call this rather than hardcoding "+"+v, which
// previously showed a "+" even for ordinary positive handicaps, the opposite
// of the real convention.
function fmtDerivedHcp(v){
  if(v==null) return "—";
  return v<0 ? "+"+Math.abs(v) : String(v);
}

function AuthScreen({onLogin}){
  // No login system — one profile per device. If a profile already exists
  // here, App itself will have already loaded it and never render this
  // screen at all (see how user state is set at the top level), so by the
  // time we get here there's definitely no existing profile yet.
  const [view,setView] = useState("splash");
  const [err,setErr] = useState("");
  const [f,setF] = useState({
    name:"", hdcp:"", freq:"", units:"imperial", lang:"en"
  });
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const L = f.lang;

  function doSignUp(){
    if(!f.name.trim()){setErr(t(L,"fillAll"));return;}
    const hcpError = validateHcp(f.hdcp, L);
    if(hcpError){setErr(hcpError);return;}
    const user={id:"u"+Date.now(),name:f.name.trim(),hdcp:f.hdcp,freq:f.freq,photo:"",goal:"",weaknesses:[],homeClub:"",location:"",typicalScore:"",hand:"Right"};
    const settings={...DEF_SETTINGS,units:f.units,language:f.lang};
    const users=[user]; // one profile per device — no list of accounts to manage
    save("caddy_users",users);
    save("caddy_settings_"+user.id,settings);
    save("caddy_cur",user);
    onLogin(user);
  }

  const inp={
    width:"100%",background:"rgba(255,255,255,0.13)",border:"1.5px solid rgba(255,255,255,0.28)",
    borderRadius:12,color:WHITE,padding:"13px 15px",boxSizing:"border-box",fontSize:15,outline:"none",fontFamily:"inherit"
  };
  const lbl={color:"rgba(255,255,255,0.7)",fontSize:12,fontWeight:600,marginBottom:5,display:"block"};
  const back={background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,padding:"0 0 22px",display:"flex",alignItems:"center",gap:6,fontWeight:600};

  if(view==="splash") return (
    <div style={{minHeight:"100vh",background:DAWN_BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"70px 32px 52px",maxWidth:500,margin:"0 auto"}}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center"}}>
        {LANG_CODES.map(code=>(
          <button key={code} onClick={()=>u("lang",code)}
            style={{padding:"5px 10px",background:f.lang===code?"rgba(232,184,75,0.3)":"rgba(255,255,255,0.08)",border:"1px solid "+(f.lang===code?GOLD:"rgba(255,255,255,0.2)"),borderRadius:8,color:f.lang===code?GOLD:"rgba(255,255,255,0.5)",fontSize:11,cursor:"pointer",fontWeight:f.lang===code?700:400}}>
            {LANG_NAMES[code]}
          </button>
        ))}
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{width:84,height:84,background:"rgba(255,255,255,0.13)",borderRadius:26,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 22px",border:"1.5px solid rgba(255,255,255,0.22)"}}>
          <Icon name="flagPin" size={38} color={GOLD}/>
        </div>
        <div style={{color:WHITE,fontFamily:"Georgia,serif",fontSize:46,fontWeight:700,letterSpacing:-1,lineHeight:1}}>Caddy</div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:12,letterSpacing:3,textTransform:"uppercase",marginTop:7}}>Golf Trainer</div>
        <div style={{color:"rgba(255,255,255,0.45)",fontSize:14,marginTop:18,lineHeight:1.6}}>{t(L,"appTagline")}</div>
      </div>
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:12}}>
        <button onClick={()=>{setView("signup");setErr("");}}
          style={{width:"100%",padding:16,background:GOLD_BG,border:"none",borderRadius:16,color:NAVY,fontWeight:800,fontSize:16,cursor:"pointer",boxShadow:"0 4px 20px rgba(232,184,75,0.4)"}}>
          {t(L,"getStarted")}
        </button>
      </div>
    </div>
  );

  if(view==="signup") return (
    <div style={{minHeight:"100vh",background:DAWN_BG,maxWidth:500,margin:"0 auto",overflowY:"auto"}}>
      <div style={{padding:"44px 28px 60px"}}>
        <button style={back} onClick={()=>{setView("splash");setErr("");}}>← {t(L,"back")}</button>
        <div style={{color:WHITE,fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,marginBottom:4}}>{t(L,"golfProfile")}</div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:14,marginBottom:26}}>{t(L,"golfProfileSub")}</div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={lbl}>{t(L,"fullName")}</label><input type="text" value={f.name} onChange={e=>u("name",e.target.value)} placeholder={t(L,"yourName")} style={inp} autoFocus/></div>
          <div>
            <label style={lbl}>{t(L,"handicapIndex")}</label>
            <HcpInput value={f.hdcp} onChange={v=>u("hdcp",v)} dark/>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,marginTop:5}}>{t(L,"handicapHelp")}</div>
          </div>
          <div><label style={lbl}>{t(L,"playFreq")}</label>
            <select value={f.freq} onChange={e=>u("freq",e.target.value)} style={{...inp,color:f.freq?WHITE:"rgba(255,255,255,0.4)"}}>
              <option value="">{t(L,"selectFreq")}</option>
              {FREQ_KEYS.map(k=><option key={k} value={k} style={{color:"#000",background:"#fff"}}>{t(L,"freq_"+k)}</option>)}
            </select>
          </div>
          <div><label style={lbl}>{t(L,"measurement")}</label>
            <div style={{display:"flex",gap:8}}>
              {[[t(L,"yardsFeet"),"imperial"],[t(L,"metres"),"metric"]].map(([l,v])=>(
                <button key={v} onClick={()=>u("units",v)}
                  style={{flex:1,padding:"11px 8px",background:f.units===v?"rgba(232,184,75,0.25)":"rgba(255,255,255,0.08)",border:"1.5px solid "+(f.units===v?GOLD:"rgba(255,255,255,0.2)"),borderRadius:10,color:f.units===v?GOLD:"rgba(255,255,255,0.6)",fontWeight:f.units===v?700:400,fontSize:13,cursor:"pointer"}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div><label style={lbl}>{t(L,"language")}</label>
            <select value={f.lang} onChange={e=>u("lang",e.target.value)} style={{...inp,color:WHITE}}>
              {LANG_CODES.map(code=><option key={code} value={code} style={{color:"#000",background:"#fff"}}>{LANG_NAMES[code]}</option>)}
            </select>
          </div>
        </div>
        {err&&<div style={{background:"rgba(224,82,82,0.2)",border:"1px solid rgba(224,82,82,0.5)",borderRadius:10,padding:"10px 14px",color:"#ffbbbb",fontSize:13,marginTop:14}}>{err}</div>}
        <button onClick={doSignUp} style={{width:"100%",marginTop:26,padding:16,background:GOLD_BG,border:"none",borderRadius:16,color:NAVY,fontWeight:800,fontSize:16,cursor:"pointer",boxShadow:"0 4px 20px rgba(232,184,75,0.35)"}}>
          {t(L,"startTraining")}
        </button>
      </div>
    </div>
  );

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// COURSE BROWSER — full-screen course picker. Search bar at top filters live;
// below it, an alphabetical (A-Z) grouped list of every course (curated +
// this profile's saved ones). A dedicated "+ Add New Course" flow lets the
// user name a course explicitly and set its par per hole, rather than relying
// on an invisible auto-save. Selecting a course returns it to the caller.
// ═══════════════════════════════════════════════════════════════════════════
function CourseBrowser({userId, lang, onPick, onClose}){
  const [query,setQuery] = useState("");
  const [adding,setAdding] = useState(false);
  const [newName,setNewName] = useState("");
  const [newHoles,setNewHoles] = useState(Array.from({length:18},()=>4));
  const [newHoleCount,setNewHoleCount] = useState(18);

  const savedCourses = getSavedCourses(userId);
  const allCourses = [...savedCourses, ...COURSES.filter(c=>!c.id.startsWith("g"))];
  const filtered = (query.trim()
    ? allCourses.filter(c=>c.name.toLowerCase().includes(query.trim().toLowerCase()))
    : allCourses
  ).sort((a,b)=>a.name.localeCompare(b.name));

  // Group alphabetically by first letter for the A-Z drill-down.
  const grouped = {};
  filtered.forEach(c=>{
    const letter = c.name.trim()[0].toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : "#";
    if(!grouped[key]) grouped[key]=[];
    grouped[key].push(c);
  });
  const letters = Object.keys(grouped).sort();

  function startAdding(){
    setNewName(query.trim());
    setNewHoleCount(18);
    setNewHoles(Array.from({length:18},()=>4));
    setAdding(true);
  }
  function setHoleCount(n){
    setNewHoleCount(n);
    setNewHoles(prev=>Array.from({length:n},(_,i)=>prev[i]??4));
  }
  function saveNewCourse(){
    if(!newName.trim()) return;
    const course = {id:"u"+Date.now(), name:newName.trim(), country:"", holes:newHoles};
    saveCourse(userId, course);
    onPick(course);
  }

  if(adding) return (
    <div style={{position:"fixed",inset:0,background:OFF,zIndex:250,display:"flex",flexDirection:"column"}}>
      <div style={{background:HEADER_BG,padding:"16px 18px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setAdding(false)} style={{background:"none",border:"none",color:WHITE,fontSize:20,cursor:"pointer",padding:0}}>←</button>
        <div style={{color:WHITE,fontWeight:700,fontSize:16}}>{t(lang,"addNewCourse")}</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:18}}>
        <label style={{color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>{t(lang,"courseName")}</label>
        <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder={t(lang,"coursePh")} autoFocus
          style={{width:"100%",background:WHITE,border:"1.5px solid "+BORDER,borderRadius:12,color:TEXT,padding:"11px 14px",boxSizing:"border-box",fontSize:14,outline:"none",marginBottom:16}}/>

        <label style={{color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>{t(lang,"holes")}</label>
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          {[9,18].map(n=>(
            <button key={n} onClick={()=>setHoleCount(n)}
              style={{flex:1,padding:"12px 8px",background:newHoleCount===n?NAVY:WHITE,border:"2px solid "+(newHoleCount===n?NAVY:BORDER),borderRadius:12,color:newHoleCount===n?WHITE:TEXT_S,fontWeight:700,fontSize:14,cursor:"pointer"}}>
              {n} {t(lang,"holes")}
            </button>
          ))}
        </div>

        <label style={{color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>{t(lang,"parPerHole")}</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:20}}>
          {newHoles.map((p,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{color:SLATE_L,fontSize:9,fontWeight:700,marginBottom:3}}>{i+1}</div>
              <select value={p} onChange={e=>setNewHoles(prev=>prev.map((x,idx)=>idx===i?+e.target.value:x))}
                style={{width:"100%",background:WHITE,border:"1.5px solid "+BORDER,borderRadius:8,color:TEXT,padding:"6px 2px",fontSize:13,textAlign:"center",outline:"none"}}>
                {[3,4,5].map(v=><option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{color:SLATE_L,fontSize:12,textAlign:"center",marginBottom:18}}>
          {t(lang,"totalPar")}: <span style={{color:NAVY,fontWeight:700}}>{newHoles.reduce((a,b)=>a+b,0)}</span>
        </div>
        <button onClick={saveNewCourse} disabled={!newName.trim()}
          style={{width:"100%",padding:15,background:newName.trim()?GREEN_GRAD:BORDER,border:"none",borderRadius:14,color:WHITE,fontWeight:700,fontSize:15,cursor:newName.trim()?"pointer":"default"}}>
          {t(lang,"saveCourseBtn")}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:OFF,zIndex:250,display:"flex",flexDirection:"column"}}>
      <div style={{background:HEADER_BG,padding:"16px 18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={onClose} style={{background:"none",border:"none",color:WHITE,fontSize:20,cursor:"pointer",padding:0}}>←</button>
          <div style={{color:WHITE,fontWeight:700,fontSize:16}}>{t(lang,"chooseCourse")}</div>
        </div>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t(lang,"searchCourses")}
          style={{width:"100%",background:"rgba(255,255,255,0.13)",border:"1.5px solid rgba(255,255,255,0.25)",borderRadius:12,color:WHITE,padding:"11px 14px",boxSizing:"border-box",fontSize:14,outline:"none"}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 18px 30px"}}>
        <button onClick={startAdding}
          style={{width:"100%",padding:"13px 14px",background:WHITE,border:"1.5px dashed "+GREEN,borderRadius:14,color:GREEN,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          + {t(lang,"addNewCourse")}
        </button>
        {letters.length===0&&(
          <div style={{textAlign:"center",color:SLATE_L,fontSize:13,padding:"30px 0"}}>{t(lang,"noCoursesFound")}</div>
        )}
        {letters.map(letter=>(
          <div key={letter} style={{marginBottom:18}}>
            <div style={{color:GREEN,fontSize:12,fontWeight:800,marginBottom:8,letterSpacing:1}}>{letter}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {grouped[letter].map(c=>(
                <button key={c.id} onClick={()=>onPick(c)}
                  style={{display:"block",width:"100%",textAlign:"left",padding:"12px 14px",background:WHITE,border:"1px solid "+BORDER,borderRadius:12,cursor:"pointer"}}>
                  <div style={{color:NAVY,fontSize:14,fontWeight:600}}>{c.name}</div>
                  <div style={{color:SLATE_L,fontSize:11,marginTop:2}}>{c.country?c.country+" · ":""}{c.holes.length} {t(lang,"holes")}{savedCourses.includes(c)?" · "+t(lang,"savedCourse"):""}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinisherSummaryModal({session, onClose, lang}){
  if(!session) return null;
  // session is now always an array — one or more player records sharing one
  // playthrough — so the whole group renders together, the same way the
  // live results screen does, rather than one player isolated at a time.
  const group = Array.isArray(session) ? session : [session];
  if(group.length===0) return null;
  const first = group[0];
  const game = FINISHERS[first.gameId];
  const isGroup = group.length>1;
  const PLAYER_COLORS=[NAVY,"#c0392b",GREEN,"#7c5cbf","#e8783c","#3a9bb5"];
  const ranked = [...group].sort((a,b)=>b.score-a.score);
  const maxPerStation = game ? game.stations.map(st=>st.max!==undefined?st.max:(game.perStationMax||20)) : [];
  // GroupedBarChart expects players shaped as {name, scores:{stationId:val}}
  const chartPlayers = game ? group.map(g=>{
    const scoresObj = {};
    (g.stationScores||[]).forEach((v,i)=>{ if(game.stations[i]) scoresObj[game.stations[i].id]=v; });
    return {name:g.playerName, scores:scoresObj};
  }) : [];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:WHITE,borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:500,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
        <div style={{width:36,height:4,background:BORDER,borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>
            {game?game.emoji+" ":"🏆 "}{txFin(lang,first.gameId,"name",first.gameName)}
          </div>
          <button onClick={onClose} style={{background:OFF,border:"none",color:SLATE,fontSize:18,cursor:"pointer",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
        </div>
        <div style={{color:SLATE_L,fontSize:12,marginBottom:16}}>{fmt(first.ts)}{isGroup?" · "+group.length+" "+t(lang,"players"):""}</div>

        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
          {ranked.map((p,i)=>{
            const pct=Math.round((p.score/p.max)*100);
            const grade=gradeFinisher(pct);
            return (
              <div key={i} style={{background:i===0&&isGroup?"linear-gradient(135deg,#fff8e6,#fef0d8)":OFF,borderRadius:14,padding:"12px 16px",border:"1px solid "+(i===0&&isGroup?GOLD+"66":BORDER),display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {i===0&&isGroup&&<span style={{fontSize:15}}>🏆</span>}
                  <div>
                    <div style={{color:NAVY,fontWeight:700,fontSize:14}}>{p.playerName}</div>
                    <div style={{color:grade.color,fontSize:11,fontWeight:700}}>{grade.label}</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:NAVY,fontSize:22,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif",lineHeight:1}}>{p.score}</div>
                  <div style={{color:SLATE_L,fontSize:10}}>/{p.max} · {pct}%</div>
                </div>
              </div>
            );
          })}
        </div>

        {game&&chartPlayers.length>0&&(
          <>
            <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{t(lang,"byStation")}</div>
            <GroupedBarChart stations={game.stations} players={chartPlayers} colors={PLAYER_COLORS} maxPerStation={maxPerStation} lang={lang}/>
            {isGroup&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10,justifyContent:"center"}}>
                {group.map((p,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:9,height:9,borderRadius:2,background:PLAYER_COLORS[i%PLAYER_COLORS.length]}}/>
                    <span style={{color:TEXT_S,fontSize:11,fontWeight:600}}>{p.playerName}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProgramSummaryModal({session, onClose, lang}){
  if(!session) return null;
  const pct = Math.round((session.score/session.max)*100);
  const grade = gradeFinisher(pct);
  const stepScores = Array.isArray(session.stepScores) ? session.stepScores : [];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:WHITE,borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:500,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
        <div style={{width:36,height:4,background:BORDER,borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>🎯 {t(lang,"prog_"+session.programId+"_name")}</div>
          <button onClick={onClose} style={{background:OFF,border:"none",color:SLATE,fontSize:18,cursor:"pointer",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
        </div>
        <div style={{color:SLATE_L,fontSize:12,marginBottom:16}}>{fmt(session.ts)}</div>

        <div style={{background:PURPLE_BG,borderRadius:16,padding:18,marginBottom:16,textAlign:"center",border:"1px solid "+PURPLE+"33"}}>
          <div style={{color:NAVY,fontSize:42,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif",lineHeight:1}}>{session.score}<span style={{fontSize:16,color:SLATE_L}}>/{session.max}</span></div>
          <div style={{color:grade.color,fontSize:14,fontWeight:700,marginTop:4}}>{grade.label} · {pct}%</div>
        </div>

        {stepScores.length>0&&(
          <>
            <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{t(lang,"byExercise")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {stepScores.map((s,i)=>{
                const exDef = EXERCISES[s.focusId] && EXERCISES[s.focusId].find(e=>e.id===s.exId);
                const stPct = s.max?Math.round((s.score/s.max)*100):0;
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:16,width:24}}>{exDef?.emoji||"•"}</span>
                    <span style={{color:TEXT,fontSize:12,flex:1}}>{exDef?tx(lang,exDef.id,"name",exDef.name):s.exId}</span>
                    <div style={{background:BORDER,borderRadius:6,height:6,width:70,overflow:"hidden"}}>
                      <div style={{height:"100%",width:stPct+"%",background:stPct>=80?GREEN:stPct>=50?AMBER:RED,borderRadius:6}}/>
                    </div>
                    <span style={{color:NAVY,fontSize:12,fontWeight:700,minWidth:38,textAlign:"right"}}>{s.score}/{s.max}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ScorecardModal({session, onClose, lang}){
  if(!session) return null;
  const holes=session.holes||[];
  const tot=holes.reduce((a,h)=>a+(h.score||0),0);
  const par=holes.reduce((a,h)=>a+(h.par||0),0);
  const diff=tot-par;
  const gir=holes.filter(h=>h.gir).length;
  const firH=holes.filter(h=>h.par>3);
  const fir=firH.filter(h=>h.fir).length;
  const putts=holes.reduce((a,h)=>a+(h.putts||0),0);
  const threePutts=holes.filter(h=>(h.putts||0)>=3).length;
  const updownAttempts=holes.filter(isUpDownAttempt);
  const updownSuccess=updownAttempts.filter(isUpDownSuccess);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:WHITE,borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:500,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
        <div style={{width:36,height:4,background:BORDER,borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>{t(lang,"roundSummary")}</div>
          <button onClick={onClose} style={{background:OFF,border:"none",color:SLATE,fontSize:18,cursor:"pointer",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
        </div>
        {(session.courseName||session.course)&&<div style={{color:GREEN,fontWeight:600,fontSize:13,marginBottom:2}}>📍 {session.courseName||session.course}</div>}
        {session.roundType&&(
          <div style={{display:"inline-block",background:session.roundType==="competition"?GOLD_BG:OFF,borderRadius:8,padding:"2px 9px",marginBottom:8}}>
            <span style={{color:session.roundType==="competition"?NAVY:TEXT_S,fontSize:11,fontWeight:700}}>{session.roundType==="competition"?"🏆 ":""}{t(lang,session.roundType==="competition"?"roundTypeCompetition":"roundTypePractice")}</span>
          </div>
        )}
        {session.feeling&&<div style={{color:SLATE_L,fontSize:12,marginBottom:12}}>{t(lang,"feel_"+session.feeling)}</div>}
        {session.notes&&<div style={{background:OFF,borderRadius:10,padding:"8px 12px",color:TEXT_S,fontSize:12,marginBottom:12,fontStyle:"italic"}}>"{session.notes}"</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          {[[t(lang,"score"),tot+" ("+(diff>=0?"+":"")+diff+")"],[t(lang,"putts"),putts],["FIR",fir+"/"+firH.length],["GIR",gir+"/"+holes.length],[t(lang,"threePutts"),threePutts],[t(lang,"upAndDown"),updownAttempts.length?updownSuccess.length+"/"+updownAttempts.length:"—"]].map(([l,v])=>(
            <div key={l} style={{background:OFF,borderRadius:12,padding:"11px 13px",textAlign:"center",border:"1px solid "+BORDER}}>
              <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>{l}</div>
              <div style={{color:NAVY,fontSize:20,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:"2px solid "+BORDER}}>
                {["#",t(lang,"par"),t(lang,"score"),t(lang,"putts"),"FIR","GIR",t(lang,"miss")].map(x=>(
                  <th key={x} style={{padding:"5px 3px",textAlign:"center",color:NAVY,fontWeight:700,fontSize:11}}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holes.map((h,i)=>{
                const r=(h.score||0)-(h.par||0);
                const sc=r<0?GREEN:r===0?TEXT:r===1?AMBER:RED;
                return (
                  <tr key={i} style={{background:i%2===0?WHITE:OFF}}>
                    <td style={{padding:"4px 3px",textAlign:"center",color:SLATE_L,fontSize:11}}>{i+1}</td>
                    <td style={{padding:"4px 3px",textAlign:"center",color:TEXT_S}}>{h.par}</td>
                    <td style={{padding:"4px 3px",textAlign:"center",color:sc,fontWeight:700}}>{h.score}</td>
                    <td style={{padding:"4px 3px",textAlign:"center"}}>{h.putts}</td>
                    <td style={{padding:"4px 3px",textAlign:"center",color:h.par>3?(h.fir?GREEN:RED):"#ccc"}}>{h.par>3?(h.fir?"v":"x"):"—"}</td>
                    <td style={{padding:"4px 3px",textAlign:"center",color:h.gir?GREEN:RED}}>{h.gir?"v":"x"}</td>
                    <td style={{padding:"4px 3px",textAlign:"center",color:RED,fontSize:10}}>{h.miss?t(lang,h.miss+"_dir"):"—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ScorecardEntry({holeCount, onSave, onCancel, lang, userId, presetCourse}){
  const [course,setCourse]=useState("");
  const [roundType,setRoundType]=useState("practice");
  const [showPicker,setShowPicker]=useState(false);
  const [showBrowser,setShowBrowser]=useState(false);
  const [feeling,setFeeling]=useState("");
  const [notes,setNotes]=useState("");
  // Default putts is 2 and default score matches default par (4) — which
  // mathematically REQUIRES gir:true (see isGirPossible / the upd() comment
  // below), not false. Starting these two fields out of sync with each
  // other was the actual root cause of a real bug: a player who accepted
  // the defaults for an ordinary 2-putt par (very common) got that hole
  // silently saved as a missed green, which also miscounted it as a
  // scrambling "up and down" it never was.
  const [holes,setHoles]=useState(
    Array.from({length:holeCount},(_,i)=>({hole:i+1,par:4,score:4,putts:2,fir:false,gir:isGirPossible(4,4,2),miss:""}))
  );
  const savedCourses = getSavedCourses(userId);
  const allCourses = [...savedCourses, ...COURSES];
  const matches = course.trim()
    ? allCourses.filter(c=>c.name.toLowerCase().includes(course.trim().toLowerCase())).slice(0,6)
    : [];

  function applyCourse(c){
    setCourse(c.name);
    setShowPicker(false);
    setShowBrowser(false);
    // Pre-fill every hole's score to match its par as a sensible starting
    // point — e.g. a par 3 starts at score 3, par 5 starts at score 5 — so
    // the player edits from a realistic baseline instead of a flat default.
    // Also recomputes gir here, not just score/par — otherwise a course
    // pick would silently leave whatever gir value the hole already had
    // (usually the false default), out of sync with the score it just set
    // for that hole, the same inconsistency described above on the initial
    // defaults.
    setHoles(prev=>prev.map((h,i)=>{
      const par = courseHole(c, i);
      return {...h, par, score: par, gir: isGirPossible(par, par, h.putts)};
    }));
  }

  // If the player tapped a course from the "Play here again" shortcut on
  // the Scorecard pick screen, apply it immediately on mount — same effect
  // as picking it manually, just skipping that step entirely.
  useEffect(()=>{
    if(presetCourse){
      const found = allCourses.find(c=>c.name===presetCourse);
      if(found) applyCourse(found);
      else setCourse(presetCourse); // fall back to just the name if not found in either list
    }
  },[]);

  function handleCourseBlur(){
    // If they typed a brand-new course name (not matched to anything known),
    // save it quietly to this profile so it's available next time.
    const typed=course.trim();
    if(typed && !allCourses.some(c=>c.name.toLowerCase()===typed.toLowerCase())){
      saveCourse(userId, {id:"u"+Date.now(), name:typed, country:"", holes:holes.map(h=>h.par)});
    }
  }
  const [girWarning,setGirWarning]=useState(null); // {i, type:"impossible"|"required"} for the hole currently showing a GIR contradiction warning
  function upd(i,k,v){
    setHoles(p=>p.map((h,x)=>{
      if(x!==i) return h;
      const updated={...h,[k]:v};
      // Whenever par, score, putts, or gir itself changes, re-check whether
      // the GIR checkbox is still consistent with the numbers. Given par,
      // score, and putts, GIR is not actually a free choice — it's fully
      // determined: score - putts equals par - 2 if and only if the green
      // was reached in regulation (see isGirPossible's comment for the
      // proof). So there are two ways the checkbox can end up wrong, and
      // both get corrected here, not just one:
      //  1. GIR checked when the numbers make it impossible (e.g. par 5,
      //     3 putts, score 5 — only 2 non-putting strokes when par-2=3 are
      //     needed). Un-checks it.
      //  2. GIR left/marked UNCHECKED when the numbers mean it MUST be true
      //     (e.g. par 4, 2 putts, score 4 — an ordinary par with a 2-putt,
      //     which is only possible if the green was hit in regulation).
      //     This is the far more common case in practice, since GIR
      //     defaults to false on every new hole, and it was previously not
      //     checked at all — meaning a completely normal 2-putt par was
      //     silently saved as a missed green, which then also counted it
      //     as a false "up and down" (isUpDownAttempt is true whenever
      //     gir===false), inflating that stat with holes that were never
      //     actually scrambled. Checks it for them instead.
      // Either way, a brief explanation is shown so the correction doesn't
      // look like the checkbox "isn't working."
      if(["par","score","putts","gir"].includes(k)){
        const possible = isGirPossible(updated.par, updated.score, updated.putts);
        if(updated.gir && !possible){
          setGirWarning({i, type:"impossible"});
          setTimeout(()=>setGirWarning(g=>g&&g.i===i?null:g),3500);
          return {...updated, gir:false};
        }
        if(!updated.gir && possible){
          setGirWarning({i, type:"required"});
          setTimeout(()=>setGirWarning(g=>g&&g.i===i?null:g),3500);
          return {...updated, gir:true};
        }
      }
      return updated;
    }));
  }
  const sel={width:"100%",background:OFF,border:"1.5px solid "+BORDER,borderRadius:10,color:TEXT,padding:"7px 8px",boxSizing:"border-box",fontSize:13,outline:"none"};
  return (
    <div>
      {showBrowser&&(
        <CourseBrowser userId={userId} lang={lang} onClose={()=>setShowBrowser(false)} onPick={applyCourse}/>
      )}
      <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
        <div style={{marginBottom:14}}>
          <label style={{color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>{t(lang,"roundType")}</label>
          <div style={{display:"flex",gap:8}}>
            {[["practice",t(lang,"roundTypePractice")],["competition",t(lang,"roundTypeCompetition")]].map(([k,l])=>(
              <button key={k} onClick={()=>setRoundType(k)}
                style={{flex:1,padding:"10px 8px",background:roundType===k?NAVY:OFF,border:"1.5px solid "+(roundType===k?NAVY:BORDER),borderRadius:12,color:roundType===k?WHITE:TEXT_S,fontWeight:roundType===k?700:500,fontSize:13,cursor:"pointer"}}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:12,position:"relative"}}>
          <label style={{color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>{t(lang,"golfCourse")}</label>
          <div style={{display:"flex",gap:8}}>
            <input value={course}
              onChange={e=>{setCourse(e.target.value);setShowPicker(true);}}
              onFocus={()=>setShowPicker(true)}
              onBlur={()=>{setTimeout(()=>setShowPicker(false),120); handleCourseBlur();}}
              placeholder={t(lang,"coursePh")}
              style={{flex:1,background:OFF,border:"1.5px solid "+BORDER,borderRadius:12,color:TEXT,padding:"11px 14px",boxSizing:"border-box",fontSize:14,outline:"none",fontFamily:"inherit"}}/>
            <button onClick={()=>setShowBrowser(true)} type="button"
              style={{background:NAVY,border:"none",borderRadius:12,color:WHITE,padding:"0 14px",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
              {t(lang,"browse")}
            </button>
          </div>
          {showPicker&&matches.length>0&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:WHITE,border:"1px solid "+BORDER,borderRadius:12,marginTop:4,boxShadow:"0 6px 20px rgba(0,0,0,0.12)",zIndex:20,overflow:"hidden"}}>
              {matches.map(c=>(
                <button key={c.id} onClick={()=>applyCourse(c)}
                  style={{display:"block",width:"100%",textAlign:"left",padding:"10px 14px",background:WHITE,border:"none",borderBottom:"1px solid "+BORDER,cursor:"pointer"}}>
                  <div style={{color:NAVY,fontSize:13,fontWeight:600}}>{c.name}</div>
                  <div style={{color:SLATE_L,fontSize:11}}>{c.country?c.country+" · ":""}{c.holes.length} {t(lang,"holes")}{savedCourses.includes(c)?" · "+t(lang,"savedCourse"):""}</div>
                </button>
              ))}
            </div>
          )}
          <div style={{color:SLATE_L,fontSize:11,marginTop:5}}>{t(lang,"courseAutoSaveHint")}</div>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:8}}>{t(lang,"feelToday")}</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {FEELING_KEYS.map(k=>(
              <button key={k} onClick={()=>setFeeling(k===feeling?"":k)}
                style={{padding:"6px 11px",background:feeling===k?NAVY:WHITE,border:"1px solid "+(feeling===k?NAVY:BORDER),borderRadius:20,color:feeling===k?WHITE:TEXT_S,fontSize:12,cursor:"pointer",fontWeight:feeling===k?700:400}}>
                {t(lang,"feel_"+k)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>{t(lang,"notesOptional")}</label>
          <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder={t(lang,"notesPh")} style={{width:"100%",background:OFF,border:"1.5px solid "+BORDER,borderRadius:12,color:TEXT,padding:"11px 14px",boxSizing:"border-box",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
        </div>
      </div>
      <div style={{marginBottom:12}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {holes.map((h,i)=>(
            <div key={i} style={{background:WHITE,borderRadius:14,padding:14,border:"1px solid "+BORDER}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{color:NAVY,fontWeight:700,fontSize:14}}>{t(lang,"hole")} {h.hole}</div>
                <div style={{display:"flex",gap:12}}>
                  {h.par>3&&(
                    <label style={{color:h.fir?GREEN:TEXT_S,fontSize:12,display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontWeight:h.fir?700:400}}>
                      <input type="checkbox" checked={h.fir} onChange={e=>upd(i,"fir",e.target.checked)}/> FIR
                    </label>
                  )}
                  <label style={{color:h.gir?GREEN:TEXT_S,fontSize:12,display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontWeight:h.gir?700:400}}>
                    <input type="checkbox" checked={h.gir} onChange={e=>upd(i,"gir",e.target.checked)}/> GIR
                  </label>
                </div>
              </div>
              {girWarning&&girWarning.i===i&&(
                <div style={{background:girWarning.type==="required"?"#fff8e6":"#fef0f0",border:"1px solid "+(girWarning.type==="required"?GOLD:RED)+"44",borderRadius:10,padding:"7px 10px",marginBottom:10,color:girWarning.type==="required"?"#8a6d1f":RED,fontSize:11,lineHeight:1.5}}>
                  {t(lang,girWarning.type==="required"?"girRequired":"girImpossible")}
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
                <div>
                  <div style={{color:SLATE,fontSize:10,fontWeight:600,marginBottom:3}}>{t(lang,"par")}</div>
                  <select value={h.par} onChange={e=>upd(i,"par",+e.target.value)} style={sel}>
                    {[3,4,5].map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{color:SLATE,fontSize:10,fontWeight:600,marginBottom:3}}>{t(lang,"score")}</div>
                  <select value={h.score} onChange={e=>upd(i,"score",+e.target.value)} style={sel}>
                    {[1,2,3,4,5,6,7,8,9].map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{color:SLATE,fontSize:10,fontWeight:600,marginBottom:3}}>{t(lang,"putts")}</div>
                  <select value={h.putts} onChange={e=>upd(i,"putts",+e.target.value)} style={sel}>
                    {[0,1,2,3,4].map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{color:SLATE,fontSize:10,fontWeight:600,marginBottom:3}}>{t(lang,"miss")}</div>
                  <select value={h.miss} onChange={e=>upd(i,"miss",e.target.value)} style={sel}>
                    <option value="">—</option>
                    {["left","right","short","long"].map(v=><option key={v} value={v}>{t(lang,v+"_dir")}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onCancel} style={{flex:1,padding:13,background:WHITE,border:"1px solid "+BORDER,borderRadius:14,color:TEXT_S,cursor:"pointer",fontSize:14,fontWeight:600}}>{t(lang,"cancel")}</button>
        <button onClick={()=>onSave(holes,course,feeling,notes,roundType)} style={{flex:2,padding:13,background:GREEN_GRAD,border:"none",borderRadius:14,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:14,boxShadow:"0 3px 12px rgba(58,125,74,0.3)"}}>{t(lang,"saveRound")}</button>
      </div>
    </div>
  );
}

function ScoreStepper({value, max, onChange}){
  const v = value===""?0:+value;
  function handleTyped(raw){
    if(raw===""){ onChange(""); return; }
    let n = parseInt(raw,10);
    if(isNaN(n)) return; // ignore non-numeric input entirely
    n = Math.max(0, Math.min(max, n)); // hard clamp — cannot exceed max or go below 0
    onChange(String(n));
  }
  return (
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <button onClick={()=>onChange(String(Math.max(0,v-1)))}
        style={{width:48,height:48,borderRadius:12,background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.25)",color:WHITE,fontSize:22,fontWeight:700,cursor:"pointer",flexShrink:0}}>
        −
      </button>
      <input type="number" inputMode="numeric" min={0} max={max} value={value} onChange={e=>handleTyped(e.target.value)}
        onBlur={()=>{ if(value!=="" && (+value>max || +value<0)) onChange(String(Math.max(0,Math.min(max,+value||0)))); }}
        placeholder="0"
        style={{flex:1,background:"rgba(255,255,255,0.1)",border:"2px solid rgba(255,255,255,0.2)",borderRadius:12,color:WHITE,fontSize:32,fontWeight:700,padding:"10px 8px",boxSizing:"border-box",outline:"none",fontFamily:"Georgia,serif",textAlign:"center",width:0}}/>
      <button onClick={()=>onChange(String(Math.min(max,v+1)))}
        style={{width:48,height:48,borderRadius:12,background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.25)",color:WHITE,fontSize:22,fontWeight:700,cursor:"pointer",flexShrink:0}}>
        +
      </button>
      <div style={{color:"rgba(255,255,255,0.45)",fontSize:11,fontWeight:600,flexShrink:0,minWidth:36}}>/ {max}</div>
    </div>
  );
}

function focusColors(id){
  if(id==="mental") return {grad:PURPLE_GRAD, bg:PURPLE_BG, solid:PURPLE};
  return {grad:GREEN_GRAD, bg:GREEN_BG, solid:GREEN};
}

// ═══════════════════════════════════════════════════════════════════════════
// FINISHER PLAYER — runs one finisher game, single or local multiplayer.
// Local multiplayer = one device, named players take turns entering scores
// for the same stations, compared at the end. No networking, fully honest
// about what this is.
// ═══════════════════════════════════════════════════════════════════════════
function FinisherGame({game, onSave, onExit, lang, accountName, units, pastSessions}){
  const [mode,setMode]=useState("setup"); // setup | playing | results
  const [players,setPlayers]=useState([{name:accountName||"Player 1", scores:{}, isAccount:true}]);
  const [activePlayer,setActivePlayer]=useState(0);
  const [stationIdx,setStationIdx]=useState(0);
  const resultsRef=useRef(null); // wraps the whole results screen for image export

  function addPlayer(){
    if(players.length>=6) return;
    setPlayers([...players, {name:"Player "+(players.length+1), scores:{}, isAccount:false}]);
  }
  function removePlayer(i){
    if(players.length<=1) return;
    if(players[i].isAccount) return; // can't remove yourself
    setPlayers(players.filter((_,idx)=>idx!==i));
  }
  function renamePlayer(i,name){
    if(players[i].isAccount) return; // your own name always matches your account
    setPlayers(players.map((p,idx)=>idx===i?{...p,name}:p));
  }
  function setScore(playerIdx, stationId, value){
    setPlayers(players.map((p,idx)=>idx===playerIdx?{...p,scores:{...p.scores,[stationId]:value}}:p));
  }
  function totalFor(player){
    return Object.values(player.scores).reduce((a,b)=>a+(Number(b)||0),0);
  }
  function finishGame(){
    const sessionId = "fs"+Date.now(); // shared by every player from this one playthrough
    players.forEach((p,idx)=>{
      const total=totalFor(p);
      // Save per-station breakdown (in station order) so a future session can
      // reconstruct this attempt's cumulative climb for comparison.
      const stationScores=game.stations.map(st=>Number(p.scores[st.id])||0);
      onSave({type:"finisher", sessionId, gameId:game.id, gameName:game.name, playerName:p.name, score:total, max:game.max, stationScores, multiplayer:players.length>1, isAccount:!!p.isAccount, ts:Date.now()+idx});
    });
    setMode("results");
  }

  const station = game.stations[stationIdx];
  const isMulti = players.length>1;
  // Has everyone entered a score for the CURRENT station yet?
  const allDoneAtStation = players.every(p=>p.scores[station.id]!==undefined);
  // Move to next player at this station, or signal the station itself is complete.
  function advanceAfterScore(){
    if(!isMulti){ return; } // single player: no hand-off needed
    if(activePlayer<players.length-1){
      setActivePlayer(activePlayer+1);
    }
    // if this was the last player, allDoneAtStation will now be true on next render
    // and the UI shows "Next Station" instead of advancing players further.
  }
  function goToStation(i){
    setStationIdx(i);
    setActivePlayer(0); // always start each station with player 1
  }

  if(mode==="setup") return (
    <div>
      <button onClick={onExit} style={{background:"none",border:"none",color:GREEN,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
        <div style={{fontSize:30}}>{game.emoji}</div>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>{txFin(lang,game.id,"name",game.name)}</div>
          <div style={{color:SLATE_L,fontSize:12}}>{t(lang,"outOf")} {game.max}</div>
        </div>
      </div>
      <p style={{color:TEXT_S,fontSize:13,lineHeight:1.6,margin:"10px 0 18px"}}>{cvt(txFin(lang,game.id,"intro",game.intro),units)}</p>

      <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"players")}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {players.map((p,i)=>(
          <div key={i} style={{display:"flex",gap:8,alignItems:"center"}}>
            {p.isAccount&&<span style={{fontSize:14}}>👤</span>}
            <input value={p.name} onChange={e=>renamePlayer(i,e.target.value)} disabled={p.isAccount}
              style={{flex:1,background:p.isAccount?GREEN_BG:WHITE,border:"1.5px solid "+(p.isAccount?GREEN+"55":BORDER),borderRadius:10,color:TEXT,padding:"9px 12px",fontSize:13,outline:"none",fontWeight:p.isAccount?700:400}}/>
            {players.length>1&&!p.isAccount&&<button onClick={()=>removePlayer(i)} style={{background:"none",border:"none",color:SLATE_L,cursor:"pointer",fontSize:16,padding:6}}>🗑</button>}
          </div>
        ))}
        {players.length<6&&(
          <button onClick={addPlayer} style={{padding:10,background:WHITE,border:"1.5px dashed "+BORDER,borderRadius:10,color:GREEN,fontWeight:700,fontSize:12,cursor:"pointer"}}>
            + {t(lang,"addPlayer")}
          </button>
        )}
      </div>
      {players.length>1&&(
        <div style={{background:GREEN_BG,borderRadius:12,padding:"10px 14px",fontSize:12,color:GREEN,marginBottom:16}}>
          {t(lang,"localMultiplayerNote")}
        </div>
      )}
      <button onClick={()=>setMode("playing")} style={{width:"100%",padding:15,background:GOLD_BG,border:"none",borderRadius:14,color:NAVY,fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 4px 16px rgba(232,184,75,0.35)"}}>
        {t(lang,"startFinisher")} →
      </button>
    </div>
  );

  if(mode==="playing") return (
    <div>
      <button onClick={()=>setMode("setup")} style={{background:"none",border:"none",color:GREEN,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>

      {isMulti&&(
        <div style={{display:"flex",gap:6,marginBottom:10,overflowX:"auto",paddingBottom:2}}>
          {players.map((p,i)=>{
            const done=p.scores[station.id]!==undefined;
            const isTurn=i===activePlayer && !allDoneAtStation;
            return (
              <div key={i}
                style={{padding:"7px 13px",background:isTurn?NAVY:(done?GREEN_BG:WHITE),border:"1.5px solid "+(isTurn?NAVY:(done?GREEN:BORDER)),borderRadius:20,color:isTurn?WHITE:(done?GREEN:TEXT_S),fontSize:12,fontWeight:700,whiteSpace:"nowrap",flexShrink:0,display:"flex",alignItems:"center",gap:5}}>
                {done&&!isTurn&&<span style={{fontSize:11}}>✓</span>}
                {p.name}
              </div>
            );
          })}
        </div>
      )}
      {isMulti&&!allDoneAtStation&&(
        <div style={{background:GOLD_BG,borderRadius:10,padding:"8px 12px",marginBottom:14,fontSize:12,color:NAVY,fontWeight:700,textAlign:"center"}}>
          {t(lang,"handPhoneTo")} {players[activePlayer].name}
        </div>
      )}

      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {game.stations.map((s,i)=>{
          const groupDone=players.every(p=>p.scores[s.id]!==undefined);
          return (
            <div key={s.id} onClick={()=>groupDone&&goToStation(i)}
              style={{flex:1,height:6,borderRadius:4,background:i===stationIdx?GOLD:(groupDone?GREEN:BORDER),cursor:groupDone?"pointer":"default"}}/>
          );
        })}
      </div>

      <div style={{borderRadius:16,marginBottom:14,border:"1px solid "+BORDER,overflow:"hidden"}}>
        <ExercisePhoto exercise={{id:"finisher_"+game.id+"_"+station.id, name:txFin(lang,station.id,"name",station.name), desc:txFin(lang,station.id,"desc",station.desc)}} pattern={station.pattern||"generic"}/>
      </div>
      <div style={{background:WHITE,borderRadius:18,padding:18,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:42,height:42,background:GREEN_BG,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{station.emoji}</div>
          <div>
            <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>{txFin(lang,station.id,"name",station.name)}</div>
            <div style={{color:SLATE_L,fontSize:11}}>{t(lang,"station")} {stationIdx+1} {t(lang,"outOf")} {game.stations.length}</div>
          </div>
        </div>
        <p style={{color:TEXT_S,fontSize:13,lineHeight:1.6,margin:"0 0 10px"}}>{cvt(txFin(lang,station.id,"desc",station.desc),units)}</p>
        {station.why&&(
          <div style={{background:OFF,borderRadius:12,padding:"10px 14px",marginBottom:10,border:"1px solid "+BORDER}}>
            <div style={{color:SLATE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{t(lang,"howWhy")}</div>
            <div style={{color:TEXT_S,fontSize:12,lineHeight:1.6}}>{cvt(txFin(lang,station.id,"why",station.why),units)}</div>
          </div>
        )}
        {game.scoringNote&&<div style={{color:SLATE_L,fontSize:11,fontStyle:"italic",marginBottom:4}}>{cvt(txFin(lang,game.id,"scoringNote",game.scoringNote),units)}</div>}
      </div>

      <div style={{background:HEADER_BG,borderRadius:18,padding:18}}>
        <label style={{color:"rgba(255,255,255,0.6)",fontSize:12,display:"block",marginBottom:10,fontWeight:600}}>
          {isMulti?players[activePlayer].name+" — ":""}{t(lang,"scoreForStation")} ({t(lang,"outOf")} {station.max})
        </label>
        <ScoreStepper value={String(players[activePlayer].scores[station.id]??"")} max={station.max}
          onChange={v=>setScore(activePlayer,station.id,v)}/>
        <div style={{display:"flex",gap:10,marginTop:14}}>
          {isMulti&&!allDoneAtStation?(
            <button onClick={advanceAfterScore} disabled={players[activePlayer].scores[station.id]===undefined}
              style={{flex:1,padding:13,background:players[activePlayer].scores[station.id]===undefined?"rgba(255,255,255,0.15)":GOLD_BG,border:"none",borderRadius:12,color:players[activePlayer].scores[station.id]===undefined?"rgba(255,255,255,0.5)":NAVY,fontWeight:800,cursor:players[activePlayer].scores[station.id]===undefined?"default":"pointer",fontSize:13}}>
              {activePlayer<players.length-1?t(lang,"nextPlayer")+" →":t(lang,"continue")+" →"}
            </button>
          ):(
            <>
              {stationIdx>0&&(
                <button onClick={()=>goToStation(stationIdx-1)} style={{flex:1,padding:13,background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.25)",borderRadius:12,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:13}}>
                ← {t(lang,"prevStation")}
                </button>
              )}
              {stationIdx<game.stations.length-1?(
                <button onClick={()=>goToStation(stationIdx+1)} style={{flex:2,padding:13,background:GOLD_BG,border:"none",borderRadius:12,color:NAVY,fontWeight:800,cursor:"pointer",fontSize:13}}>
                  {t(lang,"nextStation")} →
                </button>
              ):(
                <button onClick={finishGame} style={{flex:2,padding:13,background:GOLD_BG,border:"none",borderRadius:12,color:NAVY,fontWeight:800,cursor:"pointer",fontSize:13}}>
                  {t(lang,"finishGame")} 🏆
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  if(mode==="results"){
    const ranked=[...players].map(p=>({...p,total:totalFor(p)})).sort((a,b)=>b.total-a.total);
    const PLAYER_COLORS=[NAVY,"#c0392b",GREEN,"#7c5cbf","#e8783c","#3a9bb5"];
    const maxPerStation=game.stations.map(st=>st.max!==undefined?st.max:(st.ptsPerSuccess?st.ptsPerSuccess*st.attempts:(game.perStationMax||20)));
    // Evolution: this account holder's past totals for this exact Finisher game, oldest->newest.
    const accountHistory=(pastSessions||[])
      .filter(s=>s.type==="finisher"&&s.gameId===game.id&&s.isAccount)
      .sort((a,b)=>a.ts-b.ts)
      .map(s=>Math.round((s.score/s.max)*100));
    const accountPlayer=ranked.find(p=>p.isAccount);
    const accountPctNow=accountPlayer?Math.round((accountPlayer.total/game.max)*100):null;
    const evolutionData=accountPctNow!==null?[...accountHistory,accountPctNow]:accountHistory;

    // Cumulative running-total chart: how the score built up station by station.
    // Helper: turn a per-station score array into a running-total series, with
    // an extra leading 0 so the line visibly starts from zero before station 1.
    function toCumulative(stationScores){
      let sum=0;
      return [0, ...stationScores.map(v=>{ sum+=(Number(v)||0); return sum; })];
    }
    let cumulativeSeries=[];
    if(isMulti){
      // One line per player who just played, compared against each other.
      cumulativeSeries=players.map((p,i)=>({
        label:p.name,
        color:PLAYER_COLORS[i%PLAYER_COLORS.length],
        dashed:false,
        cumValues:toCumulative(game.stations.map(st=>p.scores[st.id])),
      }));
    } else if(accountPlayer){
      // Solo: today's run vs. the best-ever previous attempt at this game.
      const pastAttempts=(pastSessions||[]).filter(s=>s.type==="finisher"&&s.gameId===game.id&&s.isAccount&&Array.isArray(s.stationScores));
      const best=pastAttempts.sort((a,b)=>b.score-a.score)[0];
      cumulativeSeries=[
        {label:t(lang,"today"), color:GREEN, dashed:false, cumValues:toCumulative(game.stations.map(st=>accountPlayer.scores[st.id]))},
      ];
      if(best){
        cumulativeSeries.push({label:t(lang,"bestPrevious"), color:SLATE_L, dashed:true, cumValues:toCumulative(best.stationScores)});
      }
    }
    return (
      <>
      <div ref={resultsRef} style={{background:OFF,padding:2}}>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:48,marginBottom:8}}>{game.emoji}</div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>{txFin(lang,game.id,"name",game.name)}</div>
          <div style={{color:SLATE_L,fontSize:12,marginTop:2}}>{txFin(lang,game.id,"resultLabel",game.resultLabel)}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
          {ranked.map((p,i)=>{
            const pct=Math.round((p.total/game.max)*100);
            const grade=gradeFinisher(pct);
            return (
              <div key={i} style={{background:WHITE,borderRadius:16,padding:"16px 18px",border:"1px solid "+BORDER,boxShadow:i===0?"0 4px 18px rgba(232,184,75,0.25)":"0 1px 8px rgba(0,0,0,0.04)",borderColor:i===0?GOLD:BORDER}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    {i===0&&isMulti&&<span style={{fontSize:18}}>🏆</span>}
                    <div>
                      <div style={{color:NAVY,fontWeight:700,fontSize:15}}>{p.name}</div>
                      <div style={{color:grade.color,fontSize:11,fontWeight:700}}>{grade.label}</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:NAVY,fontSize:28,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif",lineHeight:1}}>{p.total}</div>
                    <div style={{color:SLATE_L,fontSize:11}}>/{game.max} · {pct}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Running total — how the score builds station by station, compared
            either against other players today, or your own best previous attempt */}
        {cumulativeSeries.length>0&&(
          <div style={{background:WHITE,borderRadius:18,padding:16,marginBottom:16,border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
            <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{t(lang,"runningTotal")}</div>
            <ExpandableChart title={t(lang,"runningTotal")} lang={lang}>
              <CumulativeLineChart series={cumulativeSeries} gameMax={game.max} stationCount={game.stations.length}/>
            </ExpandableChart>
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10,justifyContent:"center"}}>
              {cumulativeSeries.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:14,height:0,borderTop:"2.5px "+(s.dashed?"dashed":"solid")+" "+s.color}}/>
                  <span style={{color:TEXT_S,fontSize:11,fontWeight:600}}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Station-by-station comparison — works for 1 or many players */}
        <div style={{background:WHITE,borderRadius:18,padding:16,marginBottom:16,border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{t(lang,"byStation")}</div>
          <ExpandableChart title={t(lang,"byStation")} lang={lang}>
            <GroupedBarChart stations={game.stations} players={players} colors={PLAYER_COLORS} maxPerStation={maxPerStation} lang={lang}/>
          </ExpandableChart>
          {isMulti&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10,justifyContent:"center"}}>
              {players.map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:9,height:9,borderRadius:2,background:PLAYER_COLORS[i%PLAYER_COLORS.length]}}/>
                  <span style={{color:TEXT_S,fontSize:11,fontWeight:600}}>{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evolution — account holder's history at this game, if they've played it before */}
        {evolutionData.length>1&&(
          <div style={{background:WHITE,borderRadius:18,padding:16,marginBottom:18,border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
            <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{t(lang,"yourEvolution")}</div>
            <ExpandableChart title={t(lang,"yourEvolution")} lang={lang}>
              <div style={{display:"flex",gap:8}}>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",fontSize:9,color:SLATE_L,fontWeight:600,paddingBottom:3}}>
                  <span>100</span><span>50</span><span>0</span>
                </div>
                <div style={{flex:1}}><Sparkline data={evolutionData} color={GREEN} h={60} fixedScale/></div>
              </div>
            </ExpandableChart>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <span style={{color:SLATE_L,fontSize:11}}>{t(lang,"first")}: {evolutionData[0]}%</span>
              <span style={{color:GREEN,fontSize:11,fontWeight:700}}>{evolutionData.length} {t(lang,"sessionsCount2")}</span>
              <span style={{color:NAVY,fontSize:11,fontWeight:700}}>{t(lang,"last")}: {evolutionData[evolutionData.length-1]}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons live OUTSIDE the captured area — exporting the results
          shouldn't include the export/share/done buttons themselves. */}
      <ExportImageButton targetRef={resultsRef} fileName={"caddy-"+game.id+"-"+Date.now()} lang={lang}/>
      <ShareResultButton lang={lang} title={txFin(lang,game.id,"name",game.name)}
        text={ranked.map((p,i)=>(i+1)+". "+p.name+" — "+p.total+"/"+game.max).join("\n")}/>
      <button onClick={onExit} style={{width:"100%",marginTop:10,padding:14,background:HEADER_BG,border:"none",borderRadius:14,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:14}}>
        {t(lang,"done")}
      </button>
      </>
    );
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARE RESULT — uses native share sheet if available, falls back to clipboard.
// ═══════════════════════════════════════════════════════════════════════════
function ShareResultButton({title, text, lang}){
  const [copied,setCopied]=useState(false);
  async function doShare(){
    const shareData={title:"Caddy — "+title, text};
    if(navigator.share){
      try{ await navigator.share(shareData); return; }catch(e){ /* user cancelled or unsupported, fall through */ }
    }
    try{
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(()=>setCopied(false),2000);
    }catch(e){}
  }
  return (
    <button onClick={doShare} style={{width:"100%",padding:14,background:copied?GREEN_GRAD:WHITE,border:copied?"none":"1.5px solid "+BORDER,borderRadius:14,color:copied?WHITE:NAVY,fontWeight:700,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
    {copied?("✓ "+t(lang,"copied")):("📤 "+t(lang,"shareResult"))}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE EXPORT — captures an entire results screen (charts, totals, everything
// visible) as a real PNG, using html-to-image loaded from CDN on demand. This
// avoids any external API call (no AI generation risk) — it just renders what
// the browser already drew, so it's far more reliable than the photo-gen bet.
// Falls back to a friendly message if the library fails to load or capture
// fails for any reason; never breaks the surrounding screen.
// ═══════════════════════════════════════════════════════════════════════════
let _htmlToImagePromise=null;
function loadHtmlToImage(){
  if(window.htmlToImage) return Promise.resolve(window.htmlToImage);
  if(_htmlToImagePromise) return _htmlToImagePromise;
  _htmlToImagePromise=new Promise((resolve,reject)=>{
    const script=document.createElement("script");
    script.src="https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js";
    script.onload=()=>resolve(window.htmlToImage);
    script.onerror=()=>reject(new Error("failed to load html-to-image"));
    document.head.appendChild(script);
  });
  return _htmlToImagePromise;
}

function ExportImageButton({targetRef, fileName, lang}){
  const [state,setState]=useState("idle"); // idle | working | done | failed
  async function doExport(){
    if(!targetRef.current) return;
    setState("working");
    try{
      const htmlToImage=await loadHtmlToImage();
      const dataUrl=await htmlToImage.toPng(targetRef.current,{backgroundColor:OFF,pixelRatio:2});
      // Try native share with the image file first (best on mobile); fall back to download.
      const blob=await (await fetch(dataUrl)).blob();
      const file=new File([blob],fileName+".png",{type:"image/png"});
      if(navigator.canShare && navigator.canShare({files:[file]})){
        await navigator.share({files:[file], title:"Caddy"});
      }else{
        const link=document.createElement("a");
        link.href=dataUrl;
        link.download=fileName+".png";
        link.click();
      }
      setState("done");
      setTimeout(()=>setState("idle"),2000);
    }catch(e){
      setState("failed");
      setTimeout(()=>setState("idle"),2500);
    }
  }
  return (
    <button onClick={doExport} disabled={state==="working"}
      style={{width:"100%",padding:14,background:state==="done"?GREEN_GRAD:(state==="failed"?"#fef0f0":WHITE),border:state==="done"?"none":"1.5px solid "+(state==="failed"?"#e8b0b0":BORDER),borderRadius:14,color:state==="done"?WHITE:(state==="failed"?RED:NAVY),fontWeight:700,cursor:state==="working"?"default":"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
      {state==="working"&&(t(lang,"exporting")+"…")}
      {state==="done"&&("✓ "+t(lang,"exported"))}
      {state==="failed"&&("⚠ "+t(lang,"exportFailed"))}
      {state==="idle"&&("🖼 "+t(lang,"exportImage"))}
    </button>
  );
}

// ── PLAN BUILDER ──────────────────────────────────────────────────────────
// A simple ordered queue of upcoming sessions. No specific days — just a list
// the player builds ahead of time and works through in order, whenever they train.
function PlanBuilder({plan, onSavePlan, lang, onClose, onStartItem}){
  const [adding,setAdding]=useState(false);
  const [pickFocus,setPickFocus]=useState(null);

  function addItem(focusId, ex){
    const item={id:"plan"+Date.now(), focusId, exId:ex.id, exName:ex.name, exEmoji:ex.emoji, exDifficulty:ex.difficulty, exDuration:ex.duration};
    onSavePlan([...plan, item]);
    setAdding(false); setPickFocus(null);
  }
  function removeItem(id){ onSavePlan(plan.filter(p=>p.id!==id)); }
  function moveItem(idx, dir){
    const ni=idx+dir;
    if(ni<0||ni>=plan.length) return;
    const copy=[...plan];
    [copy[idx],copy[ni]]=[copy[ni],copy[idx]];
    onSavePlan(copy);
  }

  if(adding && !pickFocus) return (
    <div>
      <button onClick={()=>setAdding(false)} style={{background:"none",border:"none",color:GREEN,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
      <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:14}}>{t(lang,"addToPlan")}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {FOCUS_AREAS.map(f=>{
          const fc=focusColors(f.id);
          return (
            <button key={f.id} onClick={()=>setPickFocus(f)}
              style={{background:WHITE,border:"1.5px solid "+BORDER,borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:14,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
              <div style={{width:42,height:42,background:fc.bg,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{f.emoji}</div>
              <div style={{color:NAVY,fontWeight:700,fontSize:14}}>{f.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  if(adding && pickFocus) return (
    <div>
      <button onClick={()=>setPickFocus(null)} style={{background:"none",border:"none",color:GREEN,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
      <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,marginBottom:14}}>{pickFocus.emoji} {pickFocus.label}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {EXERCISES[pickFocus.id].map(ex=>{
          const [bgD,txD]=badge(ex.difficulty);
          return (
            <button key={ex.id} onClick={()=>addItem(pickFocus.id,ex)}
              style={{background:WHITE,border:"1.5px solid "+BORDER,borderRadius:14,padding:"12px 14px",cursor:"pointer",textAlign:"left",boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:NAVY,fontWeight:700,fontSize:13}}>{ex.emoji} {tx(lang,ex.id,"name",ex.name)}</span>
                <span style={{background:bgD,color:txD,fontSize:10,fontWeight:700,borderRadius:20,padding:"2px 8px"}}>{t(lang,"diff_"+ex.difficulty)}</span>
              </div>
              <div style={{color:SLATE_L,fontSize:11,marginTop:3}}>⏱ {ex.duration} {t(lang,"min")}</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>{t(lang,"myPlan")}</div>
          <div style={{color:SLATE_L,fontSize:13,marginTop:3}}>{t(lang,"planSub")}</div>
        </div>
        <button onClick={onClose} style={{background:WHITE,border:"1px solid "+BORDER,color:SLATE,borderRadius:10,padding:"6px 12px",fontSize:12,cursor:"pointer",fontWeight:600}}>{t(lang,"done")}</button>
      </div>

      {plan.length===0 ? (
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:44,opacity:0.2,marginBottom:12}}>📝</div>
          <div style={{color:SLATE_L,fontSize:13,marginBottom:20}}>{t(lang,"planEmpty")}</div>
          <button onClick={()=>setAdding(true)} style={{padding:"12px 24px",background:HEADER_BG,border:"none",borderRadius:14,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:14}}>
            + {t(lang,"addSession")}
          </button>
        </div>
      ) : (
        <>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {plan.map((item,idx)=>{
              const fc=focusColors(item.focusId);
              const f=FOCUS_AREAS.find(x=>x.id===item.focusId);
              return (
                <div key={item.id} style={{background:WHITE,borderRadius:14,padding:"12px 14px",border:"1px solid "+BORDER,boxShadow:"0 1px 6px rgba(0,0,0,0.04)",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:idx===0?GOLD_BG:OFF,color:idx===0?NAVY:SLATE_L,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>
                    {idx+1}
                  </div>
                  <div style={{width:38,height:38,background:fc.bg,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{item.exEmoji}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:NAVY,fontWeight:700,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{tx(lang,item.exId,"name",item.exName)}</div>
                    <div style={{color:SLATE_L,fontSize:11}}>{f?.label} · {item.exDuration} {t(lang,"min")}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    <button onClick={()=>moveItem(idx,-1)} disabled={idx===0} style={{background:"none",border:"none",color:idx===0?BORDER:SLATE_L,cursor:idx===0?"default":"pointer",fontSize:12,padding:2}}>▲</button>
                    <button onClick={()=>moveItem(idx,1)} disabled={idx===plan.length-1} style={{background:"none",border:"none",color:idx===plan.length-1?BORDER:SLATE_L,cursor:idx===plan.length-1?"default":"pointer",fontSize:12,padding:2}}>▼</button>
                  </div>
                  <button onClick={()=>removeItem(item.id)} style={{background:"none",border:"none",color:SLATE_L,cursor:"pointer",fontSize:15,padding:4}}>🗑</button>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setAdding(true)} style={{flex:1,padding:13,background:WHITE,border:"1.5px solid "+BORDER,borderRadius:14,color:NAVY,fontWeight:700,cursor:"pointer",fontSize:13}}>
              + {t(lang,"addSession")}
            </button>
            <button onClick={()=>onStartItem(plan[0])} style={{flex:1,padding:13,background:GOLD_BG,border:"none",borderRadius:14,color:NAVY,fontWeight:800,cursor:"pointer",fontSize:13,boxShadow:"0 3px 12px rgba(232,184,75,0.3)"}}>
              {t(lang,"startNext")} →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function TrainTab({sessions, onSave, settings, userId, accountName, hand}){
  const [step,setStep]=useState("focus");
  const [focus,setFocus]=useState(null);
  const [dur,setDur]=useState(null);
  const [list,setList]=useState([]);
  const [ex,setEx]=useState(null);
  const [score,setScore]=useState("");
  const [plan,setPlan]=useState(()=>getPlan(userId));
  const [activeFinisher,setActiveFinisher]=useState(null);
  const [activeProgram,setActiveProgram]=useState(null);
  const [programStepIdx,setProgramStepIdx]=useState(0);
  const [programScores,setProgramScores]=useState([]); // one entry per completed step: {exId, focusId, score, max}
  const units=settings?.units||"imperial";
  const lang=settings?.language||"en";

  // Advances to the next step of the active program, or finishes the program
  // and saves ONE combined result (like a Finisher game) once every step is
  // done — rather than leaving behind several disconnected exercise entries.
  function advanceProgram(stepScore){
    if(!activeProgram) return;
    const completedStep = activeProgram.steps[programStepIdx];
    const completedEx = EXERCISES[completedStep.focusId].find(x=>x.id===completedStep.exId);
    const updatedScores = [...programScores, {exId:completedStep.exId, focusId:completedStep.focusId, score:stepScore, max:completedEx.max}];
    setProgramScores(updatedScores);

    if(programStepIdx < activeProgram.steps.length-1){
      setProgramStepIdx(programStepIdx+1);
      const nextStep = activeProgram.steps[programStepIdx+1];
      const nextEx = EXERCISES[nextStep.focusId].find(x=>x.id===nextStep.exId);
      const nextFocus = FOCUS_AREAS.find(x=>x.id===nextStep.focusId);
      setFocus(nextFocus); setEx(nextEx); setScore(""); setStep("active");
    } else {
      // Last step just completed — save one combined program session.
      const totalScore = updatedScores.reduce((a,s)=>a+s.score,0);
      const totalMax = updatedScores.reduce((a,s)=>a+s.max,0);
      onSave({type:"program", programId:activeProgram.id, programName:activeProgram.name, score:totalScore, max:totalMax, stepScores:updatedScores, ts:Date.now()});
      setStep("programDone");
    }
  }
  function startProgram(program){
    const firstStep = program.steps[0];
    const firstEx = EXERCISES[firstStep.focusId].find(x=>x.id===firstStep.exId);
    const firstFocus = FOCUS_AREAS.find(x=>x.id===firstStep.focusId);
    setActiveProgram(program); setProgramStepIdx(0); setProgramScores([]);
    setFocus(firstFocus); setEx(firstEx); setScore(""); setStep("active");
  }

  function updatePlan(newPlan){ setPlan(newPlan); savePlan(userId,newPlan); }
  function startPlanItem(item){
    const f=FOCUS_AREAS.find(x=>x.id===item.focusId);
    const exDef=EXERCISES[item.focusId].find(x=>x.id===item.exId);
    if(!f||!exDef) return;
    setFocus(f); setEx(exDef); setStep("active");
    // remove this item from the plan once started, since it's now "in progress"
    updatePlan(plan.filter(p=>p.id!==item.id));
  }

  // sessions array is newest-first (new entries are prepended) — sort to
  // oldest-first here so every consumer can safely use [0]=first, [length-1]=most recent.
  function pastFor(id){ return sessions.filter(s=>s.type==="train"&&s.exId===id).sort((a,b)=>a.ts-b.ts); }

  if(step==="plan") return (
    <PlanBuilder plan={plan} onSavePlan={updatePlan} lang={lang} onClose={()=>setStep("focus")} onStartItem={startPlanItem}/>
  );

  if(step==="finisherPlay"&&activeFinisher) return (
    <FinisherGame game={activeFinisher} lang={lang} accountName={accountName} units={units} pastSessions={sessions}
      onSave={(s)=>onSave(s)}
      onExit={()=>{setActiveFinisher(null);setStep("focus");}}/>
  );

  if(step==="programIntro"&&activeProgram) return (
    <div>
      <button onClick={()=>{setActiveProgram(null);setStep("focus");}} style={{background:"none",border:"none",color:PURPLE,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:44,marginBottom:8}}>{activeProgram.emoji}</div>
        <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>{t(lang,"prog_"+activeProgram.id+"_name")}</div>
        <div style={{color:SLATE_L,fontSize:12,marginTop:4}}>{activeProgram.steps.length} {t(lang,"steps")} · ~{activeProgram.duration} {t(lang,"min")}</div>
      </div>
      <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
        <p style={{color:TEXT_S,fontSize:13,lineHeight:1.65,margin:0}}>{t(lang,"prog_"+activeProgram.id+"_desc")}</p>
      </div>
      {activeProgram.rightHandedOnly&&(
        <div style={{background:"#fff8e6",borderRadius:12,padding:"10px 14px",marginBottom:14,border:"1px solid "+GOLD+"55",display:"flex",gap:8,alignItems:"flex-start"}}>
          <span style={{fontSize:14}}>⚠️</span>
          <span style={{color:NAVY,fontSize:12,lineHeight:1.5}}>{t(lang,"rightHandedNote")}</span>
        </div>
      )}
      <div style={{background:PURPLE_BG,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+PURPLE+"33"}}>
        <div style={{color:PURPLE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{t(lang,"theTechnique")}</div>
        <p style={{color:NAVY,fontSize:13,lineHeight:1.6,margin:"0 0 12px",fontWeight:600}}>{t(lang,"prog_"+activeProgram.id+"_technical")}</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {(activeProgram.techniqueKeys||[]).map((tk,i)=>{
            // If the player is left-handed and a mirrored version of this
            // specific step exists, use it — otherwise fall back to the
            // standard (right-handed-written) text, which is handedness-neutral
            // for steps that don't reference a left/right direction at all.
            const mirroredKey = tk+"_left";
            const useKey = (hand==="Left" && t(lang,mirroredKey)!==mirroredKey) ? mirroredKey : tk;
            return (
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:PURPLE,color:WHITE,fontSize:10,fontWeight:700,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>{i+1}</div>
                <span style={{color:TEXT,fontSize:13,lineHeight:1.5}}>{cvt(t(lang,useKey),units)}</span>
              </div>
            );
          })}
        </div>
      </div>
      {activeProgram.videoUrl&&(
        <a href={activeProgram.videoUrl} target="_blank" rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",gap:10,background:WHITE,borderRadius:14,padding:"12px 14px",marginBottom:18,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)",textDecoration:"none"}}>
          <div style={{width:36,height:36,borderRadius:10,background:"#fdeaea",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>▶️</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:SLATE_L,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>{t(lang,"watchVideo")}</div>
            <div style={{color:NAVY,fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{activeProgram.videoTitle}</div>
          </div>
          <span style={{color:SLATE_L,fontSize:13}}>↗</span>
        </a>
      )}
      <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"programSteps")}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
        {activeProgram.steps.map((s,i)=>{
          const exDef=EXERCISES[s.focusId].find(x=>x.id===s.exId);
          const f=FOCUS_AREAS.find(x=>x.id===s.focusId);
          if(!exDef) return null;
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:WHITE,borderRadius:12,padding:"10px 14px",border:"1px solid "+BORDER}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:PURPLE_BG,color:PURPLE,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
              <span style={{fontSize:16}}>{exDef.emoji}</span>
              <div style={{flex:1}}>
                <div style={{color:NAVY,fontSize:13,fontWeight:600}}>{tx(lang,exDef.id,"name",exDef.name)}</div>
                <div style={{color:SLATE_L,fontSize:11}}>{f?.emoji} {f?.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={()=>startProgram(activeProgram)} style={{width:"100%",padding:16,background:PURPLE_GRAD,border:"none",borderRadius:16,color:WHITE,fontWeight:800,fontSize:16,cursor:"pointer",boxShadow:"0 4px 18px rgba(124,92,191,0.3)"}}>
        {t(lang,"startProgram")} →
      </button>
    </div>
  );

  if(step==="programDone"&&activeProgram) return (
    <div>
      <div style={{textAlign:"center",padding:"10px 0 20px"}}>
        <div style={{width:88,height:88,background:PURPLE_BG,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,margin:"0 auto 16px",border:"2px solid "+PURPLE+"33"}}>{activeProgram.emoji}</div>
        <div style={{color:PURPLE,fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,marginBottom:6}}>{t(lang,"programComplete")}</div>
        <div style={{color:SLATE_L,fontSize:13,marginBottom:18}}>{t(lang,"prog_"+activeProgram.id+"_name")}</div>
        {(()=>{
          const totalScore = programScores.reduce((a,s)=>a+s.score,0);
          const totalMax = programScores.reduce((a,s)=>a+s.max,0);
          const pct = totalMax?Math.round((totalScore/totalMax)*100):0;
          return (
            <div style={{display:"inline-block",background:WHITE,borderRadius:18,padding:"18px 28px",border:"1px solid "+BORDER,boxShadow:"0 2px 14px rgba(0,0,0,0.06)"}}>
              <div style={{color:NAVY,fontSize:38,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif",lineHeight:1}}>{totalScore}<span style={{fontSize:15,color:SLATE_L}}>/{totalMax}</span></div>
              <div style={{color:PURPLE,fontSize:13,fontWeight:700,marginTop:4}}>{pct}% · {t(lang,"totalResult")}</div>
            </div>
          );
        })()}
      </div>
      <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"byExercise")}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
        {programScores.map((s,i)=>{
          const exDef=EXERCISES[s.focusId].find(x=>x.id===s.exId);
          const pct = s.max?Math.round((s.score/s.max)*100):0;
          return (
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:WHITE,borderRadius:12,padding:"10px 14px",border:"1px solid "+BORDER}}>
              <span style={{fontSize:16}}>{exDef?.emoji}</span>
              <span style={{color:TEXT,fontSize:12,flex:1}}>{exDef?tx(lang,exDef.id,"name",exDef.name):s.exId}</span>
              <div style={{background:BORDER,borderRadius:6,height:6,width:60,overflow:"hidden"}}>
                <div style={{height:"100%",width:pct+"%",background:pct>=80?GREEN:pct>=50?AMBER:RED,borderRadius:6}}/>
              </div>
              <span style={{color:NAVY,fontSize:12,fontWeight:700,minWidth:38,textAlign:"right"}}>{s.score}/{s.max}</span>
            </div>
          );
        })}
      </div>
      <button onClick={()=>{setActiveProgram(null);setProgramStepIdx(0);setProgramScores([]);setFocus(null);setEx(null);setScore("");setStep("focus");}}
        style={{width:"100%",padding:14,background:HEADER_BG,border:"none",borderRadius:14,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:15,boxShadow:"0 4px 16px rgba(26,47,74,0.2)"}}>
        {t(lang,"done")}
      </button>
    </div>
  );

  if(step==="focus") return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:24,fontWeight:700}}>{t(lang,"train")}</div>
          <div style={{color:SLATE_L,fontSize:13,marginTop:3}}>{t(lang,"chooseFocus")}</div>
        </div>
        <button onClick={()=>setStep("plan")} style={{background:plan.length>0?GOLD_BG:WHITE,border:plan.length>0?"none":"1.5px solid "+BORDER,borderRadius:12,padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:plan.length>0?"0 2px 8px rgba(232,184,75,0.3)":"none"}}>
          <span style={{fontSize:14}}>📝</span>
          <span style={{color:plan.length>0?NAVY:TEXT_S,fontSize:12,fontWeight:700}}>{t(lang,"myPlan")}{plan.length>0?" ("+plan.length+")":""}</span>
        </button>
      </div>
      {plan.length>0&&(
        <button onClick={()=>startPlanItem(plan[0])}
          style={{width:"100%",background:HEADER_BG,border:"none",borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,marginBottom:16,boxShadow:"0 3px 14px rgba(26,47,74,0.2)"}}>
          <div style={{width:40,height:40,background:"rgba(255,255,255,0.15)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>{plan[0].exEmoji}</div>
          <div style={{flex:1}}>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{t(lang,"nextInPlan")}</div>
            <div style={{color:WHITE,fontWeight:700,fontSize:14}}>{tx(lang,plan[0].exId,"name",plan[0].exName)}</div>
          </div>
          <div style={{color:GOLD,fontSize:13,fontWeight:700}}>→</div>
        </button>
      )}

      {(()=>{
        // One compact card per active goal that maps to a specific exercise
        // — matches the same compact style as the Finisher Games / Programs
        // rows below, instead of full-width banner buttons that pushed
        // everything else down the page when more than one goal was active.
        const goals = getGoals(userId);
        const allExercises = Object.values(EXERCISES).flat();
        const recs = [];
        for(const g of goals){
          const metric = GOAL_METRICS.find(m=>m.key===g.metricKey);
          if(!metric || !metric.exerciseId) continue;
          const current = g.metricKey==="hcp" ? null : computeGoalMetric(g.metricKey, sessions);
          const hasData = current!=null;
          const reached = hasData && (metric.lowerIsBetter ? current<=g.target : current>=g.target);
          if(reached) continue;
          const exercise = allExercises.find(e=>e.id===metric.exerciseId);
          if(!exercise) continue;
          recs.push({g, metric, exercise});
        }
        if(recs.length===0) return null;
        return (
          <>
            <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"forYourGoals")}</div>
            <div style={{display:"flex",gap:10,overflowX:"auto",marginBottom:20,paddingBottom:2}}>
              {recs.map(({g,metric,exercise})=>(
                <button key={g.metricKey} onClick={()=>{
                    const f=FOCUS_AREAS.find(fa=>fa.id===metric.focusId);
                    if(f){ setFocus(f); setList(EXERCISES[f.id]); }
                    setEx(exercise); setStep("active");
                  }}
                  style={{flexShrink:0,width:140,background:PURPLE_BG,border:"1.5px solid "+PURPLE+"44",borderRadius:14,padding:"12px 10px",cursor:"pointer",textAlign:"left"}}>
                  <div style={{fontSize:22,marginBottom:6}}>{exercise.emoji}</div>
                  <div style={{color:NAVY,fontWeight:700,fontSize:12,lineHeight:1.3,marginBottom:4}}>{tx(lang,exercise.id,"name",exercise.name)}</div>
                  <div style={{color:PURPLE,fontSize:10,fontWeight:600}}>{t(lang,"goalMetric_"+g.metricKey)}</div>
                </button>
              ))}
            </div>
          </>
        );
      })()}

      <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"finisherGames")}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
        {Object.values(FINISHERS).map(g=>(
          <button key={g.id} onClick={()=>{setActiveFinisher(g);setStep("finisherPlay");}}
            style={{background:"linear-gradient(135deg,#fff8e6,#fef0d8)",border:"1.5px solid "+GOLD+"55",borderRadius:14,padding:"12px 8px",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:4}}>{g.emoji}</div>
            <div style={{color:NAVY,fontWeight:700,fontSize:11,lineHeight:1.3}}>{txFin(lang,g.id,"shortName",g.name.replace(" Finisher",""))}</div>
            <div style={{color:GOLD,fontSize:9,fontWeight:700,marginTop:2}}>/100</div>
          </button>
        ))}
      </div>

      <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"programs")}</div>
      <div style={{display:"flex",gap:10,overflowX:"auto",marginBottom:20,paddingBottom:2}}>
        {PROGRAMS.map(p=>(
          <button key={p.id} onClick={()=>{setActiveProgram(p);setProgramStepIdx(0);setStep("programIntro");}}
            style={{flexShrink:0,width:140,background:PURPLE_BG,border:"1.5px solid "+PURPLE+"44",borderRadius:14,padding:"12px 10px",cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:22,marginBottom:6}}>{p.emoji}</div>
            <div style={{color:NAVY,fontWeight:700,fontSize:12,lineHeight:1.3,marginBottom:4}}>{t(lang,"prog_"+p.id+"_name")}</div>
            <div style={{color:PURPLE,fontSize:10,fontWeight:600}}>{p.steps.length} {t(lang,"steps")} · {p.duration} {t(lang,"min")}</div>
          </button>
        ))}
      </div>

      <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"chooseFocus")}</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {FOCUS_AREAS.map(f=>{
          const ss=sessions.filter(s=>s.type==="train"&&s.focusId===f.id);
          const avg=ss.length?Math.round(ss.reduce((a,s)=>a+(s.score/s.exMax)*100,0)/ss.length):null;
          const fc=focusColors(f.id);
          return (
            <button key={f.id} onClick={()=>{setFocus(f);setList(EXERCISES[f.id]);setStep("pick");}}
              style={{background:WHITE,border:"1.5px solid "+BORDER,borderRadius:18,padding:"18px 20px",cursor:"pointer",textAlign:"left",boxShadow:"0 2px 10px rgba(26,47,74,0.06)",display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:52,height:52,background:fc.bg,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>
                {f.emoji}
              </div>
              <div style={{flex:1}}>
                <div style={{color:NAVY,fontWeight:700,fontSize:15}}>{f.label}</div>
                <div style={{color:SLATE_L,fontSize:12,marginTop:2}}>{f.desc}</div>
              </div>
              <div style={{textAlign:"right"}}>
                {avg!==null
                  ? <div style={{color:avg>=80?GREEN:avg>=60?AMBER:RED,fontWeight:700,fontSize:17,fontFamily:"Georgia,serif"}}>{avg}%</div>
                  : <div style={{color:SLATE_L,fontSize:13}}>{t(lang,"start")}</div>
                }
                {ss.length>0&&<div style={{color:SLATE_L,fontSize:10,marginTop:1}}>{ss.length} {t(lang,"sessions")}</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  if(step==="pick") {
    const fc=focusColors(focus.id);
    return (
    <div>
      <button onClick={()=>setStep("focus")} style={{background:"none",border:"none",color:fc.solid,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
      <div style={{marginBottom:16}}>
        <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>{t(lang,"chooseExercise")}</div>
        <div style={{color:SLATE_L,fontSize:13,marginTop:3}}>{list.length} {t(lang,"drillsAvail")}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {list.map(e=>{
          const past=pastFor(e.id);
          const lastPct=past.length?Math.round((past[past.length-1].score/e.max)*100):null;
          const prevPct=past.length>1?Math.round((past[past.length-2].score/e.max)*100):null;
          const trend=lastPct!==null&&prevPct!==null?lastPct-prevPct:null;
          const [bgD,txD]=badge(e.difficulty);
          return (
            <button key={e.id} onClick={()=>{setEx(e);setStep("active");}}
              style={{background:WHITE,border:"1.5px solid "+BORDER,borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"left",boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                <span style={{color:NAVY,fontWeight:700,fontSize:14}}>{e.emoji} {tx(lang,e.id,"name",e.name)}</span>
                <span style={{background:bgD,color:txD,fontSize:10,fontWeight:700,borderRadius:20,padding:"2px 9px",marginLeft:8,whiteSpace:"nowrap"}}>{t(lang,"diff_"+e.difficulty)}</span>
              </div>
              <div style={{color:fc.solid,fontSize:12,marginBottom:4,fontWeight:500}}>💡 {tx(lang,e.id,"purpose",e.purpose)}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:SLATE_L,fontSize:11}}>⏱ {e.duration} {t(lang,"min")}</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {trend!==null&&(
                    <span style={{color:trend>=0?GREEN:RED,fontSize:11,fontWeight:700}}>{trend>=0?"+":"-"}{Math.abs(trend)}%</span>
                  )}
                  {lastPct!==null&&(
                    <span style={{color:lastPct>=80?GREEN:lastPct>=60?AMBER:RED,fontSize:12,fontWeight:700,background:lastPct>=80?GREEN_BG:lastPct>=60?"#fff8e6":"#fef0f0",borderRadius:8,padding:"2px 8px"}}>
                      {t(lang,"last")}: {lastPct}%
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );}

  if(step==="active"&&ex) {
    const fc=focusColors(focus.id);
    const past=pastFor(ex.id);
    const pcts=past.map(s=>Math.round((s.score/ex.max)*100));
    const [bgD,txD]=badge(ex.difficulty);
    const guide=guideFor(ex.id);
    return (
      <div>
        <button onClick={()=>{if(activeProgram){setActiveProgram(null);setProgramStepIdx(0);setProgramScores([]);setStep("focus");}else{setStep("pick");}}} style={{background:"none",border:"none",color:fc.solid,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,activeProgram?"exitProgram":"back")}</button>
        {activeProgram&&(
          <div style={{display:"flex",gap:5,marginBottom:14}}>
            {activeProgram.steps.map((s,i)=>(
              <div key={i} style={{flex:1,height:5,borderRadius:3,background:i<programStepIdx?PURPLE:(i===programStepIdx?PURPLE:BORDER),opacity:i<=programStepIdx?1:0.4}}/>
            ))}
          </div>
        )}
        <div style={{borderRadius:16,marginBottom:16,border:"1px solid "+BORDER,overflow:"hidden"}}>
          <ExercisePhoto exercise={ex} pattern={guide.pattern}/>
        </div>
        <div style={{background:WHITE,borderRadius:18,padding:18,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700,flex:1}}>{tx(lang,ex.id,"name",ex.name)}</div>
            <span style={{background:bgD,color:txD,fontSize:11,fontWeight:700,borderRadius:20,padding:"3px 10px",marginLeft:10,whiteSpace:"nowrap"}}>{t(lang,"diff_"+ex.difficulty)}</span>
          </div>
          <div style={{background:fc.bg,borderRadius:12,padding:"10px 14px",marginBottom:10,border:"1px solid "+BORDER}}>
            <div style={{color:fc.solid,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{t(lang,"purpose")}</div>
            <div style={{color:NAVY,fontSize:13,fontWeight:600}}>{tx(lang,ex.id,"purpose",ex.purpose)}</div>
          </div>
          <p style={{color:TEXT_S,fontSize:13,lineHeight:1.65,margin:"0 0 10px"}}>{cvt(tx(lang,ex.id,"desc",ex.desc),units)}</p>
          {(ex.facePos||ex.ballPos)&&(
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {ex.facePos&&(
                <div style={{flex:1,background:OFF,borderRadius:12,padding:"9px 12px",border:"1px solid "+BORDER}}>
                  <div style={{color:SLATE,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>{t(lang,"clubface")}</div>
                  <div style={{color:NAVY,fontSize:12,fontWeight:700}}>{t(lang,"face_"+ex.facePos)}</div>
                </div>
              )}
              {ex.ballPos&&(
                <div style={{flex:1,background:OFF,borderRadius:12,padding:"9px 12px",border:"1px solid "+BORDER}}>
                  <div style={{color:SLATE,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>{t(lang,"ballPosition")}</div>
                  <div style={{color:NAVY,fontSize:12,fontWeight:700}}>{t(lang,"ball_"+ex.ballPos)}</div>
                </div>
              )}
            </div>
          )}
          {ex.targetDistanceM&&(()=>{
            const personal = getClubDistances(userId);
            const {club, isPersonal} = suggestClub(ex.targetDistanceM, personal);
            const displayM = ex.targetDistanceM;
            return (
              <div style={{background:PURPLE_BG,borderRadius:12,padding:"10px 14px",marginBottom:10,border:"1px solid "+BORDER,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:18}}>🏑</span>
                <div style={{flex:1}}>
                  <div style={{color:PURPLE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>{isPersonal?t(lang,"yourClubSuggestion"):t(lang,"genericClubSuggestion")}</div>
                  <div style={{color:NAVY,fontSize:13,fontWeight:600}}>{t(lang,"club_"+club.id)} {isPersonal?"":t(lang,"approxSuffix")}</div>
                </div>
              </div>
            );
          })()}
          {guide.why&&(
            <div style={{background:OFF,borderRadius:12,padding:"10px 14px",marginBottom:10,border:"1px solid "+BORDER}}>
              <div style={{color:SLATE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{t(lang,"howWhy")}</div>
              <div style={{color:TEXT_S,fontSize:12,lineHeight:1.6}}>{cvt(txWhy(lang,ex.id,guide.why),units)}</div>
            </div>
          )}
          <div style={{color:SLATE_L,fontSize:12}}>⏱ {ex.duration} {t(lang,"min")}</div>
        </div>
        {pcts.length>1&&(
          <div style={{background:WHITE,borderRadius:16,padding:14,marginBottom:14,border:"1px solid "+BORDER}}>
            <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{t(lang,"yourHistory")}</div>
            <div style={{display:"flex",gap:6}}>
              <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",fontSize:9,color:SLATE_L,fontWeight:600,paddingBottom:2}}>
                <span>100</span><span>50</span><span>0</span>
              </div>
              <div style={{flex:1}}><Sparkline data={pcts} color={fc.solid} fixedScale/></div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <span style={{color:SLATE_L,fontSize:11}}>{t(lang,"first")}: {pcts[0]}%</span>
              <span style={{color:fc.solid,fontSize:11,fontWeight:700}}>{t(lang,"best")}: {Math.max(...pcts)}%</span>
              <span style={{color:NAVY,fontSize:11,fontWeight:700}}>{t(lang,"last")}: {pcts[pcts.length-1]}%</span>
            </div>
          </div>
        )}
        <div style={{background:HEADER_BG,borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(26,47,74,0.2)"}}>
          <label style={{color:"rgba(255,255,255,0.6)",fontSize:12,display:"block",marginBottom:10,fontWeight:600}}>
            {tx(lang,ex.id,"label",ex.label)} ({t(lang,"outOf")} {ex.max})
          </label>
          <ScoreStepper value={score} max={ex.max} onChange={setScore}/>
          <button onClick={()=>{
            if(score===""||isNaN(+score))return;
            onSave({type:"train",focusId:focus.id,exId:ex.id,exName:ex.name,exEmoji:ex.emoji,exDiff:ex.difficulty,exPurpose:ex.purpose,exMax:ex.max,exLabel:ex.label,score:+score,ts:Date.now()});
            if(activeProgram){ advanceProgram(+score); } else { setStep("result"); }
          }}
            style={{width:"100%",marginTop:16,padding:15,background:GOLD_BG,border:"none",borderRadius:14,color:NAVY,fontWeight:800,cursor:"pointer",fontSize:15,boxShadow:"0 4px 16px rgba(232,184,75,0.4)"}}>
            {activeProgram&&programStepIdx<activeProgram.steps.length-1?t(lang,"saveAndNext")+" →":t(lang,"saveResult")+" →"}
          </button>
        </div>
      </div>
    );
  }

  if(step==="result"&&ex) {
    const pct=Math.round((+score/ex.max)*100);
    const past=pastFor(ex.id);
    const prev=past.length>1?Math.round((past[past.length-2].score/ex.max)*100):null;
    const trend=prev!==null?pct-prev:null;
    const gColor=pct>=80?GREEN:pct>=60?AMBER:RED;
    const gLabel=pct>=80?t(lang,"excellent"):pct>=60?t(lang,"goodWork"):t(lang,"keepGoing");
    return (
      <div style={{textAlign:"center",padding:"10px 0"}}>
        <div style={{width:88,height:88,background:pct>=80?GREEN_BG:pct>=60?"#fff8e6":"#fef0f0",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,margin:"0 auto 16px",border:"2px solid "+gColor+"33"}}>⛳</div>
        <div style={{color:gColor,fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,marginBottom:4}}>{gLabel}</div>
        <div style={{color:SLATE_L,fontSize:13,marginBottom:20}}>{tx(lang,ex.id,"name",ex.name)}</div>
        <div style={{background:WHITE,borderRadius:20,padding:22,marginBottom:16,border:"1px solid "+BORDER,boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
          <div style={{color:SLATE_L,fontSize:11,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>{t(lang,"yourScore")}</div>
          <div style={{color:NAVY,fontSize:52,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif",lineHeight:1.1}}>{score}<span style={{fontSize:18,color:SLATE_L}}>/{ex.max}</span></div>
          <div style={{color:gColor,fontSize:20,fontWeight:700,marginBottom:6}}>{pct}%</div>
          {trend!==null&&(
            <div style={{color:trend>=0?GREEN:RED,fontSize:13,fontWeight:600,background:trend>=0?GREEN_BG:"#fef0f0",borderRadius:8,padding:"4px 12px",display:"inline-block"}}>
              {trend>=0?"+":"-"}{Math.abs(trend)}% {t(lang,"vsLast")}
            </div>
          )}
        </div>
        <div style={{background:"linear-gradient(135deg,#e8f5ec,#f0f7f2)",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #d4edda",textAlign:"left"}}>
          <div style={{color:GREEN,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{t(lang,"whyMatters")}</div>
          <div style={{color:NAVY,fontSize:13,fontWeight:500}}>{tx(lang,ex.id,"purpose",ex.purpose)}</div>
        </div>
        <div style={{marginBottom:10}}>
          <ShareResultButton lang={lang} title={tx(lang,ex.id,"name",ex.name)} text={"Caddy — "+tx(lang,ex.id,"name",ex.name)+": "+score+"/"+ex.max+" ("+pct+"%)"}/>
        </div>
        <button onClick={()=>{setStep("focus");setFocus(null);setDur(null);setEx(null);setScore("");}}
          style={{padding:"14px 36px",background:HEADER_BG,border:"none",borderRadius:14,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:15,boxShadow:"0 4px 16px rgba(26,47,74,0.2)"}}>
          {t(lang,"newSession")}
        </button>
      </div>
    );
  }

  return null;
}

function RoundSavedScreen({summary, onDone, onView, lang}){
  const diff = summary.tot - summary.par;
  const color = diff<=0?GREEN:diff<=5?AMBER:RED;
  return (
    <div style={{textAlign:"center",padding:"10px 0"}}>
      <div style={{width:88,height:88,background:GREEN_BG,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,margin:"0 auto 16px",border:"2px solid "+GREEN+"33"}}>⛳</div>
      <div style={{color:GREEN,fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,marginBottom:4}}>{t(lang,"roundSaved")}</div>
      <div style={{color:SLATE_L,fontSize:13,marginBottom:20}}>{t(lang,"roundSavedSub")}</div>
      <div style={{background:WHITE,borderRadius:20,padding:22,marginBottom:16,border:"1px solid "+BORDER,boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
        <div style={{color:SLATE_L,fontSize:11,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>{t(lang,"score")}</div>
        <div style={{color:NAVY,fontSize:48,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif",lineHeight:1.1}}>{summary.tot}</div>
        <div style={{color:color,fontSize:18,fontWeight:700}}>{diff>=0?"+":""}{diff} vs par</div>
      </div>
      <div style={{marginBottom:10}}>
        <ShareResultButton lang={lang} title="Round" text={"Caddy — Round: "+summary.tot+" ("+(diff>=0?"+":"")+diff+" vs par)"}/>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onView} style={{flex:1,padding:14,background:WHITE,border:"1.5px solid "+BORDER,borderRadius:14,color:NAVY,fontWeight:700,cursor:"pointer",fontSize:14}}>
          {t(lang,"viewSummary")}
        </button>
        <button onClick={onDone} style={{flex:1,padding:14,background:HEADER_BG,border:"none",borderRadius:14,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:14}}>
          {t(lang,"done")}
        </button>
      </div>
    </div>
  );
}

function ScoreTab({onSave, settings, sessions, userId}){
  const [step,setStep]=useState("pick");
  const [n,setN]=useState(()=>settings?.holes||18);
  const [lastSaved,setLastSaved]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [presetCourse,setPresetCourse]=useState(null);
  const lang=settings?.language||"en";
  useEffect(()=>{if(step==="pick")setN(settings?.holes||18);},[settings?.holes]);

  // "Play here again" — the 10 most recently played DISTINCT courses (not
  // 10 rounds; a course played 4 times this month still shows once, with
  // its most recent date), so the player can jump straight back into a
  // familiar course with one tap instead of searching for it again.
  const recentRounds = sessions.filter(s=>s.type==="round"&&s.course).sort((a,b)=>b.ts-a.ts);
  const recentCourses = [];
  const seenCourses = new Set();
  for(const r of recentRounds){
    if(!seenCourses.has(r.course)){
      seenCourses.add(r.course);
      recentCourses.push({course:r.course, ts:r.ts, n:r.n});
      if(recentCourses.length>=10) break;
    }
  }

  if(step==="saved"&&lastSaved) return (
    <>
      <RoundSavedScreen summary={lastSaved} lang={lang}
        onDone={()=>{setStep("pick");setLastSaved(null);setPresetCourse(null);}}
        onView={()=>setShowModal(true)}/>
      {showModal&&<ScorecardModal session={lastSaved.session} lang={lang} onClose={()=>{setShowModal(false);setStep("pick");setLastSaved(null);setPresetCourse(null);}}/>}
    </>
  );

  if(step==="pick") return (
    <div>
      <div style={{marginBottom:18}}>
        <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:24,fontWeight:700}}>{t(lang,"scorecard")}</div>
        <div style={{color:SLATE_L,fontSize:13,marginTop:3}}>{t(lang,"trackRound")}</div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:20}}>
        {[9,18].map(x=>(
          <button key={x} onClick={()=>setN(x)}
            style={{flex:1,padding:18,background:n===x?NAVY:WHITE,border:"2px solid "+(n===x?NAVY:BORDER),borderRadius:16,color:n===x?WHITE:NAVY,fontWeight:700,fontSize:18,cursor:"pointer",boxShadow:n===x?"0 4px 16px rgba(26,47,74,0.2)":"0 1px 6px rgba(0,0,0,0.04)"}}>
            {x} <span style={{fontSize:13,fontWeight:400}}>{t(lang,"holes")}</span>
          </button>
        ))}
      </div>
      <button onClick={()=>setStep("entry")} style={{width:"100%",padding:16,background:GREEN_GRAD,border:"none",borderRadius:16,color:WHITE,fontWeight:700,fontSize:16,cursor:"pointer",boxShadow:"0 4px 18px rgba(58,125,74,0.3)"}}>
        {t(lang,"startRound")} →
      </button>
      {recentCourses.length>0&&(
        <div style={{marginTop:24}}>
          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"playHereAgain")}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {recentCourses.map(rc=>(
              <button key={rc.course} onClick={()=>{setPresetCourse(rc.course);setN(rc.n||18);setStep("entry");}}
                style={{width:"100%",textAlign:"left",background:"linear-gradient(135deg,#e8f5ec,#f0f7f2)",border:"1.5px solid "+GREEN+"33",borderRadius:14,padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{color:NAVY,fontWeight:700,fontSize:13}}>{rc.course}</div>
                  <div style={{color:SLATE_L,fontSize:11}}>{fmt(rc.ts)} · {rc.n}-{t(lang,"holes")}</div>
                </div>
                <span style={{color:GREEN,fontSize:13,fontWeight:700}}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {sessions.filter(s=>s.type==="round").length===0&&(
        <div style={{marginTop:20,background:GREEN_BG,borderRadius:14,padding:14,fontSize:13,color:GREEN,textAlign:"center"}}>
          {t(lang,"unlockStatsHint")}
        </div>
      )}
    </div>
  );
  return (
    <div>
      <button onClick={()=>{setStep("pick");setPresetCourse(null);}} style={{background:"none",border:"none",color:GREEN,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
      <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,marginBottom:16}}>{n}-{t(lang,"holes")}</div>
      <ScorecardEntry holeCount={n} lang={lang} userId={userId} presetCourse={presetCourse} onCancel={()=>{setStep("pick");setPresetCourse(null);}}
        onSave={(holes,course,feeling,notes,roundType)=>{
          const session={type:"round",holes,n,course,feeling,notes,roundType,ts:Date.now()};
          onSave(session);
          const tot=holes.reduce((a,h)=>a+(h.score||0),0);
          const par=holes.reduce((a,h)=>a+(h.par||0),0);
          setLastSaved({tot,par,session:{...session,courseName:course}});
          setStep("saved");
        }}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS AREA DETAIL — full-screen drill-down from a Training Progress card.
// Shows an evolution graph across all sessions in this area, plus a complete
// session-by-session summary. Works even with zero sessions (empty state).
// ═══════════════════════════════════════════════════════════════════════════
function FocusAreaDetail({focus, lang, onBack}){
  const fc=focusColors(focus.id);
  const [range,setRange]=useState("all"); // "5" | "10" | "25" | "all"
  const allSessionsChrono=[...(focus.sessions||[])].sort((a,b)=>a.ts-b.ts);
  const ss = range==="all" ? allSessionsChrono : allSessionsChrono.slice(-parseInt(range,10));
  const pcts=ss.map(s=>Math.round((s.score/s.exMax)*100));
  const best=pcts.length?Math.max(...pcts):null;
  const worst=pcts.length?Math.min(...pcts):null;
  // "Since start" = most recent vs the first session WITHIN the selected
  // range — intentionally different from focus.trend (which is last-vs-
  // previous on the full all-time history), since this screen reflects
  // whatever range the player has chosen to look at.
  const sinceStart = pcts.length>=2 ? pcts[pcts.length-1]-pcts[0] : null;
  const rangedAvg = pcts.length ? Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length) : null;

  // Group sessions by exercise to show which drills were practiced most
  const byExercise={};
  ss.forEach(s=>{
    if(!byExercise[s.exId]) byExercise[s.exId]={exId:s.exId, name:s.exName, emoji:s.exEmoji, count:0, scores:[]};
    byExercise[s.exId].count++;
    byExercise[s.exId].scores.push(Math.round((s.score/s.exMax)*100));
  });
  const exerciseList=Object.values(byExercise).sort((a,b)=>b.count-a.count);

  return (
    <div>
      <button onClick={onBack} style={{background:"none",border:"none",color:fc.solid,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>← {t(lang,"back")}</button>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
        <div style={{width:52,height:52,background:fc.bg,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{focus.emoji}</div>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>{focus.label}</div>
          <div style={{color:SLATE_L,fontSize:13,marginTop:2}}>{(focus.sessions||[]).length} {(focus.sessions||[]).length===1?t(lang,"sessionsCount"):t(lang,"sessionsCount2")}</div>
        </div>
      </div>

      {(focus.sessions||[]).length>0&&(
        <div style={{display:"flex",gap:6,marginBottom:18}}>
          {[["5",t(lang,"last5")],["10",t(lang,"last10")],["25",t(lang,"last25")],["all",t(lang,"allTime")]].map(([v,l])=>(
            <button key={v} onClick={()=>setRange(v)}
              style={{flex:1,padding:"9px 4px",background:range===v?fc.solid:WHITE,border:"1.5px solid "+(range===v?fc.solid:BORDER),borderRadius:10,color:range===v?WHITE:TEXT_S,fontSize:12,fontWeight:range===v?700:500,cursor:"pointer"}}>
              {l}
            </button>
          ))}
        </div>
      )}

      {ss.length===0 ? (
        <div style={{background:WHITE,borderRadius:20,padding:"40px 24px",textAlign:"center",border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:44,marginBottom:14,opacity:0.3}}>{focus.emoji}</div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,marginBottom:6}}>{t(lang,"noSessionsYet")}</div>
          <div style={{color:SLATE_L,fontSize:13,lineHeight:1.6}}>{t(lang,"noSessionsYetDesc")}</div>
        </div>
      ) : (
        <>
          {/* Summary stat row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
            {[[t(lang,"avgScore"),rangedAvg!=null?rangedAvg+"%":"—",NAVY],[t(lang,"best"),best!=null?best+"%":"—",GREEN],[t(lang,"worst"),worst!=null?worst+"%":"—",RED]].map(([l,v,c])=>(
              <div key={l} style={{background:WHITE,borderRadius:14,padding:"12px 8px",textAlign:"center",border:"1px solid "+BORDER,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
                <div style={{color:SLATE_L,fontSize:9,textTransform:"uppercase",letterSpacing:1,fontWeight:700,marginBottom:2}}>{l}</div>
                <div style={{color:c,fontSize:20,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{v}</div>
              </div>
            ))}
          </div>

          {/* Evolution graph */}
          <div style={{background:WHITE,borderRadius:18,padding:18,marginBottom:18,border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{color:NAVY,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{t(lang,"evolution")}</div>
              {sinceStart!==null&&(
                <span style={{color:sinceStart>=0?GREEN:RED,fontSize:12,fontWeight:700,background:sinceStart>=0?GREEN_BG:"#fef0f0",borderRadius:8,padding:"3px 9px"}}>
                  {sinceStart>=0?"+":"-"}{Math.abs(sinceStart)}% {t(lang,"sinceStart")}
                </span>
              )}
            </div>
            {pcts.length>1 ? (
              <>
                <div style={{display:"flex",gap:8}}>
                  <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",fontSize:9,color:SLATE_L,fontWeight:600,paddingBottom:3}}>
                    <span>100</span><span>50</span><span>0</span>
                  </div>
                  <div style={{flex:1}}><Sparkline data={pcts} color={fc.solid} h={70} fixedScale/></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
                  <span style={{color:SLATE_L,fontSize:11}}>{t(lang,"first")}: {pcts[0]}%</span>
                  <span style={{color:fc.solid,fontSize:11,fontWeight:700}}>{ss.length} {t(lang,"sessions")}</span>
                  <span style={{color:NAVY,fontSize:11,fontWeight:700}}>{t(lang,"last")}: {pcts[pcts.length-1]}%</span>
                </div>
              </>
            ) : (
              <div style={{color:SLATE_L,fontSize:12,textAlign:"center",padding:"16px 0"}}>{t(lang,"needMoreSessions")}</div>
            )}
          </div>

          {/* Most-practiced exercises */}
          {exerciseList.length>0&&(
            <>
              <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"exercisesPracticed")}</div>
              <div style={{background:WHITE,borderRadius:16,padding:14,marginBottom:18,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
                {exerciseList.map((e,i)=>{
                  const avgE=Math.round(e.scores.reduce((a,b)=>a+b,0)/e.scores.length);
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<exerciseList.length-1?"1px solid "+BORDER:"none"}}>
                      <span style={{fontSize:17}}>{e.emoji}</span>
                      <span style={{color:TEXT,flex:1,fontWeight:500,fontSize:13}}>{tx(lang,e.exId,"name",e.name)}</span>
                      <span style={{color:SLATE_L,fontSize:11}}>{e.count}×</span>
                      <span style={{color:avgE>=80?GREEN:avgE>=60?AMBER:RED,fontWeight:700,fontSize:13,fontFamily:"Georgia,serif",minWidth:38,textAlign:"right"}}>{avgE}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Full session-by-session log */}
          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"allSessions")}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[...ss].reverse().map((s,i)=>{
              const pct=Math.round((s.score/s.exMax)*100);
              const [bgD,txD]=badge(s.exDiff||"Beginner");
              return (
                <div key={i} style={{background:WHITE,borderRadius:14,padding:"12px 14px",border:"1px solid "+BORDER,boxShadow:"0 1px 6px rgba(0,0,0,0.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <span style={{color:NAVY,fontWeight:700,fontSize:13}}>{s.exEmoji} {tx(lang,s.exId,"name",s.exName)}</span>
                      <span style={{background:bgD,color:txD,fontSize:9,borderRadius:10,padding:"1px 6px",fontWeight:600,whiteSpace:"nowrap"}}>{t(lang,"diff_"+s.exDiff)}</span>
                    </div>
                    <div style={{color:SLATE_L,fontSize:11}}>{fmt(s.ts)}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{color:pct>=80?GREEN:pct>=60?AMBER:RED,fontWeight:700,fontSize:17,fontFamily:"Georgia,serif"}}>{pct}%</div>
                    <div style={{color:SLATE_L,fontSize:10}}>{s.score}/{s.exMax}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCORECARD HISTORY DETAIL — full drill-down from the On-Course stats section.
// Shows every round ever played (not capped at 6 like the quick-glance Stats
// charts), with a range selector (last 5 / 10 / 25 / All time) controlling
// both the trend charts and the averages shown below them.
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// DETAILED TREND CHART — a single, larger chart with a real labeled Y-axis,
// date labels on the X-axis spanning the actual range, and the point count
// already capped/sampled by the caller (matching the same 15-point cap used
// everywhere else). Built so one good chart can be reused with a metric
// switcher, instead of several small unlabeled sparklines stacked together.
// `points` is an array of {ts, value}, already chronological oldest->newest.
// ═══════════════════════════════════════════════════════════════════════════
function DetailedTrendChart({points, color, colorFor, suffix, lang, targetLine}){
  if(!points||points.length<2) return null;
  // Best-practice approach for dense point-in-time data (same idea Strava
  // and Arccos use): rather than cramming every point into a fixed width —
  // which forces either overlapping labels or hiding most of them — give
  // each point a real minimum width and let the chart scroll horizontally.
  // Per-point horizontal spacing needs to be wider for percentage values —
  // a label like "100%" is meaningfully wider than something like "4.5" or
  // "-2", and the previous flat 30px left almost no breathing room between
  // adjacent percentage labels, making them crowd or visually run together.
  const MIN_PER_POINT = suffix==="%" ? 44 : 30;
  const padL=34, padR=16, padT=16, padB=22;
  const containerW = 320; // the visible viewport width before scrolling kicks in
  const plotW = Math.max(containerW-padL-padR, MIN_PER_POINT*(points.length-1));
  const W = plotW+padL+padR;
  const H=140; // shorter now — value labels live in the row below the chart instead of floating on it
  const plotH = H-padT-padB;
  // FIXED: this chart previously flipped the plotted line for "lower is
  // better" metrics (e.g. putts, 3-putts) so going UP on screen always meant
  // "improving" — but that meant the line's direction didn't match the
  // actual number's direction, which read as backwards/confusing. The line
  // now always goes up when the raw value goes up, full stop, exactly like
  // the Score vs Par chart already did — "is this good or bad" is conveyed
  // by the color of each point/number instead, not by flipping the axis.
  const rawValues = points.map(p=>p.value);
  // When a target line is given (Goals' detail view), the Y-axis range must
  // also account for it — otherwise a target far outside the actual data
  // range would render off-chart or get silently clipped.
  const vMin = targetLine!=null ? Math.min(...rawValues, targetLine) : Math.min(...rawValues);
  const vMax = targetLine!=null ? Math.max(...rawValues, targetLine) : Math.max(...rawValues);
  const span = (vMax-vMin) || 1;
  const xAt = i => padL + (points.length>1 ? (i/(points.length-1))*plotW : plotW/2);
  const yAt = v => padT + plotH - ((v-vMin)/span)*plotH;
  const needsScroll = W > containerW;

  return (
    <div style={{background:WHITE,borderRadius:16,padding:16,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
      {needsScroll&&(
        <div style={{color:SLATE_L,fontSize:9,marginBottom:6,fontStyle:"italic"}}>{t(lang,"scrollForAllPoints")}</div>
      )}
      {/* IMPORTANT: the chart and its number row below must scroll TOGETHER
          as a single unit — they were previously two separate scrollable
          containers, so scrolling the chart left no longer moved the
          numbers underneath it, leaving them out of sync. Wrapping both in
          one shared overflow container fixes that; the numbers always line
          up under their matching point no matter how far you've scrolled. */}
      <div style={{overflowX:needsScroll?"auto":"visible",WebkitOverflowScrolling:"touch"}}>
        <svg viewBox={"0 0 "+W+" "+H} style={needsScroll ? {width:W,height:H,display:"block"} : {width:"100%",height:"auto",display:"block"}}>
          {[0,0.25,0.5,0.75,1].map(f=>{
            const realVal = vMax-f*span;
            return (
              <g key={f}>
                <line x1={padL} y1={padT+plotH*f} x2={W-padR} y2={padT+plotH*f} stroke={BORDER} strokeWidth="1" strokeDasharray={f===0||f===1?"0":"2 3"} opacity={f===0||f===1?0.6:0.3}/>
                <text x={padL-6} y={padT+plotH*f+3} fontSize="9" fill={SLATE_L} textAnchor="end">{Math.round(realVal*10)/10}{suffix||""}</text>
              </g>
            );
          })}
          {targetLine!=null&&(
            <line x1={padL} y1={yAt(targetLine)} x2={W-padR} y2={yAt(targetLine)} stroke={GREEN} strokeWidth="1.5" strokeDasharray="3 3" opacity={0.7}/>
          )}
          <polyline points={rawValues.map((v,i)=>xAt(i)+","+yAt(v)).join(" ")} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          {rawValues.map((v,i)=>{
            const isEdge = i===0||i===rawValues.length-1;
            const dotColor = colorFor ? colorFor(v) : color;
            return <circle key={i} cx={xAt(i)} cy={yAt(v)} r={isEdge?4:2.5} fill={dotColor} stroke={WHITE} strokeWidth="1.2"/>;
          })}
        </svg>
        {/* Value labels now live INSIDE the same scroll container as the
            chart (not a separate one below it), each positioned at the
            exact same x-coordinate as its matching point above — so they
            move in lockstep with the chart as you scroll, always lined up
            under the right dot, full data always reachable. */}
        <div style={{display:"flex",marginTop:10,paddingTop:10,borderTop:"1px solid "+BORDER,width:needsScroll?W:"100%",position:"relative",height:18}}>
          {rawValues.map((v,i)=>{
            // When the chart is responsive (needsScroll=false, SVG at
            // width:100%), positioning numbers using the fixed SVG-space
            // xAt(i) value would misalign them against the dots above once
            // the SVG scales to the real container width — so this case
            // uses a PERCENTAGE position instead, matching how the SVG
            // itself scales. When the chart is a fixed pixel width
            // (needsScroll=true), xAt(i) already IS the correct pixel
            // position, since nothing is being scaled in that case.
            const leftPos = needsScroll ? xAt(i) : ((xAt(i)/W)*100)+"%";
            return (
              <div key={i} style={{position:"absolute",left:leftPos,transform:"translateX(-50%)",color:colorFor?colorFor(v):color,fontWeight:700,fontSize:11,fontFamily:"Georgia,serif",whiteSpace:"nowrap"}}>
                {Math.round(v*10)/10}{suffix||""}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6,width:needsScroll?W:"100%"}}>
          <span style={{color:SLATE_L,fontSize:8}}>{fmtChartAxis(points[0].ts)}</span>
          <span style={{color:SLATE_L,fontSize:8}}>{fmtChartAxis(points[points.length-1].ts)}</span>
        </div>
      </div>
    </div>
  );
}

function ScorecardHistoryDetail({rounds, lang, onBack}){
  const [range,setRange]=useState("all"); // "5" | "10" | "25" | "all"
  const [typeFilter,setTypeFilter]=useState("all"); // "all" | "practice" | "competition"
  const [chartMetric,setChartMetric]=useState("score"); // which single metric the detailed chart shows
  const [modal,setModal]=useState(null);
  const filteredRounds = typeFilter==="all" ? rounds : rounds.filter(r=>(r.roundType||"practice")===typeFilter);
  const roundsChrono=[...filteredRounds].sort((a,b)=>a.ts-b.ts);
  const ranged = range==="all" ? roundsChrono : roundsChrono.slice(-parseInt(range,10));
  const rangedDesc = [...ranged].sort((a,b)=>b.ts-a.ts); // newest first, for the list

  const scoreTrendPts = ranged.map(r=>{
    const tot=(r.holes||[]).reduce((a,h)=>a+(h.score||0),0);
    const par=(r.holes||[]).reduce((a,h)=>a+(h.par||0),0);
    return {ts:r.ts, value:tot-par};
  });
  const scoreTrend = scoreTrendPts.map(p=>p.value);
  const perRoundStatsPts = ranged.map(r=>{
    const holes=r.holes||[];
    const holeCount=holes.length||18;
    const scaleTo18=18/holeCount;
    const threePuttCount=holes.filter(h=>(h.putts||0)>=3).length;
    const updownAttempts=holes.filter(isUpDownAttempt);
    const updownSuccess=updownAttempts.filter(isUpDownSuccess);
    const puttsTotal=holes.reduce((a,h)=>a+(h.putts||0),0);
    return {
      ts:r.ts,
      threePutts18:threePuttCount*scaleTo18, updowns18:updownSuccess.length*scaleTo18,
      updownPct: updownAttempts.length ? (updownSuccess.length/updownAttempts.length)*100 : null,
      avgPutts18:puttsTotal*scaleTo18,
      girPct: girPctOf(holes),
      firPct: firPctOf(holes),
    };
  });
  const perRoundStats = perRoundStatsPts;
  const threePuttTrendPts = perRoundStatsPts.map(r=>({ts:r.ts, value:Math.round(r.threePutts18*10)/10}));
  // Up & Down is tracked as a PERCENTAGE (success rate), not a raw count —
  // the count alone doesn't tell you whether that was a good or bad rate
  // without also knowing how many attempts there were, while the
  // percentage is directly comparable to the benchmark table and to past
  // performance over time. Rounds with zero missed-green attempts (a
  // perfect GIR round) have no rate to compute and are excluded, same
  // pattern as GIR%/FIR%.
  const updownTrendPts = perRoundStatsPts.filter(r=>r.updownPct!=null).map(r=>({ts:r.ts, value:Math.round(r.updownPct)}));
  const avgPuttsTrendPts = perRoundStatsPts.map(r=>({ts:r.ts, value:Math.round(r.avgPutts18*10)/10}));
  const girTrendPts = perRoundStatsPts.filter(r=>r.girPct!=null).map(r=>({ts:r.ts, value:Math.round(r.girPct)}));
  const firTrendPts = perRoundStatsPts.filter(r=>r.firPct!=null).map(r=>({ts:r.ts, value:Math.round(r.firPct)}));
  const threePuttTrend = threePuttTrendPts.map(p=>p.value);
  const updownTrend = updownTrendPts.map(p=>p.value);
  const avgPuttsTrend = avgPuttsTrendPts.map(p=>p.value);
  const girTrend = girTrendPts.map(p=>p.value);
  const firTrend = firTrendPts.map(p=>p.value);
  const avgScore = ranged.length ? Math.round((scoreTrend.reduce((a,b)=>a+b,0)/ranged.length)*10)/10 : null;
  const avgThreePutts = ranged.length ? Math.round((threePuttTrend.reduce((a,b)=>a+b,0)/ranged.length)*10)/10 : null;
  const avgUpdown = updownTrend.length ? Math.round(updownTrend.reduce((a,b)=>a+b,0)/updownTrend.length) : null;
  const avgPutts = ranged.length ? Math.round((avgPuttsTrend.reduce((a,b)=>a+b,0)/ranged.length)*10)/10 : null;
  const avgGir = girTrend.length ? Math.round(girTrend.reduce((a,b)=>a+b,0)/girTrend.length) : null;
  const avgFir = firTrend.length ? Math.round(firTrend.reduce((a,b)=>a+b,0)/firTrend.length) : null;

  // Evenly samples a {ts,value} point array down to at most 15 points across
  // the FULL range — same approach used inside Sparkline — so the single
  // detailed chart stays readable even with "All Time" selected and many
  // rounds logged, without silently dropping the older half of the history.
  function samplePoints(pts, max=15){
    if(pts.length<=max) return pts;
    const out=[];
    for(let i=0;i<max;i++){
      const srcIdx = Math.round((i/(max-1)) * (pts.length-1));
      out.push(pts[srcIdx]);
    }
    return out;
  }
  // One config entry per selectable metric in the dropdown — keeps the
  // chart-switching logic in one place rather than a long if/else.
  const CHART_METRICS = {
    score: {points:scoreTrendPts, color:NAVY, suffix:"", labelKey:"scoreVsPar", helpKey:"higherMeansHigherScore",
      colorFor:v=>v<=0?GREEN:v<=5?AMBER:RED},
    threePutts: {points:threePuttTrendPts, color:RED, suffix:"", labelKey:"threePutts", helpKey:"higherMeansMorePutts",
      colorFor:v=>v<=1?GREEN:v<=2?AMBER:RED},
    updown: {points:updownTrendPts, color:GREEN, suffix:"%", labelKey:"upAndDown", helpKey:"higherMeansMoreUpDowns",
      colorFor:v=>v>=50?GREEN:v>=30?AMBER:RED},
    avgPutts: {points:avgPuttsTrendPts, color:PURPLE, suffix:"", labelKey:"avgPutts", helpKey:"higherMeansMorePutts",
      colorFor:v=>v<=30?GREEN:v<=33?AMBER:RED},
    gir: {points:girTrendPts, color:GREEN, suffix:"%", labelKey:null, helpKey:"higherMeansMoreGreens",
      colorFor:v=>v>=50?GREEN:v>=30?AMBER:RED},
    fir: {points:firTrendPts, color:GREEN, suffix:"%", labelKey:null, helpKey:"higherMeansMoreFairways",
      colorFor:v=>v>=50?GREEN:v>=40?AMBER:RED},
  };
  const activeMetric = CHART_METRICS[chartMetric];
  const sampledPoints = samplePoints(activeMetric.points);

  return (
    <div>
      <button onClick={onBack} style={{background:"none",border:"none",color:GREEN,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>← {t(lang,"back")}</button>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
        <div style={{width:52,height:52,background:GREEN_BG,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>⛳</div>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>{t(lang,"scorecardHistory")}</div>
          <div style={{color:SLATE_L,fontSize:13,marginTop:2}}>{rounds.length} {rounds.length===1?t(lang,"roundCount"):t(lang,"roundCount2")}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["5",t(lang,"last5")],["10",t(lang,"last10")],["25",t(lang,"last25")],["all",t(lang,"allTime")]].map(([v,l])=>(
          <button key={v} onClick={()=>setRange(v)}
            style={{flex:1,padding:"9px 4px",background:range===v?GREEN:WHITE,border:"1.5px solid "+(range===v?GREEN:BORDER),borderRadius:10,color:range===v?WHITE:TEXT_S,fontSize:12,fontWeight:range===v?700:500,cursor:"pointer"}}>
            {l}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:6,marginBottom:18}}>
        {[["all",t(lang,"allRoundTypes")],["practice",t(lang,"roundTypePractice")],["competition",t(lang,"roundTypeCompetition")]].map(([v,l])=>(
          <button key={v} onClick={()=>setTypeFilter(v)}
            style={{flex:1,padding:"7px 4px",background:typeFilter===v?NAVY:WHITE,border:"1.5px solid "+(typeFilter===v?NAVY:BORDER),borderRadius:10,color:typeFilter===v?WHITE:TEXT_S,fontSize:11,fontWeight:typeFilter===v?700:500,cursor:"pointer"}}>
            {l}
          </button>
        ))}
      </div>

      {ranged.length===0 ? (
        <div style={{background:WHITE,borderRadius:20,padding:"40px 24px",textAlign:"center",border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:44,marginBottom:14,opacity:0.3}}>⛳</div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>{rounds.length===0?t(lang,"noSessionsYet"):t(lang,"noRoundsMatchFilter")}</div>
        </div>
      ) : (
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
            {[
              [t(lang,"avgScore"),avgScore!=null?(avgScore>=0?"+":"")+avgScore:"—",avgScore!=null&&avgScore<=0?GREEN:avgScore!=null&&avgScore<=5?AMBER:RED],
              [t(lang,"threePutts"),avgThreePutts??"—",null],
              [t(lang,"upAndDown"),avgUpdown!=null?avgUpdown+"%":"—",null],
              [t(lang,"avgPutts"),avgPutts??"—",null],
              ["GIR %",avgGir!=null?avgGir+"%":"—",null],
              ["FIR %",avgFir!=null?avgFir+"%":"—",null],
            ].map(([l,v,c])=>(
              <div key={l} style={{background:WHITE,borderRadius:14,padding:"12px 8px",textAlign:"center",border:"1px solid "+BORDER}}>
                <div style={{color:SLATE_L,fontSize:9,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700,marginBottom:2}}>{l}</div>
                <div style={{color:c||NAVY,fontSize:19,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{marginBottom:8}}>
            <label style={{color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:6}}>{t(lang,"selectMetricToReview")}</label>
            <select value={chartMetric} onChange={e=>setChartMetric(e.target.value)}
              style={{width:"100%",background:WHITE,border:"1.5px solid "+BORDER,borderRadius:12,color:NAVY,padding:"11px 14px",boxSizing:"border-box",fontSize:14,outline:"none",fontFamily:"inherit",fontWeight:600}}>
              <option value="score">{t(lang,"scoreVsPar")}</option>
              <option value="threePutts">{t(lang,"threePutts")}</option>
              <option value="updown">{t(lang,"upAndDown")}</option>
              <option value="avgPutts">{t(lang,"avgPutts")}</option>
              <option value="gir">GIR %</option>
              <option value="fir">FIR %</option>
            </select>
          </div>
          {sampledPoints.length>1 ? (
            <div style={{marginBottom:18}}>
              <div style={{color:SLATE_L,fontSize:10,marginBottom:8,paddingLeft:2}}>
                {t(lang,activeMetric.helpKey)}
                {activeMetric.points.length>sampledPoints.length&&<> · {t(lang,"sampledFromRounds").replace("{n}",activeMetric.points.length)}</>}
              </div>
              <DetailedTrendChart points={sampledPoints} color={activeMetric.color} colorFor={activeMetric.colorFor} suffix={activeMetric.suffix} lang={lang}/>
            </div>
          ) : (
            <div style={{background:WHITE,borderRadius:16,padding:"24px 16px",textAlign:"center",marginBottom:18,border:"1px solid "+BORDER}}>
              <div style={{color:SLATE_L,fontSize:13}}>{t(lang,"needMoreRoundsForTrend")}</div>
            </div>
          )}

          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"allSessions")}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {rangedDesc.map(r=>{
              const tot=(r.holes||[]).reduce((a,h)=>a+(h.score||0),0);
              const par=(r.holes||[]).reduce((a,h)=>a+(h.par||0),0);
              const d=tot-par;
              return (
                <div key={r.ts} onClick={()=>setModal(r)} style={{background:"linear-gradient(135deg,#e8f5ec,#f0f7f2)",borderRadius:14,padding:"12px 14px",border:"1.5px solid "+GREEN+"33",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{color:NAVY,fontWeight:700,fontSize:13}}>{r.n}-{t(lang,"holes")}{r.course?" · "+r.course:""}{r.roundType==="competition"?" 🏆":""}</div>
                    <div style={{color:SLATE_L,fontSize:11}}>{fmt(r.ts)}</div>
                  </div>
                  <div style={{color:d<=0?GREEN:d<=5?AMBER:RED,fontWeight:700,fontSize:16,fontFamily:"Georgia,serif"}}>{d>=0?"+":""}{d}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <ScorecardModal session={modal} lang={lang} onClose={()=>setModal(null)}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HANDICAP HISTORY DETAIL — drill-down from the Estimated Skill Handicaps
// card. Shows how Putting Handicap and Short Game Handicap have evolved
// round by round, plus a clear breakdown of exactly how each is calculated
// (a worked example using the player's own most recent numbers) and the
// full real-world benchmark table the math is checked against.
// ═══════════════════════════════════════════════════════════════════════════
function HandicapHistoryDetail({rounds, lang, onBack}){
  const [range,setRange]=useState("all"); // "5" | "10" | "25" | "all"
  const [chartMetric,setChartMetric]=useState("putting"); // which handicap the detailed chart shows
  const [modal,setModal]=useState(null);
  const roundsChrono=[...rounds].sort((a,b)=>a.ts-b.ts);

  // Build a running snapshot of both handicaps AS OF each round — using a
  // trailing window of the most recent 5 rounds up to that point (or fewer,
  // down to just the 1 round itself for the very first snapshot — matches
  // deriveHandicaps computing from round 1 onward). This is what makes
  // "history" meaningful: each point reflects what the handicap genuinely
  // was at that moment, not a single all-time figure repeated.
  const snapshots = roundsChrono.map((r,i)=>{
    const windowRounds = roundsChrono.slice(Math.max(0,i-4), i+1); // up to 5 trailing
    const holes = windowRounds.flatMap(rr=>rr.holes||[]);
    const perRound = windowRounds.map(rr=>{
      const hs=rr.holes||[];
      const scaleTo18=18/(hs.length||18);
      return hs.reduce((a,h)=>a+(h.putts||0),0)*scaleTo18;
    });
    const avgPutts = perRound.length ? perRound.reduce((a,b)=>a+b,0)/perRound.length : null;
    const threePuttPerRound = windowRounds.map(rr=>{
      const hs=rr.holes||[];
      const scaleTo18=18/(hs.length||18);
      return hs.filter(h=>(h.putts||0)>=3).length*scaleTo18;
    });
    const threePuttAvg18 = threePuttPerRound.length ? threePuttPerRound.reduce((a,b)=>a+b,0)/threePuttPerRound.length : null;
    const updownAttempts = holes.filter(isUpDownAttempt);
    const updownSuccess = updownAttempts.filter(isUpDownSuccess);
    const updownPct = updownAttempts.length ? (updownSuccess.length/updownAttempts.length)*100 : null;
    const girPct = girPctOf(holes);
    const firPct = firPctOf(holes);
    const {puttingHcp, shortGameHcp, longGameHcp} = deriveHandicaps(windowRounds.length, avgPutts, threePuttAvg18, updownPct, girPct, firPct);
    return {ts:r.ts, puttingHcp, shortGameHcp, longGameHcp, avgPutts, threePuttAvg18, updownPct};
  });

  const ranged = range==="all" ? roundsChrono : roundsChrono.slice(-parseInt(range,10));
  // IMPORTANT: take the RANGE of rounds first, then filter/match snapshots
  // within that range — not filter-then-slice, which could silently return
  // fewer than N rounds' worth of data if any recent snapshot had a null
  // value (e.g. not enough rounds yet for a 3-round window), making "Last 5"
  // sometimes show data from outside the actual last 5 rounds.
  const rangedTsSet = new Set(ranged.map(r=>r.ts));
  const puttingTrendPts = snapshots.filter(s=>s.puttingHcp!=null && rangedTsSet.has(s.ts)).map(s=>({ts:s.ts, value:s.puttingHcp}));
  const shortGameTrendPts = snapshots.filter(s=>s.shortGameHcp!=null && rangedTsSet.has(s.ts)).map(s=>({ts:s.ts, value:s.shortGameHcp}));
  const longGameTrendPts = snapshots.filter(s=>s.longGameHcp!=null && rangedTsSet.has(s.ts)).map(s=>({ts:s.ts, value:s.longGameHcp}));

  // The headline numbers must respond to the selected range — computed
  // directly from exactly the rounds in that range (not always the single
  // most-recent 5-round snapshot, which never changed no matter what range
  // was tapped). "Last 5" means the handicap calculated from your last 5
  // rounds specifically, matching what the range buttons promise.
  const rangedHoles = ranged.flatMap(r=>r.holes||[]);
  const rangedPerRoundPutts = ranged.map(r=>{
    const hs=r.holes||[];
    const scaleTo18=18/(hs.length||18);
    return hs.reduce((a,h)=>a+(h.putts||0),0)*scaleTo18;
  });
  const rangedAvgPutts = rangedPerRoundPutts.length ? rangedPerRoundPutts.reduce((a,b)=>a+b,0)/rangedPerRoundPutts.length : null;
  const rangedThreePuttPerRound = ranged.map(r=>{
    const hs=r.holes||[];
    const scaleTo18=18/(hs.length||18);
    return hs.filter(h=>(h.putts||0)>=3).length*scaleTo18;
  });
  const rangedThreePuttAvg18 = rangedThreePuttPerRound.length ? rangedThreePuttPerRound.reduce((a,b)=>a+b,0)/rangedThreePuttPerRound.length : null;
  const rangedUpdownAttempts = rangedHoles.filter(isUpDownAttempt);
  const rangedUpdownSuccess = rangedUpdownAttempts.filter(isUpDownSuccess);
  const rangedUpdownPct = rangedUpdownAttempts.length ? (rangedUpdownSuccess.length/rangedUpdownAttempts.length)*100 : null;
  const rangedGirPct = girPctOf(rangedHoles);
  const rangedFirPct = firPctOf(rangedHoles);
  const latest = {
    ...deriveHandicaps(ranged.length, rangedAvgPutts, rangedThreePuttAvg18, rangedUpdownPct, rangedGirPct, rangedFirPct),
    avgPutts: rangedAvgPutts, threePuttAvg18: rangedThreePuttAvg18, updownPct: rangedUpdownPct, girPct: rangedGirPct, firPct: rangedFirPct,
  };

  // Same evenly-spaced sampling used in Sparkline and Scorecard History — at
  // most 15 plotted points across the full selected range, so the detailed
  // chart stays readable instead of cramming in every snapshot.
  function samplePoints(pts, max=15){
    if(pts.length<=max) return pts;
    const out=[];
    for(let i=0;i<max;i++){
      const srcIdx = Math.round((i/(max-1)) * (pts.length-1));
      out.push(pts[srcIdx]);
    }
    return out;
  }
  const HANDICAP_CHART_METRICS = {
    putting: {points:puttingTrendPts, labelKey:"puttingHcp", colorFor:v=>v<=5?GREEN:v<=15?AMBER:RED},
    shortGame: {points:shortGameTrendPts, labelKey:"shortGameHcp", colorFor:v=>v<=5?GREEN:v<=15?AMBER:RED},
    longGame: {points:longGameTrendPts, labelKey:"longGameHcp", colorFor:v=>v<=5?GREEN:v<=15?AMBER:RED},
  };
  const activeHcpMetric = HANDICAP_CHART_METRICS[chartMetric];
  const sampledHcpPoints = samplePoints(activeHcpMetric.points);

  return (
    <div>
      <button onClick={onBack} style={{background:"none",border:"none",color:PURPLE,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>← {t(lang,"back")}</button>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
        <div style={{width:52,height:52,background:PURPLE_BG,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>📊</div>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>{t(lang,"handicapHistory")}</div>
          <div style={{color:SLATE_L,fontSize:13,marginTop:2}}>{rounds.length} {rounds.length===1?t(lang,"roundCount"):t(lang,"roundCount2")}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:18}}>
        {[["5",t(lang,"last5")],["10",t(lang,"last10")],["25",t(lang,"last25")],["all",t(lang,"allTime")]].map(([v,l])=>(
          <button key={v} onClick={()=>setRange(v)}
            style={{flex:1,padding:"9px 4px",background:range===v?PURPLE:WHITE,border:"1.5px solid "+(range===v?PURPLE:BORDER),borderRadius:10,color:range===v?WHITE:TEXT_S,fontSize:12,fontWeight:range===v?700:500,cursor:"pointer"}}>
            {l}
          </button>
        ))}
      </div>

      {snapshots.length===0 ? (
        <div style={{background:WHITE,borderRadius:20,padding:"40px 24px",textAlign:"center",border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:44,marginBottom:14,opacity:0.3}}>📊</div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>{t(lang,"noSessionsYet")}</div>
        </div>
      ) : (
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
            {[[t(lang,"puttingHcp"),latest?.puttingHcp],[t(lang,"shortGameHcp"),latest?.shortGameHcp],[t(lang,"longGameHcp"),latest?.longGameHcp]].map(([l,v])=>(
              <div key={l} style={{background:PURPLE_BG,borderRadius:14,padding:"10px 6px",textAlign:"center",border:"1px solid "+PURPLE+"33"}}>
                <div style={{color:PURPLE,fontSize:8,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700,marginBottom:2}}>{l}</div>
                <div style={{color:NAVY,fontSize:17,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{fmtDerivedHcp(v)}</div>
              </div>
            ))}
          </div>

          <div style={{marginBottom:8}}>
            <label style={{color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:6}}>{t(lang,"selectMetricToReview")}</label>
            <select value={chartMetric} onChange={e=>setChartMetric(e.target.value)}
              style={{width:"100%",background:WHITE,border:"1.5px solid "+BORDER,borderRadius:12,color:NAVY,padding:"11px 14px",boxSizing:"border-box",fontSize:14,outline:"none",fontFamily:"inherit",fontWeight:600}}>
              <option value="putting">{t(lang,"puttingHcp")}</option>
              <option value="shortGame">{t(lang,"shortGameHcp")}</option>
              <option value="longGame">{t(lang,"longGameHcp")}</option>
            </select>
          </div>
          {sampledHcpPoints.length>1 ? (
            <div style={{marginBottom:18}}>
              <div style={{color:SLATE_L,fontSize:10,marginBottom:8,paddingLeft:2}}>
                {t(lang,"higherMeansHigherHcp")}
                {activeHcpMetric.points.length>sampledHcpPoints.length&&<> · {t(lang,"sampledFromRounds").replace("{n}",activeHcpMetric.points.length)}</>}
              </div>
              <DetailedTrendChart points={sampledHcpPoints} color={PURPLE} colorFor={activeHcpMetric.colorFor} suffix="" lang={lang}/>
            </div>
          ) : (
            <div style={{background:WHITE,borderRadius:16,padding:"24px 16px",textAlign:"center",marginBottom:18,border:"1px solid "+BORDER}}>
              <div style={{color:SLATE_L,fontSize:13}}>{t(lang,"needMoreRoundsForTrend")}</div>
            </div>
          )}

          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"roundOverview")}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
            {[...ranged].sort((a,b)=>b.ts-a.ts).map(r=>{
              const holes=r.holes||[];
              const tot=holes.reduce((a,h)=>a+(h.score||0),0);
              const par=holes.reduce((a,h)=>a+(h.par||0),0);
              const d=tot-par;
              const scaleTo18=18/(holes.length||18);
              const puttsTotal=Math.round(holes.reduce((a,h)=>a+(h.putts||0),0)*scaleTo18*10)/10;
              const threePuttCount=holes.filter(h=>(h.putts||0)>=3).length;
              const updownAttempts=holes.filter(isUpDownAttempt);
              const updownSuccess=updownAttempts.filter(isUpDownSuccess);
              const updownPctRound = updownAttempts.length ? Math.round((updownSuccess.length/updownAttempts.length)*100) : null;
              const updownStr = updownAttempts.length ? updownPctRound+"% ("+updownSuccess.length+"/"+updownAttempts.length+")" : "—";
              const girPctRound = girPctOf(holes);
              const firPctRound = firPctOf(holes);
              return (
                <div key={r.ts} onClick={()=>setModal(r)} style={{background:"linear-gradient(135deg,#f4f0fa,#f8f5fc)",borderRadius:14,padding:"12px 14px",border:"1.5px solid "+PURPLE+"33",cursor:"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div>
                      <div style={{color:NAVY,fontWeight:700,fontSize:13}}>{r.n}-{t(lang,"holes")}{r.course?" · "+r.course:""}</div>
                      <div style={{color:SLATE_L,fontSize:11}}>{fmt(r.ts)}</div>
                    </div>
                    <div style={{color:d<=0?GREEN:d<=5?AMBER:RED,fontWeight:700,fontSize:16,fontFamily:"Georgia,serif"}}>{d>=0?"+":""}{d}</div>
                  </div>
                  <div style={{display:"flex",gap:14,paddingTop:6,borderTop:"1px solid "+PURPLE+"22",flexWrap:"wrap"}}>
                    <div><span style={{color:SLATE_L,fontSize:10}}>{t(lang,"avgPutts")}: </span><span style={{color:NAVY,fontSize:12,fontWeight:700}}>{puttsTotal}</span></div>
                    <div><span style={{color:SLATE_L,fontSize:10}}>{t(lang,"threePuttsShort")}: </span><span style={{color:NAVY,fontSize:12,fontWeight:700}}>{threePuttCount}</span></div>
                    <div><span style={{color:SLATE_L,fontSize:10}}>{t(lang,"upAndDown")}: </span><span style={{color:NAVY,fontSize:12,fontWeight:700}}>{updownStr}</span></div>
                    {girPctRound!=null&&<div><span style={{color:SLATE_L,fontSize:10}}>GIR: </span><span style={{color:NAVY,fontSize:12,fontWeight:700}}>{girPctRound}%</span></div>}
                    {firPctRound!=null&&<div><span style={{color:SLATE_L,fontSize:10}}>FIR: </span><span style={{color:NAVY,fontSize:12,fontWeight:700}}>{firPctRound}%</span></div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"howCalculated")}</div>
          <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
            <p style={{color:TEXT_S,fontSize:12,lineHeight:1.6,margin:"0 0 10px"}}>{t(lang,"hcpCalcExplain")}</p>
            {latest&&latest.avgPutts!=null&&(
              <div style={{background:OFF,borderRadius:10,padding:"10px 12px",marginBottom:10}}>
                <div style={{color:SLATE_L,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{t(lang,"yourLatestNumbers")}</div>
                <div style={{color:TEXT,fontSize:12,lineHeight:1.7}}>
                  {t(lang,"avgPutts")}: <b>{Math.round(latest.avgPutts*10)/10}</b> {t(lang,"per18Holes")}<br/>
                  {t(lang,"threePutts")}: <b>{Math.round(latest.threePuttAvg18*10)/10}</b> {t(lang,"per18Holes")}<br/>
                  {latest.updownPct!=null&&<>{t(lang,"upAndDown")}: <b>{Math.round(latest.updownPct*10)/10}%</b><br/></>}
                  {latest.girPct!=null&&<>GIR: <b>{Math.round(latest.girPct*10)/10}%</b><br/></>}
                  {latest.firPct!=null&&<>FIR: <b>{Math.round(latest.firPct*10)/10}%</b></>}
                </div>
              </div>
            )}
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr style={{borderBottom:"2px solid "+BORDER}}>
                    <th style={{textAlign:"left",padding:"6px 4px",color:SLATE_L,fontWeight:700}}>{t(lang,"hcpLevel")}</th>
                    <th style={{textAlign:"right",padding:"6px 4px",color:SLATE_L,fontWeight:700}}>{t(lang,"avgPutts")}</th>
                    <th style={{textAlign:"right",padding:"6px 4px",color:SLATE_L,fontWeight:700}}>{t(lang,"threePuttsShort")}</th>
                    <th style={{textAlign:"right",padding:"6px 4px",color:SLATE_L,fontWeight:700}}>{t(lang,"upAndDownShort")}</th>
                    <th style={{textAlign:"right",padding:"6px 4px",color:SLATE_L,fontWeight:700}}>GIR</th>
                    <th style={{textAlign:"right",padding:"6px 4px",color:SLATE_L,fontWeight:700}}>FIR</th>
                  </tr>
                </thead>
                <tbody>
                  {HANDICAP_BENCHMARKS.map((b,i)=>(
                    <tr key={b.hcp} style={{borderBottom:i<HANDICAP_BENCHMARKS.length-1?"1px solid "+BORDER:"none"}}>
                      <td style={{padding:"6px 4px",color:NAVY,fontWeight:700}}>{b.hcp===0?t(lang,"scratch"):b.hcp}</td>
                      <td style={{textAlign:"right",padding:"6px 4px",color:TEXT_S}}>{b.putts}</td>
                      <td style={{textAlign:"right",padding:"6px 4px",color:TEXT_S}}>{b.threePuttsPerRound}</td>
                      <td style={{textAlign:"right",padding:"6px 4px",color:TEXT_S}}>{b.updownPct}%</td>
                      <td style={{textAlign:"right",padding:"6px 4px",color:TEXT_S}}>{b.girPct}%</td>
                      <td style={{textAlign:"right",padding:"6px 4px",color:TEXT_S}}>{b.firPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{color:SLATE_L,fontSize:10,fontStyle:"italic",marginTop:10}}>{t(lang,"derivedHandicapDisclaimer")}</div>
          </div>
        </>
      )}
      <ScorecardModal session={modal} lang={lang} onClose={()=>setModal(null)}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FINISHER HISTORY DETAIL — drill-down from a Finisher game's card. Shows
// the account holder's own score trend over time for that specific game
// (Putting / Short Game / Long Game Finisher), with the same 5/10/25/All-time
// selector used elsewhere, and a tappable session list that opens the same
// FinisherSummaryModal used in the History tab — so multiplayer context
// (other players who joined that session) is still visible from here.
// ═══════════════════════════════════════════════════════════════════════════
function FinisherHistoryDetail({gameId, allSessions, lang, onBack}){
  const [range,setRange]=useState("all"); // "5" | "10" | "25" | "all"
  const [modal,setModal]=useState(null);
  const game = FINISHERS[gameId];
  // Only the account holder's own records drive the trend/range (matching
  // how the summary card above already filters), but each one carries its
  // full player group for the modal so multiplayer sessions still show
  // everyone who played, not just the account holder in isolation.
  const ownSessions = allSessions.filter(s=>s.type==="finisher"&&s.gameId===gameId&&s.isAccount);
  const ownChrono = [...ownSessions].sort((a,b)=>a.ts-b.ts);
  const ranged = range==="all" ? ownChrono : ownChrono.slice(-parseInt(range,10));
  const rangedDesc = [...ranged].sort((a,b)=>b.ts-a.ts);

  const scoreTrend = ranged.map(s=>s.score);
  const pctTrend = ranged.map(s=>Math.round((s.score/(game?.max||s.max||1))*100));
  const avgScore = ranged.length ? Math.round(ranged.reduce((a,s)=>a+s.score,0)/ranged.length) : null;
  const bestScore = ranged.length ? Math.max(...ranged.map(s=>s.score)) : null;

  function groupFor(session){
    if(!session.sessionId) return [session];
    return allSessions.filter(x=>x.type==="finisher"&&x.sessionId===session.sessionId);
  }

  return (
    <div>
      <button onClick={onBack} style={{background:"none",border:"none",color:"#b8860a",cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>← {t(lang,"back")}</button>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
        <div style={{width:52,height:52,background:"#fff8e6",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{game?.emoji||"🏆"}</div>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>{txFin(lang,gameId,"name",game?.name||"")}</div>
          <div style={{color:SLATE_L,fontSize:13,marginTop:2}}>{ownSessions.length} {ownSessions.length===1?t(lang,"sessionsCount"):t(lang,"sessionsCount2")}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:18}}>
        {[["5",t(lang,"last5")],["10",t(lang,"last10")],["25",t(lang,"last25")],["all",t(lang,"allTime")]].map(([v,l])=>(
          <button key={v} onClick={()=>setRange(v)}
            style={{flex:1,padding:"9px 4px",background:range===v?"#b8860a":WHITE,border:"1.5px solid "+(range===v?"#b8860a":BORDER),borderRadius:10,color:range===v?WHITE:TEXT_S,fontSize:12,fontWeight:range===v?700:500,cursor:"pointer"}}>
            {l}
          </button>
        ))}
      </div>

      {ranged.length===0 ? (
        <div style={{background:WHITE,borderRadius:20,padding:"40px 24px",textAlign:"center",border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:44,marginBottom:14,opacity:0.3}}>{game?.emoji||"🏆"}</div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>{t(lang,"noSessionsYet")}</div>
        </div>
      ) : (
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
            {[[t(lang,"avgScore"),avgScore!=null?avgScore+"/"+(game?.max||""):"—"],[t(lang,"best"),bestScore!=null?bestScore+"/"+(game?.max||""):"—"]].map(([l,v])=>(
              <div key={l} style={{background:"#fff8e6",borderRadius:14,padding:"12px 8px",textAlign:"center",border:"1px solid "+GOLD+"55"}}>
                <div style={{color:"#b8860a",fontSize:9,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700,marginBottom:2}}>{l}</div>
                <div style={{color:NAVY,fontSize:19,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{v}</div>
              </div>
            ))}
          </div>

          {pctTrend.length>1&&(
            <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:18,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
              <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{t(lang,"scoreTrend")}</div>
              <div style={{color:SLATE_L,fontSize:10,marginBottom:10}}>{t(lang,"upMeansImproving")}</div>
              <Sparkline data={pctTrend} color="#b8860a"/>
            </div>
          )}

          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"allSessions")}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {rangedDesc.map(s=>{
              const group = groupFor(s);
              const isGroup = group.length>1;
              return (
                <div key={s.ts} onClick={()=>setModal(group)} style={{background:"linear-gradient(135deg,#fff8e6,#fef0d8)",borderRadius:14,padding:"12px 14px",border:"1.5px solid "+GOLD+"55",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{color:NAVY,fontWeight:700,fontSize:13}}>{fmt(s.ts)}{isGroup?" · "+group.length+" "+t(lang,"players"):""}</div>
                    <div style={{color:SLATE_L,fontSize:11}}>{Math.round((s.score/(game?.max||s.max||1))*100)}%</div>
                  </div>
                  <div style={{color:NAVY,fontWeight:700,fontSize:16,fontFamily:"Georgia,serif"}}>{s.score}<span style={{fontSize:12,color:SLATE_L}}>/{game?.max||s.max}</span></div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <FinisherSummaryModal session={modal} lang={lang} onClose={()=>setModal(null)}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ADD GOAL MODAL — pick one of the auto-tracked metrics, set a target value
// and a deadline. The CURRENT value at creation time is captured as
// startValue, so progress bars always show genuine progress from where the
// player started, not just "how close to the target" from an arbitrary
// fixed baseline.
// ═══════════════════════════════════════════════════════════════════════════
function AddGoalModal({sessions, hdcp, lang, existingMetricKeys, onSave, onClose}){
  const [metricKey,setMetricKey]=useState(null);
  const [target,setTarget]=useState("");
  const [periodMonths,setPeriodMonths]=useState(null);
  const [targetError,setTargetError]=useState("");

  function currentValueFor(key){
    if(key==="hcp") return hdcp?parseFloat(String(hdcp).replace(",",".")):null;
    return computeGoalMetric(key, sessions);
  }

  // Rejects targets that are mathematically impossible for the selected
  // metric — e.g. 150% for a GIR% goal, or a negative number of putts.
  // Previously there was NO validation at all here: any number typed in
  // would be saved as a legitimate goal, including ones no round could ever
  // satisfy.
  function validateTarget(num, metric){
    if(isNaN(num)) return t(lang,"targetInvalidNumber");
    // Most metrics can never legitimately be negative (you can't have -3
    // putts, or -10% GIR), but avgScoreVsPar is a genuine exception — a
    // skilled player aiming for "2 strokes under par on average" has a
    // perfectly real target of -2, which this check would otherwise
    // incorrectly block for being negative.
    if(num<0 && metric.key!=="avgScoreVsPar") return t(lang,"targetCannotBeNegative");
    if(metric.suffix==="%" && num>100) return t(lang,"targetOver100Pct");
    return "";
  }

  function handleSave(){
    const targetNum = parseFloat(target);
    const metric = GOAL_METRICS.find(m=>m.key===metricKey);
    if(!periodMonths || !metricKey || !metric) return;
    const err = validateTarget(targetNum, metric);
    if(err){ setTargetError(err); return; }
    const startValue = currentValueFor(metricKey) ?? targetNum; // if no data yet, start equals target (0% progress, not misleading)
    const now = Date.now();
    const deadline = new Date(now);
    deadline.setMonth(deadline.getMonth()+periodMonths);
    onSave({metricKey, target:targetNum, deadline:deadline.toISOString().split("T")[0], periodMonths, startValue, createdAt:now});
  }

  const selectedMetric = GOAL_METRICS.find(m=>m.key===metricKey);
  const currentVal = metricKey ? currentValueFor(metricKey) : null;
  const PERIODS = [[1,"period1m"],[3,"period3m"],[6,"period6m"],[12,"period12m"]];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:WHITE,borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:500,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
        <div style={{width:36,height:4,background:BORDER,borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>{t(lang,"newGoal")}</div>
          <button onClick={onClose} style={{background:OFF,border:"none",color:SLATE,fontSize:18,cursor:"pointer",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        <div style={{color:SLATE_L,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{t(lang,"chooseMetric")}</div>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:18}}>
          {GOAL_METRICS.map(m=>{
            const val = currentValueFor(m.key);
            const alreadyUsed = (existingMetricKeys||[]).includes(m.key);
            return (
              <button key={m.key} onClick={()=>!alreadyUsed&&setMetricKey(m.key)} disabled={alreadyUsed}
                style={{textAlign:"left",padding:"11px 14px",background:alreadyUsed?OFF:(metricKey===m.key?PURPLE_BG:OFF),border:"1.5px solid "+(alreadyUsed?BORDER:(metricKey===m.key?PURPLE:BORDER)),borderRadius:12,cursor:alreadyUsed?"default":"pointer",opacity:alreadyUsed?0.5:1}}>
                <div style={{color:metricKey===m.key&&!alreadyUsed?PURPLE:NAVY,fontWeight:700,fontSize:13}}>{t(lang,"goalMetric_"+m.key)}</div>
                <div style={{color:SLATE_L,fontSize:11,marginTop:1}}>{alreadyUsed?t(lang,"alreadyActiveGoal"):(val!=null?t(lang,"currentValue")+": "+Math.round(val*10)/10+(m.suffix||""):t(lang,"goalNoDataYet"))}</div>
              </button>
            );
          })}
        </div>

        {metricKey&&(
          <>
            <div style={{color:SLATE_L,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{t(lang,"setTarget")}</div>
            <input type="number" inputMode="decimal" value={target} onChange={e=>{setTarget(e.target.value);if(targetError)setTargetError("");}}
              placeholder={selectedMetric.lowerIsBetter?t(lang,"targetLowerPlaceholder"):t(lang,"targetHigherPlaceholder")}
              style={{width:"100%",background:OFF,border:"1.5px solid "+(targetError?RED:BORDER),borderRadius:12,color:TEXT,padding:"12px 14px",boxSizing:"border-box",fontSize:15,outline:"none",fontFamily:"inherit",marginBottom:targetError?6:18}}/>
            {targetError&&<div style={{color:RED,fontSize:11,fontWeight:600,marginBottom:18}}>⚠ {targetError}</div>}

            <div style={{color:SLATE_L,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{t(lang,"setPeriod")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:18}}>
              {PERIODS.map(([m,key])=>(
                <button key={m} onClick={()=>setPeriodMonths(m)}
                  style={{padding:"12px 4px",background:periodMonths===m?PURPLE:OFF,border:"1.5px solid "+(periodMonths===m?PURPLE:BORDER),borderRadius:12,color:periodMonths===m?WHITE:TEXT_S,fontWeight:periodMonths===m?700:500,fontSize:13,cursor:"pointer"}}>
                  {t(lang,key)}
                </button>
              ))}
            </div>
          </>
        )}

        <button onClick={handleSave} disabled={!metricKey||!target||!periodMonths}
          style={{width:"100%",padding:15,background:(!metricKey||!target||!periodMonths)?BORDER:GREEN_GRAD,border:"none",borderRadius:14,color:WHITE,fontWeight:700,fontSize:15,cursor:(!metricKey||!target||!periodMonths)?"default":"pointer"}}>
          {t(lang,"saveGoal")}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GOALS TAB — dedicated full-screen home for SMART goal tracking, replacing
// Player in the bottom nav (Player/Settings now live behind the name/HCP
// tap top-right instead). Every goal is tied to an auto-tracked metric —
// no manual progress updates, ever; this screen always reflects real data.
// ═══════════════════════════════════════════════════════════════════════════
// Builds a trend (oldest to newest) for any goal metric, using a trailing
// window of the last 5 rounds at each point in time — same approach as
// Handicap History, so a goal's graph reflects genuine progress over time
// rather than one static number. Handicap itself has no round-by-round
// history (it's self-reported), so it returns a flat empty trend — its
// progress bar alone is enough since there's no real time-series to show.
function computeGoalTrend(metricKey, sessions, createdAt){
  if(metricKey==="hcp") return [];
  const allRounds = (sessions||[]).filter(s=>s.type==="round").sort((a,b)=>a.ts-b.ts);
  // Only rounds played ON OR AFTER the goal was created count toward its
  // progress trend — a goal you set today shouldn't show "progress" made
  // months ago before you even set the target. Generates a point from the
  // very first round (deriveHandicaps/computeGoalMetric both compute from
  // round 1 now), so the trend starts as soon as there's any data — the
  // line chart itself still needs a 2nd point before it can draw an actual
  // line (DetailedTrendChart returns null below 2 points), so a single
  // point just won't render as a line yet, which is correct.
  const rounds = createdAt!=null ? allRounds.filter(r=>r.ts>=createdAt) : allRounds;
  if(rounds.length<1) return [];
  const points = [];
  for(let i=0;i<rounds.length;i++){
    const windowRounds = rounds.slice(Math.max(0,i-4), i+1);
    const val = computeGoalMetric(metricKey, windowRounds);
    if(val!=null) points.push({ts:rounds[i].ts, value:val});
  }
  return points;
}

// ═══════════════════════════════════════════════════════════════════════════
// RAISE THE BAR MODAL — shown when a goal is reached before its deadline and
// the player wants to keep going instead of stopping. Pre-fills a sensibly
// harder target (one step further past the original target, in the same
// direction) using the goal's own metric direction, but lets the player
// override it. The original goal is archived as "reached" by the caller;
// this only decides what the NEXT target and timeframe should be.
// ═══════════════════════════════════════════════════════════════════════════
function RaiseBarModal({goal, lang, onConfirm, onClose}){
  const metric = GOAL_METRICS.find(m=>m.key===goal.metricKey);
  // A reasonable default next target: push the same distance again, in the
  // same direction as the original start->target gap, rather than asking
  // the player to invent a number from nothing. Percentage metrics (GIR%,
  // FIR%, Up&Down%) are clamped below 100 — a suggested target AT or ABOVE
  // 100% would be a literally impossible goal for any of those stats, which
  // a large enough original gap could otherwise produce unchecked.
  const originalGap = Math.abs(goal.target-goal.startValue) || 1;
  // The 0-floor below is correct for every metric EXCEPT avgScoreVsPar —
  // you can't have negative putts or a negative percentage, but you CAN
  // have a negative score-vs-par (aiming to average under par). Without
  // this exception, a player who already reached "average even par" and
  // wants to raise the bar further would get a suggested next target of 0
  // again — the same number they already hit, not a genuinely harder one.
  let suggested = metric.lowerIsBetter
    ? (metric.key==="avgScoreVsPar" ? goal.target-originalGap*0.5 : Math.max(0, goal.target-originalGap*0.5))
    : goal.target+originalGap*0.5;
  if(metric.suffix==="%") suggested = Math.min(suggested, 95);
  const [target,setTarget]=useState(String(Math.round(suggested*10)/10));
  const [periodMonths,setPeriodMonths]=useState(goal.periodMonths||3);
  const [targetError,setTargetError]=useState("");
  const PERIODS = [[1,"period1m"],[3,"period3m"],[6,"period6m"],[12,"period12m"]];

  // Same validation as AddGoalModal — prevents an impossible target (e.g.
  // over 100% for a percentage metric, or a negative number) from being
  // saved when the player overrides the suggested value.
  function validateTarget(num){
    if(isNaN(num)) return t(lang,"targetInvalidNumber");
    // Same exception as AddGoalModal's validateTarget — avgScoreVsPar can
    // legitimately have a negative target (e.g. -2 = aiming for 2 under par
    // on average), which a blanket "no negatives" rule would incorrectly
    // block.
    if(num<0 && metric.key!=="avgScoreVsPar") return t(lang,"targetCannotBeNegative");
    if(metric.suffix==="%" && num>100) return t(lang,"targetOver100Pct");
    return "";
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:WHITE,borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:500,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
        <div style={{width:36,height:4,background:BORDER,borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>{t(lang,"raiseTheBar")}</div>
          <button onClick={onClose} style={{background:OFF,border:"none",color:SLATE,fontSize:18,cursor:"pointer",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{color:SLATE_L,fontSize:12,marginBottom:18}}>{t(lang,"raiseTheBarDesc").replace("{metric}",t(lang,"goalMetric_"+goal.metricKey)).replace("{target}",goal.target+(metric.suffix||""))}</div>

        <div style={{color:SLATE_L,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{t(lang,"setTarget")}</div>
        <input type="number" inputMode="decimal" value={target} onChange={e=>{setTarget(e.target.value);if(targetError)setTargetError("");}}
          style={{width:"100%",background:OFF,border:"1.5px solid "+(targetError?RED:BORDER),borderRadius:12,color:TEXT,padding:"12px 14px",boxSizing:"border-box",fontSize:15,outline:"none",fontFamily:"inherit",marginBottom:targetError?6:18}}/>
        {targetError&&<div style={{color:RED,fontSize:11,fontWeight:600,marginBottom:18}}>⚠ {targetError}</div>}

        <div style={{color:SLATE_L,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{t(lang,"setPeriod")}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:18}}>
          {PERIODS.map(([m,key])=>(
            <button key={m} onClick={()=>setPeriodMonths(m)}
              style={{padding:"12px 4px",background:periodMonths===m?PURPLE:OFF,border:"1.5px solid "+(periodMonths===m?PURPLE:BORDER),borderRadius:12,color:periodMonths===m?WHITE:TEXT_S,fontWeight:periodMonths===m?700:500,fontSize:13,cursor:"pointer"}}>
              {t(lang,key)}
            </button>
          ))}
        </div>

        <button onClick={()=>{
            const n=parseFloat(target);
            const err = validateTarget(n);
            if(err){ setTargetError(err); return; }
            onConfirm(n,periodMonths);
          }} disabled={!target}
          style={{width:"100%",padding:15,background:!target?BORDER:GREEN_GRAD,border:"none",borderRadius:14,color:WHITE,fontWeight:700,fontSize:15,cursor:!target?"default":"pointer"}}>
          {t(lang,"saveGoal")}
        </button>
      </div>
    </div>
  );
}

function GoalsTab({sessions, hdcp, userId, lang}){
  const [goals,setGoals]=useState(()=>getGoals(userId));
  const [archive,setArchive]=useState(()=>getGoalArchive(userId));
  const [showAddGoal,setShowAddGoal]=useState(false);
  const [showHistory,setShowHistory]=useState(false);
  const [showProgressFor,setShowProgressFor]=useState(null); // the goal object currently drilled into, or null
  const [raiseBarIdx,setRaiseBarIdx]=useState(null); // index of the goal currently being re-targeted, or null

  function valueFor(g){
    if(g.metricKey==="hcp") return hdcp?parseFloat(String(hdcp).replace(",",".")):null;
    // IMPORTANT: only rounds played ON OR AFTER the goal was created count
    // toward "current" — averaging in rounds from before the goal existed
    // would mean the progress bar and the "current" number aren't actually
    // measuring progress made toward this specific goal, just a lifetime
    // average that happens to include some matching rounds. The goal's
    // whole premise (start value vs target) only makes sense against data
    // from the same window the goal has been active for.
    const sinceGoal = (sessions||[]).filter(s=>s.type==="round"&&s.ts>=g.createdAt);
    return computeGoalMetric(g.metricKey, sinceGoal);
  }
  function isReached(g, current){
    const metric = GOAL_METRICS.find(m=>m.key===g.metricKey);
    return current!=null && (metric.lowerIsBetter ? current<=g.target : current>=g.target);
  }

  // On every load, sweep for goals that are now reached OR whose deadline
  // has passed without being reached, and move them to the archive
  // automatically — a goal's outcome shouldn't depend on the player
  // remembering to come back and close it out manually.
  useEffect(()=>{
    // IMPORTANT: only EXPIRED goals (deadline passed, not reached) get
    // auto-archived — that's a fact, not a decision. A REACHED goal is
    // deliberately left active here: hitting a target before the deadline
    // should be a moment where the player chooses what happens next (mark
    // it achieved, or raise the bar and keep training toward a new target),
    // not something the app silently closes out on their behalf the next
    // time they open the tab.
    const stillActive = [];
    let archiveChanged = false;
    const newArchiveEntries = [];
    for(const g of goals){
      const current = valueFor(g);
      const reached = isReached(g, current);
      const daysLeft = Math.ceil((new Date(g.deadline).getTime()-Date.now())/86400000);
      if(!reached && daysLeft<0){
        newArchiveEntries.push({...g, outcome:"expired", finalValue:current, archivedAt:Date.now()});
        archiveChanged = true;
      } else {
        stillActive.push(g);
      }
    }
    if(archiveChanged){
      const updatedArchive = [...getGoalArchive(userId), ...newArchiveEntries];
      saveGoals(userId, stillActive);
      save("caddy_goals_archive_"+userId, updatedArchive);
      setGoals(stillActive);
      setArchive(updatedArchive);
    }
  },[]); // eslint-disable-line — intentionally runs once per tab visit, not on every render

  function addGoal(g){
    const updated=[...goals,g];
    setGoals(updated);
    saveGoals(userId,updated);
    setShowAddGoal(false);
  }
  // The player explicitly marks a reached goal as achieved — archives it
  // with outcome "reached", same as before, just now requiring a deliberate
  // tap instead of happening automatically the moment the target is hit.
  function markAchieved(idx){
    const g = goals[idx];
    const current = valueFor(g);
    const updatedArchive = [...archive, {...g, outcome:"reached", finalValue:current, archivedAt:Date.now()}];
    const updated = goals.filter((_,i)=>i!==idx);
    setGoals(updated);
    saveGoals(userId,updated);
    setArchive(updatedArchive);
    save("caddy_goals_archive_"+userId, updatedArchive);
  }
  // Raising the bar: the player reached the original target early and wants
  // to keep going rather than stop. Archives the ORIGINAL goal as reached
  // (so it still shows up properly in history with its real target), then
  // immediately creates a fresh goal on the same metric with a harder target
  // and a new deadline — current performance becomes the new starting point.
  function raiseTheBar(idx, newTarget, newPeriodMonths){
    const g = goals[idx];
    const current = valueFor(g);
    const updatedArchive = [...archive, {...g, outcome:"reached", finalValue:current, archivedAt:Date.now()}];
    const now = Date.now();
    const deadline = new Date(now);
    deadline.setMonth(deadline.getMonth()+newPeriodMonths);
    const newGoal = {metricKey:g.metricKey, target:newTarget, startValue:current, deadline:deadline.toISOString().split("T")[0], periodMonths:newPeriodMonths, createdAt:now};
    const updated = [...goals.filter((_,i)=>i!==idx), newGoal];
    setGoals(updated);
    saveGoals(userId,updated);
    setArchive(updatedArchive);
    save("caddy_goals_archive_"+userId, updatedArchive);
  }
  // Ending a goal early (the player's own choice, not an automatic reached/
  // expired sweep) still archives it rather than deleting it outright, so
  // the History section reflects everything that was ever tried.
  function endGoalEarly(idx){
    const g = goals[idx];
    const current = valueFor(g);
    const updatedArchive = [...archive, {...g, outcome:"ended", finalValue:current, archivedAt:Date.now()}];
    const updated = goals.filter((_,i)=>i!==idx);
    setGoals(updated);
    saveGoals(userId,updated);
    setArchive(updatedArchive);
    save("caddy_goals_archive_"+userId, updatedArchive);
  }
  // Wipes the archived (reached/expired/ended) goals shown in Goal History.
  // Does NOT touch active goals — only past ones, same "Clear All" scope as
  // the Session History tab's own Clear All.
  function clearGoalArchive(){
    setArchive([]);
    save("caddy_goals_archive_"+userId, []);
  }

  const enriched = goals.map(g=>{
    const current = valueFor(g);
    const metric = GOAL_METRICS.find(m=>m.key===g.metricKey);
    const hasData = current!=null;
    const span = metric.lowerIsBetter ? (g.startValue-g.target) : (g.target-g.startValue);
    const progressPct = hasData ? (span===0 ? 100 : Math.max(0,Math.min(100,
      metric.lowerIsBetter ? ((g.startValue-current)/span)*100 : ((current-g.startValue)/span)*100
    ))) : 0;
    const daysLeft = Math.ceil((new Date(g.deadline).getTime()-Date.now())/86400000);
    const reached = hasData && isReached(g, current);
    return {...g, current, metric, hasData, progressPct, daysLeft, reached};
  });

  return (
    <div>
      <div style={{marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:24,fontWeight:700}}>{t(lang,"goals")}</div>
          <div style={{color:SLATE_L,fontSize:13,marginTop:3}}>{t(lang,"goalsTagline")}</div>
        </div>
        {archive.length>0&&(
          <button onClick={()=>setShowHistory(true)} style={{background:"none",border:"none",color:PURPLE,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{t(lang,"goalHistory")} ›</button>
        )}
      </div>

      <div style={{background:PURPLE_BG,borderRadius:12,padding:"10px 14px",marginBottom:18,display:"flex",alignItems:"flex-start",gap:8}}>
        <span style={{fontSize:14,lineHeight:1.3}}>ℹ️</span>
        <div style={{color:PURPLE,fontSize:11,lineHeight:1.5}}>{t(lang,"goalsDataScopeNote")}</div>
      </div>

      {goals.length===0?(
        <button onClick={()=>setShowAddGoal(true)} style={{width:"100%",background:WHITE,border:"1.5px dashed "+BORDER,borderRadius:20,padding:"40px 24px",cursor:"pointer",textAlign:"center"}}>
          <div style={{fontSize:44,marginBottom:14}}>🎯</div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,marginBottom:6}}>{t(lang,"setFirstGoal")}</div>
          <div style={{color:SLATE_L,fontSize:13,lineHeight:1.5,maxWidth:280,margin:"0 auto"}}>{t(lang,"goalsEmptyDesc")}</div>
        </button>
      ):(
        <>
          {goals.length<GOAL_METRICS.length&&(
            <button onClick={()=>setShowAddGoal(true)} style={{width:"100%",padding:14,background:GREEN_GRAD,border:"none",borderRadius:16,color:WHITE,fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:20,boxShadow:"0 3px 14px rgba(58,125,74,0.3)"}}>
              + {t(lang,"addGoal")}
            </button>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {enriched.map((g,idx)=>{
              // IMPORTANT: use the exact same per-round calculation as
              // GoalProgressModal's detail view (computeSingleRoundMetric,
              // one point per round) — NOT computeGoalTrend's 5-round
              // rolling average. Using a different method here than in the
              // detail view meant the mini-chart preview and the full chart
              // could show different point counts and different shapes for
              // the same goal, which was confusing rather than a genuine
              // preview of what tapping in would show.
              const sinceGoalRounds = sessions.filter(s=>s.type==="round"&&s.ts>=g.createdAt).sort((a,b)=>a.ts-b.ts);
              const trendValues = sinceGoalRounds.map(r=>computeSingleRoundMetric(g.metricKey, r)).filter(v=>v!=null);
              const urgent = !g.reached && g.daysLeft<=7 && g.daysLeft>=0;
              return (
              <div key={idx} style={{background:g.reached?GREEN_BG:WHITE,borderRadius:18,padding:18,border:"1.5px solid "+(g.reached?GREEN+"55":(urgent?AMBER+"66":BORDER)),boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{color:NAVY,fontWeight:700,fontSize:15}}>{g.reached?"🎯 ":""}{t(lang,"goalMetric_"+g.metricKey)}</div>
                    <div style={{color:g.reached?GREEN:(urgent?AMBER:SLATE_L),fontSize:12,marginTop:2,fontWeight:(g.reached||urgent)?700:400}}>
                      {g.reached
                        ? t(lang,"goalReached")
                        : (!g.hasData ? t(lang,"goalNoDataYet") : <>{g.daysLeft===1?t(lang,"dayLeft"):t(lang,"daysLeft")} · {g.daysLeft}</>)}
                    </div>
                  </div>
                  {!g.reached&&(
                    <button onClick={()=>endGoalEarly(idx)} style={{background:OFF,border:"none",color:SLATE_L,fontSize:14,cursor:"pointer",padding:0,width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                  )}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8,gap:8}}>
                  <div>
                    <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700}}>{t(lang,"startedAt")}</div>
                    <div style={{color:TEXT_S,fontSize:15,fontWeight:700}}>{Math.round(g.startValue*10)/10}{g.metric.suffix||""}</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700}}>{t(lang,"currentlyAt")}</div>
                    <div style={{color:NAVY,fontSize:22,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>
                      {g.hasData?Math.round(g.current*10)/10+(g.metric.suffix||""):"—"}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700}}>{t(lang,"target")}</div>
                    <div style={{color:PURPLE,fontSize:15,fontWeight:700}}>{g.target}{g.metric.suffix||""}</div>
                  </div>
                </div>
                <div style={{background:"#eef0f4",borderRadius:20,height:8,overflow:"hidden"}}>
                  <div style={{height:"100%",width:g.progressPct+"%",background:g.reached?GREEN:PURPLE,borderRadius:20,transition:"width 0.3s"}}/>
                </div>
                <div style={{color:SLATE_L,fontSize:11,marginTop:6,textAlign:"right"}}>{Math.round(g.progressPct)}% {t(lang,"ofTheWay")}</div>
                {g.reached?(
                  <div style={{display:"flex",gap:8,marginTop:14,paddingTop:14,borderTop:"1px solid "+GREEN+"33"}}>
                    <button onClick={()=>markAchieved(idx)} style={{flex:1,padding:11,background:WHITE,border:"1.5px solid "+GREEN,borderRadius:12,color:GREEN,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                      {t(lang,"markAchieved")}
                    </button>
                    <button onClick={()=>setRaiseBarIdx(idx)} style={{flex:1,padding:11,background:GREEN_GRAD,border:"none",borderRadius:12,color:WHITE,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                      {t(lang,"raiseTheBar")}
                    </button>
                  </div>
                ):g.hasData&&(
                  <div onClick={()=>setShowProgressFor(g)} style={{marginTop:14,paddingTop:14,borderTop:"1px solid "+BORDER,cursor:"pointer"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:trendValues.length>1?8:0}}>
                      <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>{t(lang,"progressOverTime")}</div>
                      <div style={{color:PURPLE,fontSize:10,fontWeight:700}}>{t(lang,"viewDetails")} ›</div>
                    </div>
                    {/* A single round can't draw a line (Sparkline needs 2+
                        points), but that's not a reason to hide the entry
                        point entirely — the detail view itself already
                        handles 1-round data with its own per-round chart and
                        round list, so tapping in is still genuinely useful
                        even before a second round exists. */}
                    {trendValues.length>1
                      ? <Sparkline data={trendValues} color={PURPLE} invert={g.metric.lowerIsBetter}/>
                      : <div style={{color:SLATE_L,fontSize:11}}>{t(lang,"oneRoundLoggedSoFar")}</div>}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </>
      )}

      {showAddGoal&&<AddGoalModal sessions={sessions} hdcp={hdcp} lang={lang} existingMetricKeys={goals.map(g=>g.metricKey)} onSave={addGoal} onClose={()=>setShowAddGoal(false)}/>}
      {showHistory&&<GoalHistoryModal archive={archive} lang={lang} onClose={()=>setShowHistory(false)} onClearAll={clearGoalArchive}/>}
      {showProgressFor&&<GoalProgressModal goal={showProgressFor} metric={GOAL_METRICS.find(m=>m.key===showProgressFor.metricKey)} sessions={sessions} lang={lang} onClose={()=>setShowProgressFor(null)}/>}
      {raiseBarIdx!=null&&<RaiseBarModal goal={enriched[raiseBarIdx]} lang={lang}
        onConfirm={(newTarget,newPeriodMonths)=>{raiseTheBar(raiseBarIdx,newTarget,newPeriodMonths);setRaiseBarIdx(null);}}
        onClose={()=>setRaiseBarIdx(null)}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GOAL HISTORY MODAL — every goal that's ever been reached, expired, or
// manually ended, with its final result clearly labeled. This is the "review
// what happened, then set a new goal" loop — closing the loop on a finished
// goal instead of it just vanishing.
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// GOAL PROGRESS MODAL — what actually happened since this goal was set.
// Tapping the sparkline on a goal card opens this: the same trend with real
// axis labels and dates instead of an unlabeled mini-chart, plus the actual
// list of rounds that fed into it (tappable into the full scorecard), so
// "progress over time" means something concrete, not just a shape.
// ═══════════════════════════════════════════════════════════════════════════
function GoalProgressModal({goal, metric, sessions, lang, onClose}){
  const [modal,setModal]=useState(null);
  // IMPORTANT: the chart and the rounds list below it must show the exact
  // SAME data — one point per round, using that round's own value for the
  // tracked metric (via computeSingleRoundMetric), not a multi-round rolling
  // average (computeGoalTrend). Mixing those two was why the chart and the
  // list never lined up: the chart had fewer, smoothed points while the
  // list had one row per individual round.
  const rounds = (sessions||[]).filter(s=>s.type==="round"&&s.ts>=goal.createdAt).sort((a,b)=>a.ts-b.ts);
  const roundPoints = rounds.map(r=>({ts:r.ts, value:computeSingleRoundMetric(goal.metricKey, r)})).filter(p=>p.value!=null);
  const values = roundPoints.map(p=>p.value);
  // The genuine "current" status — averaged across every round since the
  // goal was created (the same fix applied in GoalsTab), NOT just the single
  // most recent round, which is too noisy on its own to call a real status.
  const current = computeGoalMetric(goal.metricKey, rounds);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:WHITE,borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:500,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
        <div style={{width:36,height:4,background:BORDER,borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>{t(lang,"goalMetric_"+goal.metricKey)}</div>
          <button onClick={onClose} style={{background:OFF,border:"none",color:SLATE,fontSize:18,cursor:"pointer",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{color:SLATE_L,fontSize:12,marginBottom:18}}>{t(lang,"sinceGoalSetOn")} {fmt(goal.createdAt)}</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
          <div style={{background:OFF,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
            <div style={{color:SLATE_L,fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{t(lang,"startedAt")}</div>
            <div style={{color:TEXT_S,fontSize:15,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{Math.round(goal.startValue*10)/10}{metric.suffix||""}</div>
          </div>
          <div style={{background:GREEN_BG,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
            <div style={{color:GREEN,fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{t(lang,"currentlyAt")}</div>
            <div style={{color:NAVY,fontSize:17,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{current!=null?Math.round(current*10)/10+(metric.suffix||""):"—"}</div>
          </div>
          <div style={{background:PURPLE_BG,borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
            <div style={{color:PURPLE,fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{t(lang,"target")}</div>
            <div style={{color:NAVY,fontSize:15,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{goal.target}{metric.suffix||""}</div>
          </div>
        </div>

        {current!=null&&(()=>{
          // STATUS: where you are now (proper since-goal average, not one
          // noisy round) compared against where you started and the target.
          const distStart = Math.abs(goal.startValue-goal.target);
          const distNow = Math.abs(current-goal.target);
          const progressFrac = distStart===0 ? 1 : Math.max(0, Math.min(1, (distStart-distNow)/distStart));
          const reached = distNow===0 || (metric.lowerIsBetter ? current<=goal.target : current>=goal.target);
          const flat = !reached && distNow===distStart;
          const improving = !reached && !flat && distNow<distStart;
          const delta = Math.round(Math.abs(current-goal.startValue)*10)/10;

          // ON TRACK / OFF TRACK: compares how much of the NEEDED progress
          // has actually happened against how much of the AVAILABLE time has
          // elapsed. If you're 40% of the way to the target but 80% of the
          // time is gone, that's off track even though you're still
          // technically "improving" — pace matters, not just direction.
          const totalSpan = goal.deadline ? (new Date(goal.deadline).getTime()-goal.createdAt) : null;
          const elapsed = totalSpan ? Math.max(0, Math.min(1, (Date.now()-goal.createdAt)/totalSpan)) : null;
          const onTrack = reached ? true : (elapsed!=null ? progressFrac >= elapsed*0.85 : null); // small 15% grace margin
          const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline).getTime()-Date.now())/86400000) : null;

          const statusColor = reached ? GREEN : (flat ? TEXT_S : (onTrack===false ? RED : (improving?GREEN:RED)));
          const statusBg = reached ? GREEN_BG : (flat ? OFF : (onTrack===false ? "#fdeaea" : (improving?GREEN_BG:"#fdeaea")));
          const statusEmoji = reached ? "🎯" : (flat ? "➖" : (onTrack===false ? "⚠️" : (improving?"📈":"📉")));
          return (
            <>
            <div style={{background:statusBg,borderRadius:14,padding:"12px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:20}}>{statusEmoji}</div>
              <div>
                <div style={{color:statusColor,fontWeight:700,fontSize:13}}>
                  {reached?t(lang,"goalReached"):(flat?t(lang,"trendFlat"):(improving?t(lang,"gettingBetter"):t(lang,"gettingWorse")))}
                </div>
                <div style={{color:SLATE_L,fontSize:11,marginTop:1}}>
                  {reached
                    ? t(lang,"currentlyAt")+" "+Math.round(current*10)/10+(metric.suffix||"")
                    : (flat ? t(lang,"latestSameAsStart") : t(lang,improving?"trendImprovedBy":"trendWorsenedBy").replace("{n}", delta+(metric.suffix||"")))}
                </div>
              </div>
            </div>
            {!reached&&onTrack!=null&&(
              <div style={{background:onTrack?GREEN_BG:"#fff4e0",borderRadius:14,padding:"12px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:10,border:"1px solid "+(onTrack?GREEN:AMBER)+"33"}}>
                <div style={{fontSize:18}}>{onTrack?"✅":"⏳"}</div>
                <div>
                  <div style={{color:onTrack?GREEN:AMBER,fontWeight:700,fontSize:13}}>{onTrack?t(lang,"onTrack"):t(lang,"offTrack")}</div>
                  <div style={{color:SLATE_L,fontSize:11,marginTop:1}}>
                    {Math.round(progressFrac*100)}% {t(lang,"ofProgressMade")} · {daysLeft>=0?daysLeft+" "+t(lang,daysLeft===1?"dayLeft":"daysLeft"):t(lang,"deadlinePassed")}
                  </div>
                </div>
              </div>
            )}
            </>
          );
        })()}

        {values.length>1?(
          <div style={{marginBottom:18}}>
            <DetailedTrendChart
              points={roundPoints}
              color={PURPLE}
              suffix={metric.suffix||""}
              lang={lang}
              targetLine={goal.target}
              colorFor={v=>{
                const hitsTarget = metric.lowerIsBetter ? v<=goal.target : v>=goal.target;
                return hitsTarget ? GREEN : RED;
              }}
            />
            <div style={{display:"flex",alignItems:"center",gap:14,marginTop:10,justifyContent:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:14,height:0,borderTop:"1.5px dashed "+GREEN}}/>
                <span style={{color:SLATE_L,fontSize:10,fontWeight:600}}>{t(lang,"target")}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:GREEN}}/>
                <span style={{color:SLATE_L,fontSize:10,fontWeight:600}}>{t(lang,"atOrBeyondTarget")}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:RED}}/>
                <span style={{color:SLATE_L,fontSize:10,fontWeight:600}}>{t(lang,"shortOfTarget")}</span>
              </div>
            </div>
          </div>
        ):(
          <div style={{background:OFF,borderRadius:16,padding:"24px 16px",textAlign:"center",marginBottom:18}}>
            <div style={{color:SLATE_L,fontSize:13}}>{t(lang,"needMoreRoundsForTrend")}</div>
          </div>
        )}

        <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"roundsSinceGoalSet")}</div>
        {rounds.length===0?(
          <div style={{color:SLATE_L,fontSize:13,padding:"12px 0"}}>{t(lang,"noRoundsSinceGoalSet")}</div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[...rounds].sort((a,b)=>b.ts-a.ts).map(r=>{
              // Show THIS round's own value for the metric the goal is
              // actually tracking — e.g. a 3-putts goal highlights how many
              // 3-putts happened in this specific round, not its score vs
              // par, which may have nothing to do with what's being worked on.
              const single = computeSingleRoundMetric(goal.metricKey, r);
              const hasSingle = single!=null;
              return (
                <div key={r.ts} onClick={()=>setModal(r)} style={{background:WHITE,border:"1.5px solid "+BORDER,borderRadius:14,padding:"12px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{color:NAVY,fontWeight:700,fontSize:13}}>{r.course||r.n+"-"+t(lang,"holes")}{r.roundType==="competition"?" 🏆":""}</div>
                    <div style={{color:SLATE_L,fontSize:11}}>{fmt(r.ts)}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:NAVY,fontWeight:700,fontSize:15,fontFamily:"Georgia,serif"}}>{hasSingle?Math.round(single*10)/10+(metric.suffix||""):"—"}</div>
                    <div style={{color:SLATE_L,fontSize:9,textTransform:"uppercase",letterSpacing:0.5}}>{t(lang,"goalMetric_"+goal.metricKey)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ScorecardModal session={modal} lang={lang} onClose={()=>setModal(null)}/>
    </div>
  );
}

function GoalHistoryModal({archive, lang, onClose, onClearAll}){
  const sorted = [...archive].sort((a,b)=>b.archivedAt-a.archivedAt);
  const [confirmClearAll,setConfirmClearAll]=useState(false);
  const OUTCOME_STYLE = {
    reached: {emoji:"🎯", color:GREEN, bg:GREEN_BG, labelKey:"goalOutcomeReached"},
    expired: {emoji:"⏱", color:AMBER, bg:"#fff8e8", labelKey:"goalOutcomeExpired"},
    ended:   {emoji:"⏹", color:SLATE_L, bg:OFF, labelKey:"goalOutcomeEnded"},
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:WHITE,borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:500,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
        <div style={{width:36,height:4,background:BORDER,borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>{t(lang,"goalHistory")}</div>
          <button onClick={onClose} style={{background:OFF,border:"none",color:SLATE,fontSize:18,cursor:"pointer",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {sorted.length>0&&(
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:confirmClearAll?10:14}}>
            <button onClick={()=>setConfirmClearAll(true)}
              style={{background:WHITE,border:"1px solid "+RED+"44",color:RED,borderRadius:10,padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600}}>
              {t(lang,"clearAll")}
            </button>
          </div>
        )}
        {confirmClearAll&&(
          <div style={{background:"#fef0f0",border:"1px solid "+RED+"44",borderRadius:14,padding:"12px 14px",marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
            <span style={{color:NAVY,fontSize:12,fontWeight:600,flex:1}}>{t(lang,"confirmClear")}</span>
            <button onClick={()=>setConfirmClearAll(false)} style={{padding:"6px 12px",background:WHITE,border:"1px solid "+BORDER,borderRadius:8,fontSize:11,cursor:"pointer",color:TEXT_S,fontWeight:600}}>{t(lang,"cancel")}</button>
            <button onClick={()=>{onClearAll();setConfirmClearAll(false);}} style={{padding:"6px 12px",background:RED,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",color:WHITE,fontWeight:700}}>{t(lang,"delete")}</button>
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {sorted.map((g,idx)=>{
            const metric = GOAL_METRICS.find(m=>m.key===g.metricKey);
            const style = OUTCOME_STYLE[g.outcome] || OUTCOME_STYLE.ended;
            return (
              <div key={idx} style={{background:style.bg,borderRadius:14,padding:14,border:"1.5px solid "+style.color+"44"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{color:NAVY,fontWeight:700,fontSize:13}}>{style.emoji} {t(lang,"goalMetric_"+g.metricKey)}</div>
                    <div style={{color:style.color,fontSize:11,fontWeight:700,marginTop:1}}>{t(lang,style.labelKey)}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:NAVY,fontSize:14,fontWeight:700}}>{g.finalValue!=null?Math.round(g.finalValue*10)/10+(metric?.suffix||""):"—"}</div>
                    <div style={{color:SLATE_L,fontSize:10}}>{t(lang,"target")}: {g.target}{metric?.suffix||""}</div>
                  </div>
                </div>
                <div style={{color:SLATE_L,fontSize:10,marginTop:6}}>{fmt(g.archivedAt)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatsTab({sessions, lang, hdcp, userId, onGoTrain, onGoScore}){
  const [selectedFocus,setSelectedFocus]=useState(null);
  const [showScorecardHistory,setShowScorecardHistory]=useState(false);
  const [showHandicapHistory,setShowHandicapHistory]=useState(false);
  const [showFinisherHistory,setShowFinisherHistory]=useState(null); // null or the gameId being viewed
  const trains=sessions.filter(s=>s.type==="train");
  const rounds=sessions.filter(s=>s.type==="round");
  const allH=rounds.flatMap(r=>r.holes||[]);
  const streak=calcStreak(sessions);
  const byFocusRaw=FOCUS_AREAS.map(f=>{
    const ss=trains.filter(s=>s.focusId===f.id).sort((a,b)=>a.ts-b.ts);
    const avg=ss.length?Math.round(ss.reduce((a,s)=>a+(s.score/s.exMax)*100,0)/ss.length):null;
    // Growth = most recent exercise vs the one right before it (not vs the very first ever).
    const lastP=ss.length?Math.round((ss[ss.length-1].score/ss[ss.length-1].exMax)*100):null;
    const prevP=ss.length>=2?Math.round((ss[ss.length-2].score/ss[ss.length-2].exMax)*100):null;
    const trend=(lastP!==null&&prevP!==null)?lastP-prevP:null;
    const pcts=ss.map(s=>Math.round((s.score/s.exMax)*100));
    return {...f,count:ss.length,avg,trend,pcts,sessions:ss};
  });
  // Status badge per category — replaces the separate "Focus Recommendation"
  // list, which just duplicated this same ranking in its own section for no
  // real benefit. "Strong" if at or above 80%; the single weakest category
  // below 80% gets "Focus" (determined by comparing across all categories,
  // which is why this has to happen after byFocusRaw is fully built, not
  // inside each card independently).
  const ranked = [...byFocusRaw].filter(f=>f.avg!==null).sort((a,b)=>a.avg-b.avg);
  const weakestId = ranked.length && ranked[0].avg<80 ? ranked[0].id : null;
  const byFocus = byFocusRaw.map(f=>({
    ...f,
    status: f.avg===null ? null : (f.avg>=80 ? "strong" : (f.id===weakestId ? "focus" : null)),
  }));

  if(selectedFocus){
    const f=byFocus.find(x=>x.id===selectedFocus);
    return <FocusAreaDetail focus={f} lang={lang} onBack={()=>setSelectedFocus(null)}/>;
  }
  if(showScorecardHistory){
    return <ScorecardHistoryDetail rounds={rounds} lang={lang} onBack={()=>setShowScorecardHistory(false)}/>;
  }
  if(showHandicapHistory){
    return <HandicapHistoryDetail rounds={rounds} lang={lang} onBack={()=>setShowHandicapHistory(false)}/>;
  }
  if(showFinisherHistory){
    return <FinisherHistoryDetail gameId={showFinisherHistory} allSessions={sessions} lang={lang} onBack={()=>setShowFinisherHistory(null)}/>;
  }
  const girPct=girPctOf(allH);
  const firPct=firPctOf(allH);
  // Putts, three-putts, and Up & Downs are all computed PER ROUND, then
  // averaged — not as a flat per-hole rate across every hole ever played.
  // Each round's raw count is normalized to an 18-hole basis individually
  // (count * 18/holesInRound), so a 9-hole round contributes what it would
  // likely have been over a full 18, and a 9-hole round's putts don't get
  // diluted into the same bucket as an 18-hole round's. We then average
  // those per-round figures across all rounds.
  const perRoundStats = rounds.map(r=>{
    const holes = r.holes||[];
    const holeCount = holes.length || 18;
    const scaleTo18 = 18/holeCount;
    const puttsTotal = holes.reduce((a,h)=>a+(h.putts||0),0);
    const threePuttCount = holes.filter(h=>(h.putts||0)>=3).length;
    // Up & down = missed the green in regulation, but still saved par or
    // better (the "scrambling" stat, matching how HANDICAP_BENCHMARKS was
    // sourced) — see isUpDownSuccess for the single source of truth.
    const updownAttempts = holes.filter(isUpDownAttempt);
    const updownSuccess = updownAttempts.filter(isUpDownSuccess);
    return {
      ts: r.ts,
      putts18: puttsTotal*scaleTo18,
      threePutts18: threePuttCount*scaleTo18,
      updowns18: updownSuccess.length*scaleTo18,
    };
  });
  const avgP = perRoundStats.length
    ? Math.round((perRoundStats.reduce((a,r)=>a+r.putts18,0)/perRoundStats.length)*10)/10
    : null;
  const threePuttAvg = perRoundStats.length
    ? Math.round((perRoundStats.reduce((a,r)=>a+r.threePutts18,0)/perRoundStats.length)*10)/10
    : null;
  const updownAvg = perRoundStats.length
    ? Math.round((perRoundStats.reduce((a,r)=>a+r.updowns18,0)/perRoundStats.length)*10)/10
    : null;
  // Up-and-down conversion PERCENTAGE (successes / attempts), needed for the
  // benchmark comparison — distinct from updownAvg above, which is a count
  // per 18 holes, not a percentage.
  const allUpdownAttempts = allH.filter(isUpDownAttempt);
  const allUpdownSuccess = allUpdownAttempts.filter(isUpDownSuccess);
  const updownConversionPct = allUpdownAttempts.length
    ? Math.round((allUpdownSuccess.length/allUpdownAttempts.length)*1000)/10
    : null;
  const {puttingHcp, shortGameHcp, longGameHcp} = deriveHandicaps(rounds.length, avgP, threePuttAvg, updownConversionPct, girPct, firPct);
  const mc={left:0,right:0,short:0,long:0};
  allH.map(h=>h.miss).filter(Boolean).forEach(m=>{if(mc[m]!==undefined)mc[m]++;});
  const topM=Object.entries(mc).sort((a,b)=>b[1]-a[1])[0];
  // (Last-10-rounds trend computations for Score/3-Putts/Up&Down were
  // removed here — they fed three mini-charts that duplicated the detailed
  // chart now available via "View History", with its own dropdown, full
  // selected range, and number-row labeling. Their summary stat cards above
  // (using the all-time averages, not these trends) remain unaffected.)

  // ── Handicap vs Actual Performance ───────────────────────────────────────
  // Simplified expected differential = handicap index (no slope/rating available).
  // Shown as soon as there's a numeric handicap AND at least 1 full round
  // logged — previously required 3 rounds, which was inconsistent with the
  // Estimated Skill Handicaps just below (deriveHandicaps, now also shows
  // from round 1). Noisier off a single round, same tradeoff made there.
  //
  // IMPORTANT — plus handicaps: a "+2.0" handicap is BETTER than scratch and
  // means the player is expected to average 2 strokes UNDER par, not over.
  // The "+" prefix in golf handicaps inverts the usual sign convention versus
  // how parseFloat reads it (parseFloat("+2.0") is positive 2, but the golf
  // meaning is an expected differential of NEGATIVE 2). Without this flip, a
  // plus-handicap player's expected score was being computed backwards —
  // e.g. a +2.0 player shooting 75 on a par-72 course (actual diff = +3) was
  // showing as only 1 stroke worse than expected, when the true gap is 5
  // strokes worse (expected -2, actual +3).
  const hdcpRawStr = hdcp ? String(hdcp).trim() : null;
  const isPlusHcp = hdcpRawStr ? hdcpRawStr.startsWith("+") : false;
  const hdcpParsed = hdcpRawStr ? parseFloat(hdcpRawStr.replace(",",".")) : null;
  const hdcpNum = (hdcpParsed!==null && !isNaN(hdcpParsed)) ? (isPlusHcp ? -hdcpParsed : hdcpParsed) : null;
  const hasValidHdcp = hdcpNum!==null && !isNaN(hdcpNum);
  const fullRoundDiffs = rounds.filter(r=>(r.holes||[]).length>=9).map(r=>{
    const tot=(r.holes||[]).reduce((a,h)=>a+(h.score||0),0);
    const par=(r.holes||[]).reduce((a,h)=>a+(h.par||0),0);
    return tot-par;
  });
  const actualAvgDiff = fullRoundDiffs.length>=1
    ? Math.round((fullRoundDiffs.reduce((a,b)=>a+b,0)/fullRoundDiffs.length)*10)/10
    : null;
  const showHdcpCompare = hasValidHdcp && actualAvgDiff!==null;
  const hdcpGap = showHdcpCompare ? Math.round((actualAvgDiff - hdcpNum)*10)/10 : null;

  // ── Finisher Games (account holder only — exclude local multiplayer guests) ──
  const finisherSessions = sessions.filter(s=>s.type==="finisher"&&s.isAccount);
  const finisherByGame = Object.keys(FINISHERS).map(gid=>{
    const game=FINISHERS[gid];
    const ss=finisherSessions.filter(s=>s.gameId===gid).sort((a,b)=>a.ts-b.ts);
    const best=ss.length?Math.max(...ss.map(s=>s.score)):null;
    const last=ss.length?ss[ss.length-1].score:null;
    const pcts=ss.map(s=>Math.round((s.score/game.max)*100));
    return {...game, count:ss.length, best, last, pcts};
  });

  if(sessions.length===0) return (
    <div>
      <div style={{marginBottom:18}}>
        <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:24,fontWeight:700}}>{t(lang,"stats")}</div>
        <div style={{color:SLATE_L,fontSize:13,marginTop:3}}>{t(lang,"gameGlance")}</div>
      </div>
      <div style={{background:WHITE,borderRadius:20,padding:"36px 24px",textAlign:"center",border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
        <div style={{fontSize:52,marginBottom:14}}>⛳</div>
        <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700,marginBottom:6}}>{t(lang,"getStarted")}</div>
        <div style={{color:SLATE_L,fontSize:13,marginBottom:22,lineHeight:1.6}}>{t(lang,"getStartedSub")}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button onClick={onGoTrain} style={{padding:14,background:HEADER_BG,border:"none",borderRadius:14,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:14}}>
            🏌️ {t(lang,"startTrainingCta")}
          </button>
          <button onClick={onGoScore} style={{padding:14,background:WHITE,border:"1.5px solid "+BORDER,borderRadius:14,color:NAVY,fontWeight:700,cursor:"pointer",fontSize:14}}>
            📋 {t(lang,"logRoundCta")}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:24,fontWeight:700}}>{t(lang,"stats")}</div>
          <div style={{color:SLATE_L,fontSize:13,marginTop:3}}>{t(lang,"gameGlance")}</div>
        </div>
        {streak>0&&(
          <div style={{background:GOLD_BG,borderRadius:14,padding:"8px 14px",textAlign:"center",boxShadow:"0 2px 10px rgba(232,184,75,0.3)"}}>
            <div style={{color:NAVY,fontSize:20,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif",lineHeight:1}}>🔥{streak}</div>
            <div style={{color:NAVY,fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{streak===1?t(lang,"streakDay"):t(lang,"streakDays")}</div>
          </div>
        )}
      </div>

      {showHdcpCompare&&(
        <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:16,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
          <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>{t(lang,"hdcpVsActual")}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div style={{background:OFF,borderRadius:12,padding:"12px 14px",textAlign:"center",border:"1px solid "+BORDER}}>
              <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>{t(lang,"declaredHdcp")}</div>
              <div style={{color:NAVY,fontSize:24,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{fmtDerivedHcp(hdcpNum)}</div>
            </div>
            <div style={{background:OFF,borderRadius:12,padding:"12px 14px",textAlign:"center",border:"1px solid "+BORDER}}>
              <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>{t(lang,"actualAvg")}</div>
              <div style={{color:NAVY,fontSize:24,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{actualAvgDiff>=0?"+":""}{actualAvgDiff}</div>
            </div>
          </div>
          <div style={{background:Math.abs(hdcpGap)<=2?GREEN_BG:hdcpGap>2?"#fef0f0":"#fff8e6",borderRadius:12,padding:"12px 14px"}}>
            <div style={{color:Math.abs(hdcpGap)<=2?GREEN:hdcpGap>2?RED:AMBER,fontWeight:700,fontSize:14,marginBottom:3}}>
              {hdcpGap>2 ? t(lang,"playingAbove") : hdcpGap<-2 ? t(lang,"playingBelow") : t(lang,"playingOnTarget")}
            </div>
            <div style={{color:TEXT_S,fontSize:12,lineHeight:1.5}}>
              {hdcpGap>2 && t(lang,"playingAboveDesc").replace("{n}",Math.abs(hdcpGap))}
              {hdcpGap<-2 && t(lang,"playingBelowDesc").replace("{n}",Math.abs(hdcpGap))}
              {Math.abs(hdcpGap)<=2 && t(lang,"playingOnTargetDesc")}
            </div>
          </div>
          <div style={{color:SLATE_L,fontSize:10,marginTop:8,fontStyle:"italic"}}>{t(lang,"hdcpDisclaimer")}</div>
        </div>
      )}
      {(puttingHcp!=null||shortGameHcp!=null||longGameHcp!=null)&&(
        <div style={{marginBottom:20}}>
          <button onClick={()=>setShowHandicapHistory(true)} style={{background:"none",border:"none",padding:0,width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,cursor:"pointer"}}>
            <span style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,fontWeight:700}}>{t(lang,"derivedHandicaps")}</span>
            <span style={{color:PURPLE,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:3}}>{t(lang,"viewHistory")} ›</span>
          </button>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:6}}>
            {[[t(lang,"puttingHcp"),puttingHcp],[t(lang,"shortGameHcp"),shortGameHcp],[t(lang,"longGameHcp"),longGameHcp]].map(([l,v])=>(
              <div key={l} style={{background:PURPLE_BG,borderRadius:16,padding:"12px 8px",textAlign:"center",border:"1px solid "+PURPLE+"33"}}>
                <div style={{color:PURPLE,fontSize:9,textTransform:"uppercase",letterSpacing:0.5,fontWeight:700,marginBottom:2}}>{l}</div>
                <div style={{color:NAVY,fontSize:22,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{fmtDerivedHcp(v)}</div>
              </div>
            ))}
          </div>
          <div style={{color:SLATE_L,fontSize:10,fontStyle:"italic"}}>{t(lang,"derivedHandicapDisclaimer")}</div>
        </div>
      )}
      {rounds.length>0&&(
        <div style={{marginBottom:20}}>
          <button onClick={()=>setShowScorecardHistory(true)} style={{background:"none",border:"none",padding:0,width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,cursor:"pointer"}}>
            <span style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,fontWeight:700}}>{t(lang,"onCourse")}</span>
            <span style={{color:GREEN,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:3}}>{t(lang,"viewHistory")} ›</span>
          </button>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[[t(lang,"avgPutts"),avgP||"—",t(lang,"per18Holes"),null,null],["GIR %",girPct!=null?girPct+"%":"—",t(lang,"greens"),null,null],["FIR %",firPct!=null?firPct+"%":"—",t(lang,"fairways"),null,null],[t(lang,"topMiss"),topM&&topM[1]>0?t(lang,topM[0]+"_dir"):"—",t(lang,"common"),topM&&topM[1]>0?RED:null,null],[t(lang,"threePutts"),threePuttAvg!=null?threePuttAvg:"—",t(lang,"per18Holes"),threePuttAvg!=null&&threePuttAvg>2?RED:null,null],[t(lang,"upAndDown"),updownConversionPct!=null?updownConversionPct+"%":"—",null,null,updownAvg!=null?(updownAvg+" "+t(lang,"per18Holes")):null]].map(([l,v,s,a,sub],idx)=>{
              const isHighlight = idx===0;
              return (
              <div key={l} style={isHighlight
                ? {background:HEADER_BG,borderRadius:18,padding:"16px 14px",textAlign:"center",boxShadow:"0 6px 20px rgba(26,47,74,0.25)"}
                : {background:WHITE,borderRadius:18,padding:"16px 14px",textAlign:"center",boxShadow:"0 4px 16px rgba(26,47,74,0.06)"}}>
                <div style={{color:isHighlight?"rgba(255,255,255,0.55)":SLATE_L,fontSize:9,textTransform:"uppercase",letterSpacing:0.8,fontWeight:700,marginBottom:4}}>{l}</div>
                <div style={{color:isHighlight?GOLD:(a||NAVY),fontSize:22,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{v}</div>
                {s&&<div style={{color:isHighlight?"rgba(255,255,255,0.4)":"#c1c7d0",fontSize:9,marginTop:2}}>{s}</div>}
                {sub&&<div style={{color:isHighlight?"rgba(255,255,255,0.4)":"#c1c7d0",fontSize:9,marginTop:2}}>{sub}</div>}
              </div>
              );
            })}
          </div>
        </div>
      )}
      <div>
        <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"trainingProgress")}</div>
        {byFocus.map(f=>{
            const fc=focusColors(f.id);
            return (
            <button key={f.id} onClick={()=>setSelectedFocus(f.id)}
              style={{display:"block",width:"100%",textAlign:"left",background:WHITE,borderRadius:16,padding:16,marginBottom:10,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{color:NAVY,fontWeight:700,fontSize:14}}>{f.emoji} {f.label}</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {f.status==="strong"&&<span style={{color:WHITE,fontSize:10,background:GREEN,borderRadius:8,padding:"2px 8px",fontWeight:700}}>{t(lang,"strong")}</span>}
                  {f.status==="focus"&&<span style={{color:WHITE,fontSize:10,background:RED,borderRadius:8,padding:"2px 8px",fontWeight:700}}>{t(lang,"focus")}</span>}
                  {f.trend!==null&&<span style={{color:f.trend>=0?GREEN:RED,fontSize:12,fontWeight:700,background:f.trend>=0?GREEN_BG:"#fef0f0",borderRadius:8,padding:"2px 7px"}}>{f.trend>=0?"+":"-"}{Math.abs(f.trend)}%</span>}
                  <span style={{color:SLATE_L,fontSize:11}}>{f.count} {t(lang,"sessions")}</span>
                  <span style={{color:SLATE_L,fontSize:14}}>›</span>
                </div>
              </div>
              {f.count>0?(
                <>
                  <div style={{background:"#eef0f4",borderRadius:20,height:8,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:f.avg+"%",background:f.avg>=80?fc.solid:f.avg>=60?AMBER:RED,borderRadius:20}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{color:SLATE,fontSize:12,fontWeight:600}}>Avg {f.avg}%</span>
                    {f.pcts.length>1&&<div style={{width:80}}><Sparkline data={f.pcts} color={fc.solid} h={20} fixedScale/></div>}
                  </div>
                </>
              ):(
                <div style={{color:SLATE_L,fontSize:12}}>{t(lang,"noSessionsYetTap")}</div>
              )}
            </button>
          );})}
      </div>
      {finisherSessions.length>0&&(
        <div style={{marginTop:20}}>
          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"finisherGames")}</div>
          {finisherByGame.filter(g=>g.count>0).map(g=>(
            <div key={g.id} style={{background:"linear-gradient(135deg,#fff8e6,#fef0d8)",borderRadius:16,padding:16,marginBottom:10,border:"1.5px solid "+GOLD+"55",boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{color:NAVY,fontWeight:700,fontSize:14}}>{g.emoji} {txFin(lang,g.id,"name",g.name)}</span>
                <button onClick={()=>setShowFinisherHistory(g.id)} style={{background:"none",border:"none",padding:0,color:"#b8860a",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>{t(lang,"viewHistory")} ›</button>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{color:SLATE_L,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{t(lang,"best")}</div>
                  <div style={{color:GREEN,fontSize:22,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{g.best}<span style={{fontSize:13,color:SLATE_L}}>/{g.max}</span></div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:SLATE_L,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{t(lang,"last")}</div>
                  <div style={{color:NAVY,fontSize:22,fontWeight:800,letterSpacing:-0.5,fontFamily:"-apple-system,'Inter',sans-serif"}}>{g.last}<span style={{fontSize:13,color:SLATE_L}}>/{g.max}</span></div>
                </div>
                {g.pcts.length>1&&<div style={{width:90}}><Sparkline data={g.pcts} color="#b8860a" h={26} fixedScale/></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryTab({sessions, onClear, onDeleteOne, lang}){
  const [modal,setModal]=useState(null);
  const [finisherModal,setFinisherModal]=useState(null);
  const [programModal,setProgramModal]=useState(null);
  const [confirmDel,setConfirmDel]=useState(null);
  const [confirmClearAll,setConfirmClearAll]=useState(false);
  const sortedRaw=[...sessions].sort((a,b)=>b.ts-a.ts);

  // Collapse finisher records that share a sessionId into one group entry,
  // so a 3-player Finisher game shows as a single History row instead of
  // three. Records without a sessionId (older data) fall back to their own
  // individual group of one, so nothing from before this change breaks.
  const seenGroups = new Set();
  const sorted = [];
  sortedRaw.forEach(s=>{
    if(s.type!=="finisher"){ sorted.push(s); return; }
    const groupKey = s.sessionId || ("solo_"+s.ts);
    if(seenGroups.has(groupKey)) return; // already represented by an earlier record in this group
    seenGroups.add(groupKey);
    const group = s.sessionId
      ? sortedRaw.filter(x=>x.type==="finisher"&&x.sessionId===s.sessionId)
      : [s];
    sorted.push({...s, _finisherGroup:group});
  });

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:24,fontWeight:700}}>{t(lang,"history")}</div>
          <div style={{color:SLATE_L,fontSize:13,marginTop:3}}>{sessions.length} {sessions.length===1?t(lang,"sessionsCount"):t(lang,"sessionsCount2")}</div>
        </div>
        {sessions.length>0&&(
          <button onClick={()=>setConfirmClearAll(true)}
            style={{background:WHITE,border:"1px solid "+RED+"44",color:RED,borderRadius:10,padding:"6px 12px",fontSize:11,cursor:"pointer",marginTop:4,fontWeight:600}}>
            {t(lang,"clearAll")}
          </button>
        )}
      </div>
      {confirmClearAll&&(
        <div style={{background:"#fef0f0",border:"1px solid "+RED+"44",borderRadius:14,padding:"12px 14px",marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
          <span style={{color:NAVY,fontSize:12,fontWeight:600,flex:1}}>{t(lang,"confirmClear")}</span>
          <button onClick={()=>setConfirmClearAll(false)} style={{padding:"6px 12px",background:WHITE,border:"1px solid "+BORDER,borderRadius:8,fontSize:11,cursor:"pointer",color:TEXT_S,fontWeight:600}}>{t(lang,"cancel")}</button>
          <button onClick={()=>{onClear();setConfirmClearAll(false);}} style={{padding:"6px 12px",background:RED,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",color:WHITE,fontWeight:700}}>{t(lang,"delete")}</button>
        </div>
      )}
      {sorted.length===0&&(
        <div style={{textAlign:"center",padding:"52px 20px"}}>
          <div style={{fontSize:48,opacity:0.2,marginBottom:12}}>⛳</div>
          <div style={{color:SLATE_L,fontSize:13}}>{t(lang,"noHistory")}</div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {sorted.map((s,i)=>{
          if(s.type==="train"){
            const pct=Math.round((s.score/s.exMax)*100);
            const f=FOCUS_AREAS.find(x=>x.id===s.focusId);
            const [bgD,txD]=badge(s.exDiff||"Beginner");
            return (
              <div key={s.ts} style={{background:WHITE,borderRadius:16,padding:"14px 16px",border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)",position:"relative"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                      <span style={{color:NAVY,fontWeight:700,fontSize:13}}>{s.exEmoji} {tx(lang,s.exId,"name",s.exName)}</span>
                      <span style={{background:bgD,color:txD,fontSize:10,borderRadius:10,padding:"1px 7px",fontWeight:600}}>{t(lang,"diff_"+s.exDiff)}</span>
                    </div>
                    <div style={{color:SLATE_L,fontSize:11}}>{f?.emoji} {f?.label} · {fmt(s.ts)}</div>
                  </div>
                  <div style={{textAlign:"right",display:"flex",alignItems:"center",gap:10}}>
                    <div>
                      <div style={{color:pct>=80?GREEN:pct>=60?AMBER:RED,fontWeight:700,fontSize:20,fontFamily:"Georgia,serif"}}>{pct}%</div>
                      <div style={{color:SLATE_L,fontSize:10}}>{s.score}/{s.exMax}</div>
                    </div>
                    <button onClick={()=>setConfirmDel(s.ts)} style={{background:"none",border:"none",color:SLATE_L,cursor:"pointer",fontSize:16,padding:4}}>🗑</button>
                  </div>
                </div>
                {confirmDel===s.ts&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid "+BORDER,display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{color:TEXT_S,fontSize:12,flex:1}}>{t(lang,"deleteThis")}</span>
                    <button onClick={()=>setConfirmDel(null)} style={{padding:"5px 10px",background:OFF,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",color:TEXT_S}}>{t(lang,"cancel")}</button>
                    <button onClick={()=>{onDeleteOne(s.ts);setConfirmDel(null);}} style={{padding:"5px 10px",background:RED,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",color:WHITE,fontWeight:600}}>{t(lang,"delete")}</button>
                  </div>
                )}
              </div>
            );
          }
          if(s.type==="round"){
            const tot=(s.holes||[]).reduce((a,h)=>a+(h.score||0),0);
            const par=(s.holes||[]).reduce((a,h)=>a+(h.par||0),0);
            const d=tot-par;
            return (
              <div key={s.ts} style={{background:"linear-gradient(135deg,#e8f5ec,#f0f7f2)",borderRadius:16,padding:"14px 16px",border:"1.5px solid "+GREEN+"44",boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{cursor:"pointer",flex:1}} onClick={()=>setModal(s)}>
                    <div style={{color:NAVY,fontWeight:700,fontSize:13,marginBottom:2}}>{s.n}-{t(lang,"holes")}{s.roundType==="competition"?" 🏆":""}</div>
                    {s.course&&<div style={{color:GREEN,fontSize:12,marginBottom:1,fontWeight:500}}>📍 {s.course}</div>}
                    <div style={{color:SLATE_L,fontSize:11}}>{fmt(s.ts)}{s.feeling?" · "+t(lang,"feel_"+s.feeling):""}</div>
                  </div>
                  <div style={{textAlign:"right",display:"flex",alignItems:"center",gap:10}}>
                    <div style={{cursor:"pointer"}} onClick={()=>setModal(s)}>
                      <div style={{color:d<=0?GREEN:d<=5?AMBER:RED,fontWeight:700,fontSize:20,fontFamily:"Georgia,serif"}}>{d>=0?"+":""}{d}</div>
                      <div style={{color:SLATE_L,fontSize:10}}>{t(lang,"score")} {tot}</div>
                    </div>
                    <button onClick={()=>setConfirmDel(s.ts)} style={{background:"none",border:"none",color:SLATE_L,cursor:"pointer",fontSize:16,padding:4}}>🗑</button>
                  </div>
                </div>
                {confirmDel===s.ts&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid "+BORDER,display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{color:TEXT_S,fontSize:12,flex:1}}>{t(lang,"deleteThis")}</span>
                    <button onClick={()=>setConfirmDel(null)} style={{padding:"5px 10px",background:OFF,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",color:TEXT_S}}>{t(lang,"cancel")}</button>
                    <button onClick={()=>{onDeleteOne(s.ts);setConfirmDel(null);}} style={{padding:"5px 10px",background:RED,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",color:WHITE,fontWeight:600}}>{t(lang,"delete")}</button>
                  </div>
                )}
              </div>
            );
          }
          if(s.type==="finisher"){
            const group = s._finisherGroup || [s];
            const isGroup = group.length>1;
            const accountEntry = group.find(g=>g.isAccount) || group[0];
            const pct=Math.round((accountEntry.score/accountEntry.max)*100);
            const grade=gradeFinisher(pct);
            const groupKey = s.sessionId || s.ts;
            return (
              <div key={groupKey} style={{background:"linear-gradient(135deg,#fff8e6,#fef0d8)",borderRadius:16,padding:"14px 16px",border:"1.5px solid "+GOLD+"55",boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1,cursor:"pointer"}} onClick={()=>setFinisherModal(group)}>
                    <div style={{color:NAVY,fontWeight:700,fontSize:13,marginBottom:2}}>🏆 {txFin(lang,s.gameId,"name",s.gameName)}{isGroup?" · "+group.length+" "+t(lang,"players"):""}</div>
                    <div style={{color:SLATE_L,fontSize:11}}>{fmt(s.ts)} · <span style={{color:grade.color,fontWeight:700}}>{grade.label}</span></div>
                  </div>
                  <div style={{textAlign:"right",display:"flex",alignItems:"center",gap:10}}>
                    <div style={{cursor:"pointer"}} onClick={()=>setFinisherModal(group)}>
                      <div style={{color:NAVY,fontWeight:700,fontSize:20,fontFamily:"Georgia,serif"}}>{accountEntry.score}</div>
                      <div style={{color:SLATE_L,fontSize:10}}>/{accountEntry.max} · {pct}%</div>
                    </div>
                    <button onClick={()=>setConfirmDel(groupKey)} style={{background:"none",border:"none",color:SLATE_L,cursor:"pointer",fontSize:16,padding:4}}>🗑</button>
                  </div>
                </div>
                {confirmDel===groupKey&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid "+GOLD+"33",display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{color:TEXT_S,fontSize:12,flex:1}}>{isGroup?t(lang,"deleteThisGroup"):t(lang,"deleteThis")}</span>
                    <button onClick={()=>setConfirmDel(null)} style={{padding:"5px 10px",background:OFF,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",color:TEXT_S}}>{t(lang,"cancel")}</button>
                    <button onClick={()=>{group.forEach(g=>onDeleteOne(g.ts));setConfirmDel(null);}} style={{padding:"5px 10px",background:RED,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",color:WHITE,fontWeight:600}}>{t(lang,"delete")}</button>
                  </div>
                )}
              </div>
            );
          }
          if(s.type==="program"){
            const pct=Math.round((s.score/s.max)*100);
            const grade=gradeFinisher(pct);
            return (
              <div key={s.ts} style={{background:"linear-gradient(135deg,#f0ebfa,#f7f2fc)",borderRadius:16,padding:"14px 16px",border:"1.5px solid "+PURPLE+"44",boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1,cursor:"pointer"}} onClick={()=>setProgramModal(s)}>
                    <div style={{color:NAVY,fontWeight:700,fontSize:13,marginBottom:2}}>🎯 {t(lang,"prog_"+s.programId+"_name")}</div>
                    <div style={{color:SLATE_L,fontSize:11}}>{fmt(s.ts)} · <span style={{color:grade.color,fontWeight:700}}>{grade.label}</span></div>
                  </div>
                  <div style={{textAlign:"right",display:"flex",alignItems:"center",gap:10}}>
                    <div style={{cursor:"pointer"}} onClick={()=>setProgramModal(s)}>
                      <div style={{color:NAVY,fontWeight:700,fontSize:20,fontFamily:"Georgia,serif"}}>{s.score}</div>
                      <div style={{color:SLATE_L,fontSize:10}}>/{s.max} · {pct}%</div>
                    </div>
                    <button onClick={()=>setConfirmDel(s.ts)} style={{background:"none",border:"none",color:SLATE_L,cursor:"pointer",fontSize:16,padding:4}}>🗑</button>
                  </div>
                </div>
                {confirmDel===s.ts&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid "+PURPLE+"33",display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{color:TEXT_S,fontSize:12,flex:1}}>{t(lang,"deleteThis")}</span>
                    <button onClick={()=>setConfirmDel(null)} style={{padding:"5px 10px",background:OFF,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",color:TEXT_S}}>{t(lang,"cancel")}</button>
                    <button onClick={()=>{onDeleteOne(s.ts);setConfirmDel(null);}} style={{padding:"5px 10px",background:RED,border:"none",borderRadius:8,fontSize:11,cursor:"pointer",color:WHITE,fontWeight:600}}>{t(lang,"delete")}</button>
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
      <ScorecardModal session={modal} lang={lang} onClose={()=>setModal(null)}/>
      <FinisherSummaryModal session={finisherModal} lang={lang} onClose={()=>setFinisherModal(null)}/>
      <ProgramSummaryModal session={programModal} lang={lang} onClose={()=>setProgramModal(null)}/>
    </div>
  );
}

function PlayerTab({user, onSave, settings, onSaveSettings, onLogout, onResetDemo, onResetForNewUser}){
  const [sec,setSec]=useState("profile");
  const [f,setF]=useState({...user});
  const [saved,setSaved]=useState(false);
  const [hcpError,setHcpError]=useState("");
  const [confirmReset,setConfirmReset]=useState(false);
  const [confirmFullReset,setConfirmFullReset]=useState(false);
  const [clubDistances,setClubDistances]=useState(()=>getClubDistances(user.id));
  const ref=useRef();
  const lang=settings?.language||"en";
  const units=settings?.units||"imperial";
  useEffect(()=>setF(u=>({...u,...user})),[user]);
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const ss=s=>onSaveSettings(s);
  function updateClubDistance(clubId, displayValue){
    // Stored canonically in metres regardless of display unit, matching the
    // rest of the app's distance convention (cvt() converts for display only).
    const num = displayValue===""?null:parseFloat(displayValue);
    const metres = (num===null||isNaN(num)) ? null : (units==="imperial" ? Math.round(num/1.094) : Math.round(num));
    const updated = {...clubDistances};
    if(metres===null) delete updated[clubId]; else updated[clubId]=metres;
    setClubDistances(updated);
    saveClubDistances(user.id, updated);
  }
  function displayDistance(clubId){
    const m = clubDistances[clubId];
    if(m===undefined) return "";
    return units==="imperial" ? Math.round(m*1.094) : m;
  }
  const inp={width:"100%",background:OFF,border:"1.5px solid "+BORDER,borderRadius:12,color:TEXT,padding:"11px 14px",boxSizing:"border-box",fontSize:14,outline:"none",fontFamily:"inherit"};
  const sel={width:"100%",background:OFF,border:"1.5px solid "+BORDER,borderRadius:12,color:TEXT,padding:"11px 14px",boxSizing:"border-box",fontSize:14,outline:"none"};
  const lbl={color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:5};
  return (
    <div>
      <div style={{marginBottom:18}}>
        <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:24,fontWeight:700}}>{t(lang,"player")}</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["profile",t(lang,"profile")],["settings",t(lang,"settings")]].map(([id,l])=>(
          <button key={id} onClick={()=>setSec(id)}
            style={{flex:1,padding:"11px 8px",background:sec===id?NAVY:WHITE,border:"2px solid "+(sec===id?NAVY:BORDER),borderRadius:14,color:sec===id?WHITE:TEXT_S,fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:sec===id?"0 3px 12px rgba(26,47,74,0.2)":"none"}}>
            {l}
          </button>
        ))}
      </div>

      {sec==="profile"&&(
        <div>
          <div style={{textAlign:"center",marginBottom:22}}>
            <div style={{position:"relative",display:"inline-block"}}>
              <div style={{width:88,height:88,borderRadius:"50%",background:GREEN_BG,border:"3px solid "+GREEN,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",margin:"0 auto",boxShadow:"0 4px 16px rgba(58,125,74,0.2)"}}>
                {f.photo?<img src={f.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:36}}>👤</span>}
              </div>
              <button onClick={()=>ref.current.click()} style={{position:"absolute",bottom:2,right:2,width:28,height:28,background:GREEN_GRAD,border:"2.5px solid "+WHITE,borderRadius:"50%",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>📷</button>
              <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>u("photo",ev.target.result);r.readAsDataURL(file);}}/>
            </div>
            {f.name&&<div style={{color:NAVY,fontWeight:700,fontSize:16,marginTop:10}}>{f.name}</div>}
            {f.hdcp&&<div style={{color:SLATE_L,fontSize:12,marginTop:2}}>{t(lang,"handicapIndex")}: {f.hdcp}</div>}
          </div>

          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"personalInfo")}</div>
          <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",gap:12}}>
            <div><label style={lbl}>{t(lang,"fullName")}</label><input type="text" value={f.name||""} onChange={e=>u("name",e.target.value)} placeholder={t(lang,"yourName")} style={inp}/></div>
            <div><label style={lbl}>{t(lang,"homeClub")}</label><input type="text" value={f.homeClub||""} onChange={e=>u("homeClub",e.target.value)} placeholder={t(lang,"homeClubPh")} style={inp}/></div>
            <div><label style={lbl}>{t(lang,"location")}</label><input type="text" value={f.location||""} onChange={e=>u("location",e.target.value)} placeholder={t(lang,"locationPh")} style={inp}/></div>
          </div>

          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"golfProfile")}</div>
          <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={lbl}>{t(lang,"handicapIndex")}</label>
              <HcpInput value={f.hdcp} onChange={v=>{u("hdcp",v);if(hcpError)setHcpError("");}}/>
              {hcpError ? (
                <div style={{color:RED,fontSize:11,marginTop:5,fontWeight:600}}>⚠ {hcpError}</div>
              ) : (
                <div style={{color:SLATE_L,fontSize:11,marginTop:5}}>{t(lang,"handicapHelp")}</div>
              )}
            </div>
            <div>
              <label style={lbl}>{t(lang,"typicalScore")}</label>
              <select value={f.typicalScore||""} onChange={e=>u("typicalScore",e.target.value)} style={sel}>
                <option value="">{t(lang,"select")}</option>
                {SCORES.map(k=><option key={k} value={k}>{t(lang,"score_"+k)}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>{t(lang,"playFreq")}</label>
              <select value={f.freq||""} onChange={e=>u("freq",e.target.value)} style={sel}>
                <option value="">{t(lang,"select")}</option>
                {FREQ_KEYS.map(k=><option key={k} value={k}>{t(lang,"freq_"+k)}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>{t(lang,"dominantHand")}</label>
              <select value={f.hand||"Right"} onChange={e=>u("hand",e.target.value)} style={sel}>
                <option value="Right">{t(lang,"right")}</option>
                <option value="Left">{t(lang,"left")}</option>
              </select>
            </div>
          </div>

          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"clubDistances")}</div>
          <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:20,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
            <div style={{color:SLATE_L,fontSize:12,marginBottom:14,lineHeight:1.5}}>{t(lang,"clubDistancesHint")}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {CLUBS.map(c=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:TEXT,fontSize:13,flex:1}}>{t(lang,"club_"+c.id)}</span>
                  <input type="number" inputMode="numeric" value={displayDistance(c.id)}
                    onChange={e=>updateClubDistance(c.id,e.target.value)}
                    placeholder="—"
                    style={{width:64,background:OFF,border:"1.5px solid "+BORDER,borderRadius:10,color:TEXT,padding:"7px 8px",boxSizing:"border-box",fontSize:13,outline:"none",textAlign:"center"}}/>
                  <span style={{color:SLATE_L,fontSize:11,minWidth:22}}>{units==="imperial"?t(lang,"ydsAbbr"):t(lang,"mAbbr")}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={()=>{
            const err = validateHcp(f.hdcp, lang);
            if(err){ setHcpError(err); return; }
            setHcpError("");
            onSave({...f});setSaved(true);setTimeout(()=>setSaved(false),2000);
          }}
            style={{width:"100%",padding:15,background:saved?GREEN_GRAD:HEADER_BG,border:"none",borderRadius:16,color:WHITE,fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:saved?"0 4px 16px rgba(58,125,74,0.3)":"0 4px 16px rgba(26,47,74,0.2)",marginBottom:12}}>
            {saved?"✓ "+t(lang,"profileSaved"):t(lang,"saveProfile")}
          </button>
          <button onClick={onLogout} style={{width:"100%",padding:13,background:WHITE,border:"1.5px solid "+BORDER,borderRadius:16,color:SLATE,fontWeight:600,fontSize:14,cursor:"pointer"}}>
            {t(lang,"signOut")}
          </button>
        </div>
      )}

      {sec==="settings"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:WHITE,borderRadius:16,padding:16,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
            <div style={{color:NAVY,fontWeight:700,marginBottom:12,fontSize:14}}>{t(lang,"language")}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {LANG_CODES.map(code=>(
                <button key={code} onClick={()=>ss({...settings,language:code})}
                  style={{padding:"9px",background:settings.language===code?NAVY:WHITE,border:"1.5px solid "+(settings.language===code?NAVY:BORDER),borderRadius:10,color:settings.language===code?WHITE:TEXT_S,fontSize:12,cursor:"pointer",fontWeight:settings.language===code?700:400}}>
                  {settings.language===code?"✓ ":""}{LANG_NAMES[code]}
                </button>
              ))}
            </div>
          </div>
          <div style={{background:WHITE,borderRadius:16,padding:16,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
            <div style={{color:NAVY,fontWeight:700,marginBottom:12,fontSize:14}}>{t(lang,"measurement")}</div>
            <div style={{display:"flex",gap:8}}>
              {[[t(lang,"yardsFeet"),"imperial"],[t(lang,"metres"),"metric"]].map(([l,v])=>(
                <button key={v} onClick={()=>ss({...settings,units:v})}
                  style={{flex:1,padding:"14px 8px",background:settings.units===v?NAVY:WHITE,border:"2px solid "+(settings.units===v?NAVY:BORDER),borderRadius:14,color:settings.units===v?WHITE:TEXT_S,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                  {settings.units===v?"✓ ":""}{l}
                </button>
              ))}
            </div>
          </div>
          <div style={{background:WHITE,borderRadius:16,padding:16,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
            <div style={{color:NAVY,fontWeight:700,marginBottom:12,fontSize:14}}>{t(lang,"defaultHoles")}</div>
            <div style={{display:"flex",gap:8}}>
              {[[9,"9"],[18,"18"]].map(([n,l])=>(
                <button key={n} onClick={()=>ss({...settings,holes:n})}
                  style={{flex:1,padding:"14px 8px",background:settings.holes===n?NAVY:WHITE,border:"2px solid "+(settings.holes===n?NAVY:BORDER),borderRadius:14,color:settings.holes===n?WHITE:TEXT_S,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                  {settings.holes===n?"✓ ":""}{l} {t(lang,"holes")}
                </button>
              ))}
            </div>
          </div>
          {onResetDemo&&(
            <div style={{background:WHITE,borderRadius:16,padding:16,border:"1px solid "+RED+"33",boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
              <div style={{color:RED,fontWeight:700,marginBottom:6,fontSize:14}}>{t(lang,"resetDemoTitle")}</div>
              <div style={{color:SLATE_L,fontSize:12,marginBottom:12,lineHeight:1.5}}>{t(lang,"resetDemoDesc")}</div>
              {!confirmReset?(
                <button onClick={()=>setConfirmReset(true)} style={{width:"100%",padding:12,background:WHITE,border:"1.5px solid "+RED,borderRadius:12,color:RED,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                  {t(lang,"resetDemoBtn")}
                </button>
              ):(
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setConfirmReset(false)} style={{flex:1,padding:12,background:OFF,border:"none",borderRadius:12,color:TEXT_S,fontWeight:600,fontSize:13,cursor:"pointer"}}>
                    {t(lang,"cancel")}
                  </button>
                  <button onClick={onResetDemo} style={{flex:1,padding:12,background:RED,border:"none",borderRadius:12,color:WHITE,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                    {t(lang,"resetDemoConfirm")}
                  </button>
                </div>
              )}
            </div>
          )}
          {onResetForNewUser&&(
            <div style={{background:WHITE,borderRadius:16,padding:16,border:"1px solid "+NAVY+"33",boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
              <div style={{color:NAVY,fontWeight:700,marginBottom:6,fontSize:14}}>{t(lang,"fullResetTitle")}</div>
              <div style={{color:SLATE_L,fontSize:12,marginBottom:12,lineHeight:1.5}}>{t(lang,"fullResetDesc")}</div>
              {!confirmFullReset?(
                <button onClick={()=>setConfirmFullReset(true)} style={{width:"100%",padding:12,background:WHITE,border:"1.5px solid "+NAVY,borderRadius:12,color:NAVY,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                  {t(lang,"fullResetBtn")}
                </button>
              ):(
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setConfirmFullReset(false)} style={{flex:1,padding:12,background:OFF,border:"none",borderRadius:12,color:TEXT_S,fontWeight:600,fontSize:13,cursor:"pointer"}}>
                    {t(lang,"cancel")}
                  </button>
                  <button onClick={onResetForNewUser} style={{flex:1,padding:12,background:NAVY,border:"none",borderRadius:12,color:WHITE,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                    {t(lang,"fullResetConfirm")}
                  </button>
                </div>
              )}
            </div>
          )}
          <div style={{color:SLATE_L,fontSize:11,textAlign:"center"}}>{t(lang,"settingsAuto")}</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM ICON SET — replaces system emoji with deliberate, on-brand line icons.
// Single-color SVGs that inherit currentColor so they tint with active/inactive
// tab states automatically, rather than looking like generic iPhone emoji.
// ═══════════════════════════════════════════════════════════════════════════
function Icon({name, size=20, color="currentColor"}){
  const p = {width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:color, strokeWidth:1.8, strokeLinecap:"round", strokeLinejoin:"round"};
  switch(name){
    case "train": // a golf club mid-swing — distinct from the Goals target/bullseye
      return (<svg {...p}><path d="M7 20.5L16 6.5"/><path d="M16 6.5l2.2-1.3a1.2 1.2 0 0 1 1.7 1.6L18.8 9"/><circle cx="6" cy="21" r="1.3" fill={color} stroke="none"/></svg>);
    case "score": // a simple scorecard / clipboard
      return (<svg {...p}><rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 3.5V2.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="13" y2="13"/><line x1="8" y1="17" x2="11" y2="17"/></svg>);
    case "stats": // ascending bars — progress, not a generic chart emoji
      return (<svg {...p}><line x1="3" y1="20" x2="21" y2="20"/><rect x="6" y="13" width="3" height="7" rx="0.6"/><rect x="11" y="9" width="3" height="11" rx="0.6"/><rect x="16" y="5" width="3" height="15" rx="0.6"/></svg>);
    case "history": // a clock with a subtle backward arc, distinct from a plain emoji clock
      return (<svg {...p}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.5 2"/><path d="M4.5 7.5a8.5 8.5 0 0 1 2-2.6" strokeOpacity="0.5"/></svg>);
    case "player": // a minimalist person mark, not a literal head silhouette
      return (<svg {...p}><circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/></svg>);
    case "goals": // a target with an arrow, distinct from the "train" bullseye (no inner dot, has an arrow reaching it)
      return (<svg {...p}><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M19 5l-5.5 5.5" strokeWidth="2"/><path d="M19 5h-3.2M19 5v3.2" strokeWidth="2"/></svg>);
    case "flagPin": // logo mark: pin in a circle, golf-specific but not the ⛳ emoji
      return (<svg {...p} strokeWidth={2}><line x1="7" y1="20" x2="7" y2="4"/><path d="M7 4.5 L16 7.5 L7 10.5 Z" fill={color} stroke="none"/></svg>);
    default: return null;
  }
}

const TABS=[
  {id:"goals",icon:"goals",labelKey:"goals"},
  {id:"train",icon:"train",labelKey:"train"},
  {id:"score",icon:"score",labelKey:"scorecard"},
  {id:"stats",icon:"stats",labelKey:"stats"},
  {id:"history",icon:"history",labelKey:"history"},
];

// ═══════════════════════════════════════════════════════════════════════════
// DEMO DATA SEEDING — populates a realistic example history for first-time
// use, so the app isn't empty on first open. Only runs once, only if NO
// account exists yet on this device (checks caddy_users is empty) — never
// overwrites real data. Edouard L is the account holder (Player 1); Alban L
// and Simon M appear only as local multiplayer opponents in Finisher games,
// not as separate logins, matching how local multiplayer actually works.
// ═══════════════════════════════════════════════════════════════════════════
function seedDemoData(){
  try{
    const existingUsers = stor("caddy_users", []);
    if(existingUsers.length > 0) return; // never overwrite real data

    const now = Date.now();
    const DAY = 86400000;

    const user = {
      id:"u_demo_edouard", name:"Edouard L",
      hdcp:"1.0", freq:"f23", photo:"", goal:"", homeClub:"", location:"", typicalScore:"70_74", hand:"Right"
    };
    save("caddy_users", [user]);
    save("caddy_settings_"+user.id, {...DEF_SETTINGS, units:"metric", language:"en"});
    save("caddy_cur", user);
    save("caddy_last_uid", user.id);

    function pseudoRand(seed){ const x = Math.sin(seed*999)*10000; return x - Math.floor(x); }

    // ── A FULL YEAR of activity (365 days back from today), simulating a
    // player who trains or plays roughly 2-3 times per week: about 70
    // training sessions, 35 rounds, and 25 Finisher sessions across the year
    // (130 total outings ≈ 2.5/week average). The player's handicap improves
    // from 2.5 at the start of the year to 1.0 now, reflected directly in
    // both the stated hdcp above and the score trend baked into the rounds
    // below — Stats/Handicap History should show genuine, gradual progress
    // across the full window, not just a 90-day snapshot.
    const YEAR = 365;
    // ── ~70 training exercise sessions, spread across the last 365 days,
    // drawing from all 50 exercises. Scores trend upward gently across the
    // whole year — a player improving from 2.5 to 1.0 handicap is already
    // skilled, so the curve starts around 65% and climbs to ~93%.
    const ALL_EX = [
      ["p1","putting",20],["p2","putting",20],["p3","putting",15],["p4","putting",10],["p5","putting",10],
      ["p6","putting",12],["p7","putting",12],["p8","putting",15],["p9","putting",20],["p10","putting",10],
      ["p11","putting",10],["p12","putting",100],["p13","putting",36],["p14","putting",20],["p15","putting",30],
      ["s1","shortGame",10],["s2","shortGame",15],["s3","shortGame",10],["s4","shortGame",9],["s5","shortGame",10],
      ["s6","shortGame",15],["s7","shortGame",10],["s8","shortGame",10],["s9","shortGame",10],["s10","shortGame",10],
      ["s11","shortGame",25],["s12","shortGame",18],["s13","shortGame",10],
      ["l1","longGame",20],["l2","longGame",15],["l3","longGame",15],["l4","longGame",15],["l5","longGame",10],
      ["l6","longGame",15],["l7","longGame",9],["l8","longGame",15],["l9","longGame",15],["l10","longGame",9],
      ["l11","longGame",18],["l12","longGame",10],["l13","longGame",20],
      ["m1","mental",15],["m2","mental",10],["m3","mental",15],["m4","mental",10],["m5","mental",10],
      ["m6","mental",8],["m7","mental",10],["m8","mental",9],["m9","mental",15],
    ];
    const TRAIN_COUNT = 70;
    const trainSessions = [];
    for(let i=0;i<TRAIN_COUNT;i++){
      const [exId, focusId, exMax] = ALL_EX[i % ALL_EX.length];
      // Look up the REAL exercise object so name/emoji/purpose/difficulty are
      // correct — never hardcode placeholders here, since History and Stats
      // display whatever was saved at training time for English users (the
      // tx() translation lookup only kicks in for non-English languages).
      const exDef = EXERCISES[focusId].find(e=>e.id===exId);
      const progress = i/(TRAIN_COUNT-1);
      const basePct = 0.65 + progress*0.28; // 65% -> 93%, across the full year
      const noise = (pseudoRand(i*13+7)-0.5)*0.12;
      const pct = Math.max(0.5, Math.min(0.98, basePct+noise));
      const score = Math.max(1, Math.round(exMax*pct));
      const daysAgo = YEAR - Math.round(progress*(YEAR-2));
      const ts = now - daysAgo*DAY - (i*23*60000);
      trainSessions.push({
        type:"train", focusId, exId,
        exName: exDef?.name || exId,
        exEmoji: exDef?.emoji || "⛳",
        exDiff: exDef?.difficulty || "Intermediate",
        exPurpose: exDef?.purpose || "",
        exMax, exLabel: exDef?.label || "Score",
        score, ts
      });
    }

    // ── 40 development (Program) sessions across all 7 programs, also
    // trending upward, spread across the same 90-day window. Each saved as
    // ONE combined program result (matching how completing a program saves
    // a single history entry), with a believable per-step breakdown.
    const PROGRAM_DEFS = [
      ["draw", [["l1","longGame",20],["l7","longGame",9],["l9","longGame",15]]],
      ["fade", [["l1","longGame",20],["l7","longGame",9],["l9","longGame",15]]],
      ["slice", [["l1","longGame",20],["l4","longGame",15],["l7","longGame",9],["l9","longGame",15]]],
      ["punchLow", [["l4","longGame",15],["l13","longGame",20]]],
      ["flopLob", [["s10","shortGame",10],["s9","shortGame",10],["s13","shortGame",10]]],
      ["bunker", [["s7","shortGame",10],["m3","mental",15],["m9","mental",15]]],
      ["yips", [["p2","putting",20],["m3","mental",15],["m9","mental",15],["p9","putting",20]]],
    ];
    const PROGRAM_COUNT = 25;
    const programSessions = [];
    for(let i=0;i<PROGRAM_COUNT;i++){
      const [programId, steps] = PROGRAM_DEFS[i % PROGRAM_DEFS.length];
      const progress = i/(PROGRAM_COUNT-1);
      const basePct = 0.64 + progress*0.28; // 64% -> 92%, across the full year
      const stepScores = steps.map(([exId,focusId,max],si)=>{
        const noise = (pseudoRand(i*31+si*11)-0.5)*0.14;
        const pct = Math.max(0.45, Math.min(0.98, basePct+noise));
        return {exId, focusId, score:Math.max(1,Math.round(max*pct)), max};
      });
      const totalScore = stepScores.reduce((a,s)=>a+s.score,0);
      const totalMax = stepScores.reduce((a,s)=>a+s.max,0);
      const daysAgo = (YEAR-3) - Math.round(progress*(YEAR-6));
      const ts = now - daysAgo*DAY - (i*41*60000);
      // Note: programName is stored for reference only — every display site
      // (History, ProgramSummaryModal) actually derives the shown name fresh
      // via t(lang,"prog_"+programId+"_name"), which correctly resolves for
      // every language including English. So unlike exName above, this being
      // the raw id rather than a translated string is harmless.
      programSessions.push({type:"program", programId, programName:programId, score:totalScore, max:totalMax, stepScores, ts});
    }

    // ── ~25 Finisher sessions across the 3 games, mixing solo and multiplayer
    // ~25 Finisher sessions across the 3 games, mixing solo and multiplayer
    // (with Alban L and Simon M joining roughly a third of the time each),
    // spread across the full year, Edouard's scores trending up from a solid
    // baseline (matching a player improving from 2.5 to 1.0 handicap).
    const FIN_GAMES = [
      ["putting","Putting Finisher",100,["pt1","pt2","pt3","pt4","pt5"]],
      ["shortGame","Short Game Finisher",100,["sg1","sg2","sg3","sg4","sg5"]],
      ["longGame","Long Game Finisher",100,["lg1","lg2","lg3","lg4"]],
    ];
    const FIN_COUNT = 25;
    const finisherSessions = [];
    for(let i=0;i<FIN_COUNT;i++){
      const [gameId, gameName, max, stationIds] = FIN_GAMES[i % FIN_GAMES.length];
      const progress = i/(FIN_COUNT-1);
      const basePct = 0.68 + progress*0.25; // 68% -> 93%, across the full year
      const noise = (pseudoRand(i*53+3)-0.5)*0.1;
      const edouardPct = Math.max(0.5, Math.min(0.97, basePct+noise));
      const withAlban = pseudoRand(i*7+1) > 0.65;
      const withSimon = pseudoRand(i*11+2) > 0.72;
      const daysAgo = (YEAR-1) - Math.round(progress*(YEAR-3));
      const baseTs = now - daysAgo*DAY - i*60000;
      const sessionId = "fs_demo_"+gameId+"_"+i;

      function mkPlayer(playerName, pct, isAccount, idx){
        const score = Math.round(max*pct);
        const per = Math.floor(score/stationIds.length);
        let remainder = score - per*stationIds.length;
        const stationScores = stationIds.map(()=>{
          const v = per + (remainder>0?1:0);
          if(remainder>0) remainder--;
          return v;
        });
        return {type:"finisher", sessionId, gameId, gameName, playerName, score, max, stationScores, multiplayer:(withAlban||withSimon), isAccount, ts:baseTs+idx};
      }
      finisherSessions.push(mkPlayer("Edouard L", edouardPct, true, 0));
      if(withAlban){
        const albanPct = Math.max(0.4, Math.min(0.95, edouardPct + (pseudoRand(i*17+4)-0.5)*0.25));
        finisherSessions.push(mkPlayer("Alban L", albanPct, false, 1));
      }
      if(withSimon){
        const simonPct = Math.max(0.4, Math.min(0.95, edouardPct + (pseudoRand(i*19+5)-0.5)*0.28));
        finisherSessions.push(mkPlayer("Simon M", simonPct, false, 2));
      }
    }

    // ── 30 scorecards from randomly chosen real courses, each scored for a
    // 2.0 handicap player (mostly pars, a healthy number of birdies, some
    // bogeys, rare doubles), with a hard clamp guaranteeing every round's
    // total lands between 69 and 81 strokes regardless of which course/par
    // combination gets picked.
    const realCourses = COURSES.filter(c=>!c.id.startsWith("g"));
    // Deterministic shuffle (Fisher-Yates using our seeded pseudoRand) so the
    // 35 rounds use 35 DISTINCT courses rather than allowing repeats — there
    // are 73 real courses available, comfortably more than the 35 needed.
    const shuffledCourses = [...realCourses];
    for(let i=shuffledCourses.length-1;i>0;i--){
      const j = Math.floor(pseudoRand(i*97+41)*(i+1));
      [shuffledCourses[i], shuffledCourses[j]] = [shuffledCourses[j], shuffledCourses[i]];
    }
    function pickCourse(seed){
      return shuffledCourses[(seed-1) % shuffledCourses.length];
    }
    function genRound(course, daysAgo, seedBase, feeling, scoreLo, scoreHi, roundType){
      const holeCount = 18;
      const pars = course.holes.slice(0, holeCount);
      let holes = pars.map((par,i)=>{
        const r = pseudoRand(seedBase*173+i*37);
        let rel;
        if(r<0.13) rel=-1;       // birdie
        else if(r<0.80) rel=0;   // par
        else if(r<0.97) rel=1;   // bogey
        else rel=2;              // double
        return {par, rel};
      });
      let total = holes.reduce((a,h)=>a+h.par+h.rel,0);
      // Clamp to the given [scoreLo, scoreHi] range (defaults to 69-81 if not
      // provided) by nudging the holes with the largest |rel| first, so the
      // round still reads naturally rather than uniformly shifting every hole.
      // The range itself shifts over the year to reflect real improvement —
      // see the per-round call site below.
      const lo = scoreLo!=null ? scoreLo : 69, hi = scoreHi!=null ? scoreHi : 81;
      const target = Math.max(lo, Math.min(hi, total));
      let diff = target - total;
      const order = [...holes.keys()].sort((a,b)=>Math.abs(holes[b].rel)-Math.abs(holes[a].rel));
      let oi = 0;
      while(diff !== 0 && oi < order.length*3){
        const idx = order[oi % order.length];
        if(diff>0 && holes[idx].rel < 2){ holes[idx].rel++; diff--; }
        else if(diff<0 && holes[idx].rel > -1){ holes[idx].rel--; diff++; }
        oi++;
      }
      const finalHoles = holes.map((h,i)=>{
        // IMPORTANT: r2/r3/r4/r5 here must be independent draws from whatever
        // decided h.rel above (which used pseudoRand(seedBase*173+i*37)) —
        // reusing that same value to also decide putts would make certain
        // combinations structurally impossible (e.g. a bogey only happens
        // when that value is in [0.80,0.97), so checking "that same value <=0.3"
        // for a 3-putt could never be true). Using different seed multipliers
        // keeps these decisions genuinely independent.
        const r2 = pseudoRand(seedBase*271+i*53);
        const r3 = pseudoRand(seedBase*337+i*61);
        const r4 = pseudoRand(seedBase*419+i*71);
        const r5 = pseudoRand(seedBase*491+i*83);
        let gir, putts, approachStrokes;
        if(h.rel<=-1){
          // Birdie or better: usually GIR + 1 putt (occasionally a chip-in
          // from just off the green, which still counts as missed GIR).
          // GIR-given-birdie tuned to 85% (not ~88%+) so the OVERALL GIR rate
          // across a full round lands in the realistic 52-54% band for a
          // 2.0-handicap player (real-world scratch golfers average 56.5%
          // GIR per published Shot Scope/Arccos data — a 2.0 handicap should
          // sit just under that, not above it as the old probabilities produced).
          if(r2>0.15){ gir=true; putts=1; approachStrokes = (h.par<=3?1:h.par-2); }
          else {
            // Chip-in attempt: usually succeeds (92%) since this is a birdie
            // overall, but occasionally needs a 2nd putt to finish (still a
            // birdie via 2 putts from a great chip, NOT counted as an
            // up-and-down success since putts>=2 here).
            gir=false;
            if(r5<0.92){ putts=0; approachStrokes = (h.par<=3?1:h.par-2)+1; }
            else { putts=2; approachStrokes = (h.par<=3?1:h.par-2)-1; } // chip left short, needs 2 putts but still nets a birdie
          }
        } else if(h.rel===0){
          // Par: GIR + 2 putts most of the time, or missed green needing a
          // scramble to save par. RE-TUNED for the scrambling definition
          // (missed green but still par-or-better, any stroke count) — under
          // that definition, a missed-green hole that still finishes at par
          // is AUTOMATICALLY a scrambling success, so the real lever for the
          // overall scrambling rate is the genScrambleFail roll just below,
          // not the putt-count branching (which only matters for the
          // putts-per-round stat, kept exactly as before so GIR% stays
          // correctly calibrated).
          if(r2>0.40){ gir=true; putts=2; approachStrokes = (h.par<=3?1:h.par-2); }
          else {
            gir=false;
            if(r5<0.55){ putts=1; approachStrokes = (h.par<=3?1:h.par-2)+1; }
            else { putts=2; approachStrokes = (h.par<=3?1:h.par-2); }
          }
        } else if(h.rel===1){
          // Bogey: missed green + 2 putts (most common), GIR + 3-putt (a
          // 2.0 handicap still 3-putts sometimes, even off good approach
          // play), or missed green + an up-and-down attempt. FIXED: the main
          // missed-green path was hardcoded to putts=2 (always failing the
          // up-and-down) — only a rare 10% sub-case ever had a chance to
          // succeed, which is why the overall up-and-down% came in far below
          // target even after adding variation elsewhere. Now genuinely
          // succeeds ~30% of the time across the whole missed-green
          // population, matching realistic scrambling rates for bogey holes.
          if(r2<0.12){ gir=true; putts=3; approachStrokes = (h.par<=3?1:h.par-2); }
          else if(r2<0.90){
            gir=false;
            if(r5<0.30){ putts=1; approachStrokes = (h.par<=3?1:h.par-2)+2; }
            else { putts=2; approachStrokes = (h.par<=3?1:h.par-2)+1; }
          }
          else {
            gir=false;
            if(r5<0.45){ putts=1; approachStrokes = (h.par<=3?1:h.par-2)+2; }
            else { putts=2; approachStrokes = (h.par<=3?1:h.par-2)+1; }
          }
        } else {
          // Double or worse: missed green, mostly 2 putts with extra approach
          // trouble, but sometimes a 3-putt compounds the bad hole further.
          // A true up-and-down essentially never happens here (~5%, matching
          // realistic scrambling-from-trouble rates) — when it does, the
          // total score stays the same (h.rel already fixes the outcome),
          // just reached via one fewer putt and one more approach stroke.
          gir=false;
          if(r5<0.05){ putts=1; approachStrokes = (h.par<=3?1:h.par-2) + h.rel + 1; }
          else { putts = r2<0.65?2:3; approachStrokes = (h.par<=3?1:h.par-2) + (h.rel - (putts-2)); }
        }
        const score = approachStrokes + putts;
        // FIR is tied loosely to hole outcome (better holes more likely to
        // have found the fairway, since a good approach usually starts from
        // a good lie) but not as strongly correlated as GIR, since a
        // scrambled par/bogey can still follow a missed fairway. Tuned to
        // land the OVERALL fairway rate around 54% for a 2.0 handicap,
        // matching the real-world benchmark table (was previously a flat
        // 75% regardless of outcome, which was unrealistically high).
        let firProb;
        if(h.rel<=-1) firProb=0.68;
        else if(h.rel===0) firProb=0.57;
        else if(h.rel===1) firProb=0.40;
        else firProb=0.25;
        const fir = h.par>3 ? r4<firProb : null;
        const missOptions=["left","right","short","long"];
        const miss = (!gir && r3>0.55) ? missOptions[Math.floor(r3*4)%4] : "";
        return {hole:i+1, par:h.par, score, putts, fir: h.par>3?(fir===true):false, gir, miss};
      });
      // ── Scrambling-rate correction (post-processing, score-total-preserving) ──
      // Under the scrambling definition (missed green, but still par-or-
      // better — see isUpDownSuccess), EVERY missed-green hole that stays at
      // par is structurally guaranteed to count as a success, regardless of
      // putt count. That meant the natural par/bogey mix from the rel roll
      // above produced an unrealistically high scrambling rate (~57%, well
      // above even the scratch benchmark of 50%) for this player's actual
      // skill level, while the threshold that controls it is the SAME one
      // GIR%/FIR%/score range depend on — so it can't be tuned directly
      // without breaking those.
      //
      // The fix: convert a controlled fraction of "missed-green par" holes
      // into "missed-green bogey" (a real +1 stroke, genuinely reducing the
      // success COUNT, not just relabeling which hole has which outcome —
      // an earlier swap-based attempt at this looked plausible but measured
      // as having ZERO effect, since swapping outcomes between two holes
      // can never change the aggregate count of successes vs failures).
      // To keep the round's total score unchanged, each conversion is paired
      // with reducing a DIFFERENT hole that already hit GIR by exactly 1
      // putt — that hole isn't a scrambling attempt at all (gir=true is
      // excluded from isUpDownAttempt), so adjusting it doesn't touch the
      // scrambling rate, and keeping score=(par-2)+putts valid there
      // preserves GIR-formula consistency throughout.
      const missedGreenPars = finalHoles.filter(h=>!h.gir && h.score<=h.par);
      const girHolesWithPutts = finalHoles.filter(h=>h.gir && h.putts>=1);
      let swapsDone = 0;
      missedGreenPars.forEach((parHole,s)=>{
        if(swapsDone>=girHolesWithPutts.length) return;
        const swapRoll = pseudoRand(seedBase*601+s*97);
        if(swapRoll>=0.16) return; // ~16% of "lucky" scrambles get converted to a missed scramble — tuned by direct measurement against the actual generated data to land the overall scrambling rate near the realistic ~47.5% target for a 1.0 handicap
        const compensationHole = girHolesWithPutts[swapsDone];
        parHole.score += 1; // missed-green par -> missed-green bogey (no longer a scrambling success)
        compensationHole.score -= 1; compensationHole.putts -= 1; // keeps the round total unchanged, and score=(par-2)+putts still holds
        swapsDone++;
      });
      return {type:"round", holes:finalHoles, n:holeCount, course:course.name, feeling, notes:"", roundType:roundType||"practice", ts: now - daysAgo*DAY};
    }
    const FEELINGS = ["focused","relaxed","neutral","pumped","anxious","tired"];
    const ROUND_COUNT = 35;
    const roundSessions = [];
    for(let i=0;i<ROUND_COUNT;i++){
      const course = pickCourse(i+1);
      const progress = i/(ROUND_COUNT-1); // 0 (a year ago) -> 1 (today)
      const daysAgo = (YEAR-2) - Math.round(progress*(YEAR-4));
      const feeling = FEELINGS[i % FEELINGS.length];
      // Score envelope tightens and shifts down across the year — centered
      // around a 2.5-handicap score (72-78 on a par-72 course) a year ago,
      // narrowing toward a 1.0-handicap score (70-76) today. This is what
      // actually drives the visible improvement in Stats and Handicap
      // History over the full year, while the underlying GIR/putts/up-and-
      // down probabilities in genRound stay exactly as tested — only the
      // final score target shifts, not the well-tested hole-by-hole logic.
      const scoreLo = Math.round(72 - progress*2);
      const scoreHi = Math.round(78 - progress*2);
      // Most rounds a real golfer logs are casual/practice play — club
      // competitions and tournaments are comparatively rare. ~18% of rounds
      // tagged as competition gives a realistic mix without it dominating.
      const roundType = pseudoRand(i*61+19) > 0.82 ? "competition" : "practice";
      roundSessions.push(genRound(course, daysAgo, i+1, feeling, scoreLo, scoreHi, roundType));
    }

    const allSessions = [...trainSessions, ...programSessions, ...finisherSessions, ...roundSessions].sort((a,b)=>b.ts-a.ts);
    save("caddy_sess_"+user.id, allSessions);

    // ── Goals: 4 active (in-progress) + 2 already-reached (archived) —
    // each one's startValue is computed from the rounds as they stood when
    // the goal was "created" partway through the year, not an arbitrary
    // number, so the progress bar and trend chart both show genuine,
    // consistent movement when the player opens the Goals tab.
    const roundsOnly = allSessions.filter(s=>s.type==="round").sort((a,b)=>a.ts-b.ts);
    function roundsAsOf(cutoffTs){ return roundsOnly.filter(r=>r.ts<=cutoffTs); }

    // ACTIVE GOAL — GIR%, created ~8 months ago, targeting a realistic
    // 5-point improvement from wherever the player's GIR% stood then.
    const goal1CreatedAt = now - 240*DAY;
    const goal1Start = computeGoalMetric("girPct", roundsAsOf(goal1CreatedAt)) ?? 47;

    // ACTIVE GOAL — 3-Putts per round, created ~5 months ago.
    const goal2CreatedAt = now - 150*DAY;
    const goal2Start = computeGoalMetric("threePutts18", roundsAsOf(goal2CreatedAt)) ?? 1.2;

    // ACTIVE GOAL — Up & Down %, created ~3 months ago.
    const goal3CreatedAt = now - 90*DAY;
    const goal3Start = computeGoalMetric("updownPct", roundsAsOf(goal3CreatedAt)) ?? 35;

    // ACTIVE GOAL — Average Score vs Par, spanning the FULL year: created
    // right near the start of the generated history and given a 12-month
    // deadline landing right around today, so it's the one goal a player
    // would see covering their entire season's progress in one place.
    const goal4CreatedAt = now - (YEAR-5)*DAY; // a few days after the very first round, so there's real data to baseline from
    const goal4Start = computeGoalMetric("avgScoreVsPar", roundsAsOf(goal4CreatedAt)) ?? 6.5;

    const goals = [
      {metricKey:"girPct", target:Math.round((goal1Start+5)*10)/10, startValue:goal1Start, deadline:new Date(now+60*DAY).toISOString().split("T")[0], periodMonths:12, createdAt:goal1CreatedAt},
      {metricKey:"threePutts18", target:Math.max(0,Math.round((goal2Start-0.4)*10)/10), startValue:goal2Start, deadline:new Date(now+30*DAY).toISOString().split("T")[0], periodMonths:6, createdAt:goal2CreatedAt},
      {metricKey:"updownPct", target:Math.round((goal3Start+8)*10)/10, startValue:goal3Start, deadline:new Date(now+180*DAY).toISOString().split("T")[0], periodMonths:6, createdAt:goal3CreatedAt},
      {metricKey:"avgScoreVsPar", target:Math.max(0,Math.round((goal4Start-3)*10)/10), startValue:goal4Start, deadline:new Date(now+10*DAY).toISOString().split("T")[0], periodMonths:12, createdAt:goal4CreatedAt},
    ];
    saveGoals(user.id, goals);

    // ── ARCHIVED GOALS — a couple of earlier goals this player actually
    // reached during the year, so the Goal History view (and the "Raise the
    // Bar" mindset behind it) has real, believable examples to show instead
    // of being empty. Both windows below are anchored to actual ROUND
    // INDICES (not absolute dates, which would drift since the whole year
    // of data is generated relative to "today") and were verified directly
    // against the generated data — the player's real performance at the
    // "reached" timestamp genuinely beats the target, so a reached goal
    // here is never a logical inconsistency the player could stumble into.
    // avgPutts18: round index 9 -> round index 21, a real, modest drop.
    const reached1CreatedAt = roundsOnly[9] ? roundsOnly[9].ts : (now-265*DAY);
    const reached1Start = computeGoalMetric("avgPutts18", roundsAsOf(reached1CreatedAt)) ?? 31.1;
    const reached1MarkedAt = roundsOnly[21] ? roundsOnly[21].ts : (now-140*DAY);
    const reached1Final = computeGoalMetric("avgPutts18", roundsAsOf(reached1MarkedAt)) ?? 30.7;
    const reached1Target = Math.round((reached1Start-0.3)*10)/10; // a real, modest, achievable-by-design target

    // firPct: round index 0 (the very first round) -> round index 6.
    const reached2CreatedAt = roundsOnly[0] ? roundsOnly[0].ts : (now-(YEAR-2)*DAY);
    const reached2Start = computeGoalMetric("firPct", roundsAsOf(reached2CreatedAt)) ?? 42.9;
    const reached2MarkedAt = roundsOnly[6] ? roundsOnly[6].ts : (now-(YEAR-65)*DAY);
    const reached2Final = computeGoalMetric("firPct", roundsAsOf(reached2MarkedAt)) ?? 49.5;
    const reached2Target = Math.round((reached2Start+5)*10)/10;

    const archive = [
      {metricKey:"avgPutts18", target:reached1Target, startValue:reached1Start, deadline:new Date(reached1CreatedAt+(4*30*DAY)).toISOString().split("T")[0], periodMonths:4, createdAt:reached1CreatedAt, outcome:"reached", finalValue:reached1Final, archivedAt:reached1MarkedAt},
      {metricKey:"firPct", target:reached2Target, startValue:reached2Start, deadline:new Date(reached2CreatedAt+(3*30*DAY)).toISOString().split("T")[0], periodMonths:3, createdAt:reached2CreatedAt, outcome:"reached", finalValue:reached2Final, archivedAt:reached2MarkedAt},
    ];
    save("caddy_goals_archive_"+user.id, archive);
  }catch(e){ /* seeding must never crash the app — fail silently */ }
}

export default function App(){
  const [user,setUser]=useState(()=>{ seedDemoData(); return stor("caddy_cur",null); });
  const [tab,setTab]=useState("train");
  const [sessions,setSessions]=useState(()=>user?stor("caddy_sess_"+user.id,[]):[]);
  const [settings,setSettings]=useState(()=>user?stor("caddy_settings_"+user.id,{...DEF_SETTINGS}):{...DEF_SETTINGS});
  const lang = settings?.language || "en";

  function login(u){ setUser(u); setSessions(stor("caddy_sess_"+u.id,[])); setSettings(stor("caddy_settings_"+u.id,{...DEF_SETTINGS})); }
  function logout(){ save("caddy_cur",null); setUser(null); setSessions([]); setSettings({...DEF_SETTINGS}); }
  function resetDemoData(){
    // Wipes everything this app stores in localStorage, runs the seed
    // function fresh, then updates React state directly — no page reload.
    // A full reload is unreliable inside sandboxed preview environments, so
    // this does everything in-memory instead, which always works.
    //
    // Explicitly clears every known key pattern rather than relying on
    // enumerating localStorage (Object.keys can behave inconsistently across
    // sandboxed/embedded browser contexts) — this is the more bulletproof path.
    try{
      const allUsers = stor("caddy_users", []);
      allUsers.forEach(u=>{
        localStorage.removeItem("caddy_sess_"+u.id);
        localStorage.removeItem("caddy_settings_"+u.id);
        localStorage.removeItem("caddy_savedcourses_"+u.id);
        localStorage.removeItem("caddy_plan_"+u.id);
      });
      localStorage.removeItem("caddy_users");
      localStorage.removeItem("caddy_cur");
      localStorage.removeItem("caddy_last_uid");
      localStorage.removeItem("caddy_last_email");
      // Belt-and-suspenders: also sweep anything still prefixed caddy_ in case
      // of orphaned keys from earlier testing sessions.
      const keys = Object.keys(localStorage).filter(k=>k.startsWith("caddy_"));
      keys.forEach(k=>localStorage.removeItem(k));
    }catch(e){}
    seedDemoData();
    const seededUser = stor("caddy_cur", null);
    setUser(seededUser);
    setSessions(seededUser ? stor("caddy_sess_"+seededUser.id, []) : []);
    setSettings(seededUser ? stor("caddy_settings_"+seededUser.id, {...DEF_SETTINGS}) : {...DEF_SETTINGS});
    setTab("train");
  }

  // Full wipe for handing the device/link to someone else — deletes every
  // account, every round, every training session, every setting this app has
  // ever stored (same thorough sweep as resetDemoData above), but does NOT
  // reseed the demo profile afterward. Instead it logs out completely, back
  // to the real sign-up screen, with language/units reset to English/metric
  // so the next person starts from the exact same clean baseline every time —
  // regardless of what the previous person had set.
  function resetForNewUser(){
    try{
      const allUsers = stor("caddy_users", []);
      allUsers.forEach(u=>{
        localStorage.removeItem("caddy_sess_"+u.id);
        localStorage.removeItem("caddy_settings_"+u.id);
        localStorage.removeItem("caddy_savedcourses_"+u.id);
        localStorage.removeItem("caddy_plan_"+u.id);
        localStorage.removeItem("caddy_clubs_"+u.id);
      });
      localStorage.removeItem("caddy_users");
      localStorage.removeItem("caddy_cur");
      localStorage.removeItem("caddy_last_uid");
      localStorage.removeItem("caddy_last_email");
      const keys = Object.keys(localStorage).filter(k=>k.startsWith("caddy_"));
      keys.forEach(k=>localStorage.removeItem(k));
    }catch(e){}
    setUser(null);
    setSessions([]);
    setSettings({...DEF_SETTINGS, language:"en", units:"metric"});
    setTab("train");
  }
  function addSession(s){ const ns=[s,...sessions]; setSessions(ns); save("caddy_sess_"+user.id,ns); }
  function clearSessions(){ setSessions([]); save("caddy_sess_"+user.id,[]); }
  function deleteOne(ts){ const ns=sessions.filter(s=>s.ts!==ts); setSessions(ns); save("caddy_sess_"+user.id,ns); }
  function saveUser(u){ const users=stor("caddy_users",[]); const idx=users.findIndex(x=>x.id===u.id); if(idx>=0){users[idx]={...users[idx],...u};save("caddy_users",users);} setUser(u); save("caddy_cur",u); }
  function saveSettings(s){ setSettings(s); save("caddy_settings_"+user.id,s); }

  if(!user) return <AuthScreen onLogin={login}/>;

  return (
    <div style={{minHeight:"100vh",background:OFF,fontFamily:"'Inter',system-ui,sans-serif",color:TEXT,display:"flex",flexDirection:"column",maxWidth:500,margin:"0 auto"}}>
      <div style={{background:HEADER_BG,padding:"14px 20px 0",position:"sticky",top:0,zIndex:50,boxShadow:"0 4px 24px rgba(15,25,40,0.2)",borderRadius:"0 0 24px 24px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,background:GOLD,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="flagPin" size={19} color={NAVY}/>
            </div>
            <div>
              <div style={{color:WHITE,fontFamily:"Georgia,serif",fontWeight:700,fontSize:20,lineHeight:1}}>Caddy</div>
              <div style={{color:"rgba(255,255,255,0.35)",fontSize:8.5,letterSpacing:2,textTransform:"uppercase",marginTop:2}}>Golf Trainer</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setTab("player")}>
            <div style={{textAlign:"right"}}>
              <div style={{color:WHITE,fontSize:12,fontWeight:600}}>{(user.name||"Player").split(" ")[0]}</div>
              {user.hdcp&&<div style={{color:GOLD,fontSize:10,fontWeight:700}}>HCP {user.hdcp}</div>}
            </div>
            <div style={{width:32,height:32,borderRadius:"50%",border:"2px solid "+GOLD,overflow:"hidden",background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {user.photo?<img src={user.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<Icon name="player" size={16} color="rgba(255,255,255,0.7)"/>}
            </div>
          </div>
        </div>
        <div style={{display:"flex"}}>
          {TABS.map(tb=>(
            <button key={tb.id} onClick={()=>setTab(tb.id)}
              style={{flex:1,padding:"8px 2px 11px",background:"none",border:"none",borderBottom:"3px solid "+(tab===tb.id?GOLD:"transparent"),color:tab===tb.id?WHITE:"rgba(255,255,255,0.38)",cursor:"pointer",fontSize:9,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <Icon name={tb.icon} size={17}/>
              {t(lang,tb.labelKey)}
            </button>
          ))}
        </div>
      </div>
      <div style={{flex:1,padding:"20px 18px 110px",overflowY:"auto"}}>
        {tab==="train"&&<TrainTab sessions={sessions} onSave={addSession} settings={settings} userId={user.id} accountName={user.name} hand={user.hand}/>}
        {tab==="score"&&<ScoreTab onSave={addSession} settings={settings} sessions={sessions} userId={user.id}/>}
        {tab==="stats"&&<StatsTab sessions={sessions} lang={lang} hdcp={user.hdcp} userId={user.id} onGoTrain={()=>setTab("train")} onGoScore={()=>setTab("score")}/>}
        {tab==="history"&&<HistoryTab sessions={sessions} onClear={clearSessions} onDeleteOne={deleteOne} lang={lang}/>}
        {tab==="player"&&<PlayerTab user={user} onSave={saveUser} settings={settings} onSaveSettings={saveSettings} onLogout={logout} onResetDemo={resetDemoData} onResetForNewUser={resetForNewUser}/>}
        {tab==="goals"&&<GoalsTab sessions={sessions} hdcp={user.hdcp} userId={user.id} lang={lang}/>}
      </div>
    </div>
  );
}
