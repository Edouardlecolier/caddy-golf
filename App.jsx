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
    {id:"p1",name:"Gate Drill",difficulty:"Beginner",duration:10,emoji:"🚪",purpose:"Face angle and path control",desc:"Place two tees just wider than your putter head, 15 cm in front of the ball. Make 20 putts from 1 m through the gate.",label:"Holed",max:20},
    {id:"p2",name:"Tap-In Confidence",difficulty:"Beginner",duration:10,emoji:"⭕",purpose:"Short-putt routine and confidence",desc:"Place 10 balls in a circle 30 cm from the hole, make all 10, then move to 60 cm.",label:"Consecutive made",max:20},
    {id:"p3",name:"Straight Putt",difficulty:"Beginner",duration:10,emoji:"📏",purpose:"Stroke mechanics and tempo",desc:"Find the straightest putt on the green. Hit 15 putts from 1 m with a smooth pendulum stroke.",label:"Holed",max:15},
    {id:"p4",name:"Lag to the Fringe",difficulty:"Beginner",duration:10,emoji:"🎯",purpose:"Distance control and speed",desc:"From 9 m, stop 10 balls within 15 cm of the fringe without going over.",label:"Stopped in zone",max:10},
    {id:"p5",name:"One-Hand Drill",difficulty:"Beginner",duration:10,emoji:"✋",purpose:"Feel and prevents wrist flip",desc:"Putt 10 balls with your lead hand only from 1.2 m. Builds feel and prevents flipping.",label:"Holed",max:10},
    {id:"p6",name:"Ladder to the Hole",difficulty:"Beginner",duration:10,emoji:"🪜",purpose:"Basic speed judgment",desc:"Putt one ball each from 2 m, 4 m, 6 m, 8 m, aiming to finish past the hole but within 1 m. Repeat the ladder 3 times.",label:"In zone (of 12)",max:12},
    {id:"p7",name:"Clock Drill",difficulty:"Intermediate",duration:15,emoji:"🕐",purpose:"Consistency from all angles",desc:"4 balls at 1 m around the hole like a clock. Complete the full circle without missing. Repeat 3 rounds.",label:"Consecutive made",max:12},
    {id:"p8",name:"Distance Ladder",difficulty:"Intermediate",duration:15,emoji:"📶",purpose:"Speed calibration",desc:"Putt to targets at 3 m, 6 m, 9 m. Score a point if ball stops within 1 club-length. 5 attempts each.",label:"Points earned",max:15},
    {id:"p9",name:"5-Footer Pressure",difficulty:"Intermediate",duration:15,emoji:"💪",purpose:"Pressure performance",desc:"Sink 5 in a row from 1.5 m. Every miss resets the count. Simulates competition pressure.",label:"Attempts to complete",max:20},
    {id:"p10",name:"Breaking Putt",difficulty:"Intermediate",duration:15,emoji:"↩️",purpose:"Break reading",desc:"Find a consistent breaking putt at 2.5 m. Hit 10 putts tracking the start line. Make 6+ to pass.",label:"Holed",max:10},
    {id:"p11",name:"Two-Tier Speed",difficulty:"Intermediate",duration:15,emoji:"🌀",purpose:"Speed control on slopes",desc:"Find a two-tier green or slope. Putt 10 balls from the lower tier to a hole on the upper tier, focusing only on getting the speed right.",label:"Within 1 m",max:10},
    {id:"p12",name:"100-Ball Putting",difficulty:"Advanced",duration:30,emoji:"💯",purpose:"Endurance and baseline",desc:"100 putts from 1 to 6 m mixing straight and breaking lines. Track every make.",label:"Holed",max:100},
    {id:"p13",name:"Pressure 18",difficulty:"Advanced",duration:25,emoji:"🏆",purpose:"Tournament simulation",desc:"18 pressure situations: 6 at 1.2 m, 6 at 1.8 m, 6 at 2.4 m. 2 pts for make, 1 for tap-in, 0 for 3-putt.",label:"Points",max:36},
    {id:"p14",name:"3-6-9 Circuit",difficulty:"Advanced",duration:20,emoji:"📐",purpose:"Scoring from short range",desc:"Make 3 from 1 m, 3 from 2 m, 3 from 3 m without missing. Each miss adds a penalty putt.",label:"Total putts",max:20},
    {id:"p15",name:"Lag Putt Marathon",difficulty:"Advanced",duration:25,emoji:"🎯",purpose:"Long putt distance control",desc:"15 putts from 12-15 m, all to different holes. Score 2 points for 2-putt range (within 1 m), 0 for anything further.",label:"Points",max:30},
  ],
  shortGame: [
    {id:"s1",name:"Up and Down",difficulty:"Beginner",duration:10,emoji:"⛳",purpose:"Basic chipping and finishing",desc:"From 5 m off the green, chip and putt. 10 attempts. Count successful up and downs.",label:"Up and downs",max:10},
    {id:"s2",name:"Landing Zone",difficulty:"Beginner",duration:10,emoji:"🎯",purpose:"Landing spot awareness",desc:"Place a towel 1 m onto the green. From 9 m, hit 15 shots trying to land on the towel. Pick whatever club gets the ball there on a low, controlled flight.",label:"Hits on towel",max:15},
    {id:"s3",name:"Chip to a Tee",difficulty:"Beginner",duration:10,emoji:"📌",purpose:"Precision proximity control",desc:"Push a tee 2 m from the edge of the green. From 7 m, hit 10 shots within 1 m of the tee.",label:"Within 1 m",max:10},
    {id:"s4",name:"Ladder Chips",difficulty:"Beginner",duration:10,emoji:"🪜",purpose:"Distance control on chips",desc:"From the same spot, chip 3 balls to a near target, 3 to a middle target, 3 to a far target, all on the green. Focus only on matching your swing length to the distance.",label:"On target (of 9)",max:9},
    {id:"s5",name:"Bump and Run",difficulty:"Intermediate",duration:15,emoji:"🎳",purpose:"Low trajectory shot control",desc:"From 18 m, bump and run to a specific hole using a low, rolling shot. 10 attempts, track within 2 m.",label:"Within 2 m",max:10},
    {id:"s6",name:"Pick Your Club",difficulty:"Intermediate",duration:15,emoji:"🏑",purpose:"Club selection confidence",desc:"From 14 m, hit 15 shots using whichever 3 clubs you'd naturally choose for this shot. Notice which one gives you the most consistent result — that's your go-to.",label:"Within 1.2 m",max:15},
    {id:"s7",name:"Bunker Escape",difficulty:"Intermediate",duration:15,emoji:"🏖️",purpose:"Sand technique",desc:"From a greenside bunker, get 10 balls on the green. Track how many finish within 3 m of the flag.",label:"Balls on green",max:10},
    {id:"s8",name:"Pitch Precision",difficulty:"Intermediate",duration:15,emoji:"📡",purpose:"Wedge distance control",desc:"From 27 m, hit 10 pitch shots. Land within 3 m and stop within 4.5 m total.",label:"Within 4.5 m",max:10},
    {id:"s9",name:"Uphill / Downhill Lies",difficulty:"Intermediate",duration:15,emoji:"⛰️",purpose:"Adapting to slope",desc:"Find an uphill and a downhill stance near the green. Hit 5 chips from each, focusing on solid contact and controlling distance despite the slope.",label:"Up and downs",max:10},
    {id:"s10",name:"Flop Shot",difficulty:"Advanced",duration:20,emoji:"🎭",purpose:"High trajectory mastery",desc:"Over an obstacle from 14 m, hit 10 high, soft-landing shots. Must land on green and stop within 2.5 m.",label:"Successful flops",max:10},
    {id:"s11",name:"Short Game Circuit",difficulty:"Advanced",duration:30,emoji:"🔄",purpose:"Full short game consistency",desc:"5 stations around the green at varying distances: chip, pitch, high flop, bunker, awkward lie. 5 balls each. Track up and downs at each.",label:"Up and downs",max:25},
    {id:"s12",name:"Up and Down 18",difficulty:"Advanced",duration:30,emoji:"🏅",purpose:"Scrambling endurance",desc:"Simulate 18 short game situations: 6 from rough, 6 from sand, 6 from tight lies, all within 20 m of the green.",label:"Up and downs",max:18},
    {id:"s13",name:"One Ball, No Re-Dos",difficulty:"Advanced",duration:20,emoji:"🎲",purpose:"Commitment without practice swings",desc:"Walk to 10 random spots within 20 m of the green. Hit one shot from each with no practice swing or redo, exactly like on the course. Track up and downs.",label:"Up and downs",max:10},
  ],
  longGame: [
    {id:"l1",name:"Alignment Drill",difficulty:"Beginner",duration:10,emoji:"📏",purpose:"Setup and alignment",desc:"Use alignment sticks. Hit 20 mid-iron shots focusing purely on solid, centred contact. No target — just feel the strike.",label:"Solid contacts",max:20},
    {id:"l2",name:"Slow Motion Swings",difficulty:"Beginner",duration:10,emoji:"🐢",purpose:"Swing plane and sequencing",desc:"15 balls at 50% speed with a mid-iron. Keep the club on plane and finish in balance. Rate each swing 1 to 3.",label:"Balanced finishes",max:15},
    {id:"l3",name:"Feet Together",difficulty:"Beginner",duration:10,emoji:"🦵",purpose:"Balance and rhythm",desc:"15 balls with feet together using any iron. Forces correct weight transfer and natural rhythm.",label:"Clean contacts",max:15},
    {id:"l4",name:"Low Point Control",difficulty:"Beginner",duration:10,emoji:"🎯",purpose:"Ball-then-turf contact",desc:"Draw a line in the grass or use a spray line. Hit 15 mid-iron shots trying to take a divot just in front of the line every time.",label:"Correct low point",max:15},
    {id:"l5",name:"Fairway Finder",difficulty:"Intermediate",duration:15,emoji:"🛣️",purpose:"Driver accuracy",desc:"10 tee shots with your driver to a defined fairway corridor. Track hits and which side you miss.",label:"Fairways hit",max:10},
    {id:"l6",name:"Iron Accuracy at 130m",difficulty:"Intermediate",duration:20,emoji:"🎯",purpose:"Mid-range iron dispersion",desc:"Pick a target 130 m away. Use whichever club you'd normally hit that distance. 15 shots, track how many finish within 18 m of target.",label:"On target",max:15},
    {id:"l7",name:"9-Shot Matrix",difficulty:"Intermediate",duration:20,emoji:"🎲",purpose:"Shot shaping control",desc:"Hit 9 shots with one club: high, mid, low combined with draw, straight, fade. 1 point per successful intentional shape.",label:"Shapes achieved",max:9},
    {id:"l8",name:"Wedge Distance Ladder",difficulty:"Intermediate",duration:20,emoji:"📶",purpose:"Partial swing calibration",desc:"5 balls each at 50, 75 and 100% swing speed with your shortest wedge. Note how far each effort level carries — this becomes your personal distance chart.",label:"Within 5 m of intended",max:15},
    {id:"l9",name:"Stock Shot Repeatability",difficulty:"Intermediate",duration:20,emoji:"🔁",purpose:"Consistency under no pressure",desc:"Pick one club and one target. Hit 15 shots trying to repeat the exact same shot every time. Track how many finish within a 10 m circle.",label:"Within 10 m",max:15},
    {id:"l10",name:"Par 3 Simulation",difficulty:"Advanced",duration:25,emoji:"🏌️",purpose:"Pressure iron play",desc:"Simulate 9 par-3 holes at varying distances from 90 to 165 m. Pick realistic targets and clubs. Track greens hit.",label:"Greens hit",max:9},
    {id:"l11",name:"Full Bag Challenge",difficulty:"Advanced",duration:40,emoji:"🎒",purpose:"Whole bag consistency",desc:"2 shots with every club in your bag, longest to shortest. Rate each shot: 0 poor, 1 ok, 2 great.",label:"Points",max:18},
    {id:"l12",name:"Driver Under Pressure",difficulty:"Advanced",duration:20,emoji:"😤",purpose:"Performance under stress",desc:"10 drivers to the narrowest corridor you can define. Simulate your tightest tee shot at home.",label:"Fairways hit",max:10},
    {id:"l13",name:"Trouble Shots",difficulty:"Advanced",duration:25,emoji:"🌲",purpose:"Recovery shot skills",desc:"Simulate 10 trouble situations: punch under a branch, draw around an obstacle, fade over trouble. Rate each shot 0 (failed) to 2 (executed as planned).",label:"Points",max:20},
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
  // AI-generated photos are deferred to a future backend project (they require
  // a server to hold the API key safely). For now, go straight to the
  // illustrated diagram — no pointless network attempt or loading delay.
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
  p3:{pattern:"gate", why:"A dead-straight putt isolates pure stroke mechanics — no green-reading variable to hide behind."},
  p4:{pattern:"ladder", why:"Lag putting is about feel, not mechanics. Stopping short of going long trains the deceleration touch most amateurs never practice."},
  p5:{pattern:"circle", why:"Removing your trail hand exposes any flip or manipulation at impact — the lead hand alone can't compensate for bad technique."},
  p6:{pattern:"ladder", why:"A basic speed ladder teaches your body what different distances actually feel like before adding complexity."},
  p7:{pattern:"circle", why:"Putting from all four clock positions trains break-reading and stroke consistency simultaneously, since every angle breaks differently."},
  p8:{pattern:"ladder", why:"Matching speed across three distances trains the core skill of putting: knowing how hard to hit it, not just which way it breaks."},
  p9:{pattern:"pressure", why:"Five in a row with a reset on miss creates real stakes — your stroke under that pressure is closer to tournament golf than rote repetition."},
  p10:{pattern:"gate", why:"Reading and committing to one consistent breaking line, repeatedly, trains trust in your read instead of second-guessing mid-stroke."},
  p11:{pattern:"balance", why:"A two-tier slope punishes pace errors brutally — this is the fastest way to feel why speed matters more than line on slopes."},
  p12:{pattern:"ladder", why:"Volume at mixed distances builds a real statistical baseline of your putting, not just a good day or a bad one."},
  p13:{pattern:"pressure", why:"Pressure stacked onto short, makeable putts mirrors exactly the moments that actually cost strokes on the course."},
  p14:{pattern:"ladder", why:"Counting total putts taken (not just makes) reveals how costly one miss really is, since it adds a penalty stroke instantly."},
  p15:{pattern:"ladder", why:"Long lag putts separate good putters from great ones — most rounds are lost to 3-putts from distance, not missed tap-ins."},
  // shortGame
  s1:{pattern:"towel", why:"Up and down from a fixed spot teaches the two-shot sequence as one skill, not two separate shots."},
  s2:{pattern:"towel", why:"Landing on a specific spot trains trajectory control — the single biggest skill gap between good and great short games."},
  s3:{pattern:"towel", why:"A tee as a target removes the temptation to just 'get it close' — it forces precision."},
  s4:{pattern:"ladder", why:"Hitting three different distances with the same motion trains touch and feel rather than memorized swings."},
  s5:{pattern:"bunker", why:"Low, running shots are lower risk than the flop — mastering this first builds a reliable go-to before adding aggressive options."},
  s6:{pattern:"grid", why:"Comparing clubs from the same spot reveals which option you control best — that becomes your default, removing decision fatigue on course."},
  s7:{pattern:"bunker", why:"Sand technique is almost entirely about contact point, not power — repetition here builds the feel for hitting the sand, not the ball."},
  s8:{pattern:"towel", why:"A longer pitch demands full-swing rhythm at a shorter length — most miss-hits here come from rushing the tempo."},
  s9:{pattern:"trouble", why:"Slopes change your low point and balance — practicing both uphill and downhill builds adaptability you can't get on flat ground."},
  s10:{pattern:"wedge", why:"A high, soft shot only works with full commitment to the technique — half-effort attempts usually come up short or skull it."},
  s11:{pattern:"grid", why:"Five different lies in one session forces rapid adjustment — exactly the skill scrambling on course demands."},
  s12:{pattern:"grid", why:"Eighteen simulated situations builds the stamina and consistency of a real round's worth of scrambling chances."},
  s13:{pattern:"pressure", why:"No practice swing or redo mirrors real conditions — committing cold to a shot is a skill on its own."},
  // longGame
  l1:{pattern:"fairway", why:"Pure focus on contact (no target) removes outcome pressure so you can feel what a centred strike actually feels like."},
  l2:{pattern:"balance", why:"Slowing the swing down exposes sequencing flaws that are invisible at full speed."},
  l3:{pattern:"balance", why:"Feet together removes the ability to sway, forcing the turn to come from rotation instead of weight-shifting compensation."},
  l4:{pattern:"grid", why:"Training your low point relative to the ball builds the ball-then-turf contact that separates clean strikes from fat or thin shots."},
  l5:{pattern:"fairway", why:"A defined corridor gives you a real pass/fail target instead of a vague sense of 'hit it well.'"},
  l6:{pattern:"grid", why:"A fixed distance with volume builds a true dispersion pattern — you'll see your real miss tendency, not just guess at it."},
  l7:{pattern:"trouble", why:"Shaping shots on demand proves you control ball flight rather than just reacting to whatever the club gives you."},
  l8:{pattern:"wedge", why:"Wedge distances are the most controllable in the bag — calibrating effort levels here directly lowers your scores inside 100m."},
  l9:{pattern:"grid", why:"Repeating one shot at one target with no variation isolates pure consistency, separate from skill variety."},
  l10:{pattern:"fairway", why:"Simulating real hole distances under no extra pressure builds course-realistic practice instead of abstract range work."},
  l11:{pattern:"grid", why:"Rating every club in the bag honestly reveals which ones you trust and which ones need work — most players guess wrong here."},
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
  p2:{name:"Confiance Courts Putts",purpose:"Routine et confiance sur les putts courts",desc:"Placez 10 balles en cercle a 30 cm du trou, reussissez les 10, puis passez a 60 cm.",label:"Consecutifs reussis"},
  p3:{name:"Putt Droit",purpose:"Mecanique du putt et tempo",desc:"Trouvez le putt le plus droit sur le green. Faites 15 putts depuis 1 m avec un mouvement de pendule fluide.",label:"Reussis"},
  p4:{name:"Lag vers la Frange",purpose:"Controle de distance et vitesse",desc:"Depuis 9 m, arretez 10 balles a moins de 15 cm de la frange sans la depasser.",label:"Arretees dans la zone"},
  p5:{name:"Exercice a Une Main",purpose:"Sensations et evite le flip du poignet",desc:"Puttez 10 balles avec seulement votre main directrice depuis 1.2 m. Developpe les sensations et evite le flip a l'impact.",label:"Reussis"},
  p6:{name:"Echelle vers le Trou",purpose:"Jugement de vitesse de base",desc:"Puttez une balle depuis 2 m, 4 m, 6 m, 8 m, en visant a finir apres le trou mais a moins de 1 m. Repetez l'echelle 3 fois.",label:"Dans la zone (sur 12)"},
  p7:{name:"Exercice de l'Horloge",purpose:"Constance depuis tous les angles",desc:"4 balles a 1 m autour du trou comme une horloge. Completez le cercle entier sans rater. Repetez 3 tours.",label:"Consecutifs reussis"},
  p8:{name:"Echelle de Distance",purpose:"Calibrage de la vitesse",desc:"Puttez vers des cibles a 3 m, 6 m, 9 m. Marquez un point si la balle s'arrete a moins d'une longueur de club. 5 tentatives chacune.",label:"Points marques"},
  p9:{name:"Pression a 1.5m",purpose:"Performance sous pression",desc:"Reussissez 5 putts de suite depuis 1.5 m. Chaque rate remet le compteur a zero. Simule la pression de competition.",label:"Tentatives pour reussir"},
  p10:{name:"Putt avec Effet",purpose:"Lecture du break",desc:"Trouvez un putt avec un break constant a 2.5 m. Faites 10 putts en suivant la ligne de depart. Reussissez-en 6+ pour passer.",label:"Reussis"},
  p11:{name:"Vitesse a Deux Niveaux",purpose:"Controle de vitesse sur pentes",desc:"Trouvez un green a deux niveaux ou une pente. Puttez 10 balles du niveau bas vers un trou sur le niveau haut, en vous concentrant uniquement sur la vitesse.",label:"A moins de 1 m"},
  p12:{name:"100 Putts",purpose:"Endurance et reference de base",desc:"100 putts de 1 a 6 m en melangeant lignes droites et breaks. Suivez chaque reussite.",label:"Reussis"},
  p13:{name:"Pression 18",purpose:"Simulation de tournoi",desc:"18 situations de pression : 6 a 1.2 m, 6 a 1.8 m, 6 a 2.4 m. 2 pts si reussi, 1 pour tap-in, 0 pour 3-putt.",label:"Points"},
  p14:{name:"Circuit 3-6-9",purpose:"Scoring depuis courte distance",desc:"Reussissez 3 putts a 1 m, 3 a 2 m, 3 a 3 m sans rater. Chaque rate ajoute un putt de penalite.",label:"Total des putts"},
  p15:{name:"Marathon de Lag Putt",purpose:"Controle de distance sur longs putts",desc:"15 putts de 12-15 m, tous vers des trous differents. Marquez 2 points pour une zone de 2-putt (a moins de 1 m), 0 sinon.",label:"Points"},
  s1:{name:"Up and Down",purpose:"Chipping de base et finition",desc:"Depuis 5 m du green, chippez et puttez. 10 tentatives. Comptez les up and down reussis.",label:"Up and downs"},
  s2:{name:"Zone d'Atterrissage",purpose:"Conscience du point d'atterrissage",desc:"Placez une serviette a 1 m sur le green. Depuis 9 m, frappez 15 coups en essayant d'atterrir sur la serviette. Choisissez le club qui donne un vol bas et controle.",label:"Coups sur la serviette"},
  s3:{name:"Chip vers un Tee",purpose:"Controle de proximite et precision",desc:"Plantez un tee a 2 m du bord du green. Depuis 7 m, frappez 10 coups a moins de 1 m du tee.",label:"A moins de 1 m"},
  s4:{name:"Chips en Echelle",purpose:"Controle de distance sur les chips",desc:"Depuis le meme endroit, chippez 3 balles vers une cible proche, 3 vers une cible moyenne, 3 vers une cible lointaine, toutes sur le green. Adaptez uniquement la longueur de votre geste a la distance.",label:"Sur la cible (sur 9)"},
  s5:{name:"Bump and Run",purpose:"Controle du coup roule a trajectoire basse",desc:"Depuis 18 m, faites un bump and run vers un trou precis avec un coup bas et roulant. 10 tentatives, suivez la precision a 2 m.",label:"A moins de 2 m"},
  s6:{name:"Choisissez Votre Club",purpose:"Confiance dans le choix du club",desc:"Depuis 14 m, frappez 15 coups en utilisant les 3 clubs que vous choisiriez naturellement pour ce coup. Notez lequel donne le resultat le plus constant — c'est votre club de reference.",label:"A moins de 1.2 m"},
  s7:{name:"Sortie de Bunker",purpose:"Technique de sable",desc:"Depuis un bunker pres du green, sortez 10 balles sur le green. Suivez combien finissent a moins de 3 m du drapeau.",label:"Balles sur le green"},
  s8:{name:"Precision de Pitch",purpose:"Controle de distance au wedge",desc:"Depuis 27 m, frappez 10 pitchs. Atterrissez a moins de 3 m et arretez-vous a moins de 4.5 m au total.",label:"A moins de 4.5 m"},
  s9:{name:"Pentes Montantes / Descendantes",purpose:"Adaptation a la pente",desc:"Trouvez une position en montee et en descente pres du green. Faites 5 chips de chaque, en vous concentrant sur un contact solide et le controle de la distance malgre la pente.",label:"Up and downs"},
  s10:{name:"Flop Shot",purpose:"Maitrise de la trajectoire haute",desc:"Au-dessus d'un obstacle depuis 14 m, frappez 10 coups hauts et doux. Doit atterrir sur le green et s'arreter a moins de 2.5 m.",label:"Flops reussis"},
  s11:{name:"Circuit de Petit Jeu",purpose:"Constance complete du petit jeu",desc:"5 stations autour du green a distances variees : chip, pitch, flop haut, bunker, position difficile. 5 balles chacune. Suivez les up and downs a chaque station.",label:"Up and downs"},
  s12:{name:"18 Up and Downs",purpose:"Endurance au scrambling",desc:"Simulez 18 situations de petit jeu : 6 depuis le rough, 6 depuis le sable, 6 depuis des positions difficiles, toutes a moins de 20 m du green.",label:"Up and downs"},
  s13:{name:"Une Balle, Sans Repetition",purpose:"Engagement sans coup d'essai",desc:"Marchez vers 10 endroits aleatoires a moins de 20 m du green. Frappez un coup depuis chacun sans coup d'essai ni reprise, exactement comme sur le parcours. Suivez les up and downs.",label:"Up and downs"},
  l1:{name:"Exercice d'Alignement",purpose:"Position et alignement",desc:"Utilisez des batons d'alignement. Frappez 20 coups de fer moyen en vous concentrant uniquement sur un contact solide et centre. Pas de cible — ressentez juste la frappe.",label:"Contacts solides"},
  l2:{name:"Swings au Ralenti",purpose:"Plan de swing et sequencement",desc:"15 balles a 50% de vitesse avec un fer moyen. Gardez le club sur le plan et finissez en equilibre. Notez chaque swing de 1 a 3.",label:"Finitions equilibrees"},
  l3:{name:"Pieds Joints",purpose:"Equilibre et rythme",desc:"15 balles avec les pieds joints en utilisant n'importe quel fer. Force le bon transfert de poids et un rythme naturel.",label:"Contacts propres"},
  l4:{name:"Controle du Point Bas",purpose:"Contact balle puis gazon",desc:"Tracez une ligne dans l'herbe ou utilisez une ligne de spray. Frappez 15 coups de fer moyen en essayant de prendre un divot juste devant la ligne chaque fois.",label:"Point bas correct"},
  l5:{name:"Precision au Driver",purpose:"Precision au driver",desc:"10 coups de depart au driver vers un couloir de fairway defini. Suivez les reussites et de quel cote vous ratez.",label:"Fairways atteints"},
  l6:{name:"Precision Fer a 130m",purpose:"Dispersion des fers a moyenne distance",desc:"Choisissez une cible a 130 m. Utilisez le club que vous frapperiez normalement a cette distance. 15 coups, suivez combien finissent a moins de 18 m de la cible.",label:"Sur la cible"},
  l7:{name:"Matrice 9 Coups",purpose:"Controle de la trajectoire de balle",desc:"Frappez 9 coups avec un seul club : haut, moyen, bas combines avec draw, droit, fade. 1 point par trajectoire intentionnelle reussie.",label:"Trajectoires reussies"},
  l8:{name:"Echelle de Distance Wedge",purpose:"Calibrage du swing partiel",desc:"5 balles chacune a 50, 75 et 100% de vitesse de swing avec votre wedge le plus court. Notez la distance de chaque niveau d'effort — cela devient votre carte de distances personnelle.",label:"A moins de 5 m de l'objectif"},
  l9:{name:"Repetabilite du Coup Standard",purpose:"Constance sans pression",desc:"Choisissez un club et une cible. Frappez 15 coups en essayant de repeter exactement le meme coup chaque fois. Suivez combien finissent dans un cercle de 10 m.",label:"A moins de 10 m"},
  l10:{name:"Simulation Par 3",purpose:"Jeu de fer sous pression",desc:"Simulez 9 trous de par 3 a distances variees de 90 a 165 m. Choisissez des cibles et clubs realistes. Suivez les greens atteints.",label:"Greens atteints"},
  l11:{name:"Defi du Sac Complet",purpose:"Constance de tout le sac",desc:"2 coups avec chaque club de votre sac, du plus long au plus court. Notez chaque coup : 0 mauvais, 1 correct, 2 excellent.",label:"Points"},
  l12:{name:"Driver Sous Pression",purpose:"Performance sous stress",desc:"10 coups de driver vers le couloir le plus etroit que vous puissiez definir. Simulez votre coup de depart le plus serre a domicile.",label:"Fairways atteints"},
  l13:{name:"Coups de Recuperation",purpose:"Competences de recuperation",desc:"Simulez 10 situations difficiles : coup sous une branche, draw autour d'un obstacle, fade au-dessus d'un probleme. Notez chaque coup de 0 (echec) a 2 (execute comme prevu).",label:"Points"},
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
  p2:{name:"Confianza en Putts Cortos",purpose:"Rutina y confianza en putts cortos",desc:"Coloca 10 bolas en circulo a 30 cm del hoyo, embocalas todas, luego pasa a 60 cm.",label:"Consecutivos embocados"},
  p3:{name:"Putt Recto",purpose:"Mecanica del putt y tempo",desc:"Encuentra el putt mas recto en el green. Haz 15 putts desde 1 m con un movimiento de pendulo suave.",label:"Embocados"},
  p4:{name:"Lag hacia el Borde",purpose:"Control de distancia y velocidad",desc:"Desde 9 m, detén 10 bolas a menos de 15 cm del borde sin pasarlo.",label:"Detenidas en zona"},
  p5:{name:"Ejercicio a Una Mano",purpose:"Sensibilidad y evita el latigazo de muneca",desc:"Putea 10 bolas solo con tu mano guia desde 1.2 m. Desarrolla sensibilidad y evita el latigazo en el impacto.",label:"Embocados"},
  p6:{name:"Escalera hacia el Hoyo",purpose:"Juicio basico de velocidad",desc:"Putea una bola desde 2 m, 4 m, 6 m, 8 m, buscando pasar el hoyo pero quedar a menos de 1 m. Repite la escalera 3 veces.",label:"En zona (de 12)"},
  p7:{name:"Ejercicio del Reloj",purpose:"Consistencia desde todos los angulos",desc:"4 bolas a 1 m alrededor del hoyo como un reloj. Completa el circulo entero sin fallar. Repite 3 rondas.",label:"Consecutivos embocados"},
  p8:{name:"Escalera de Distancia",purpose:"Calibracion de velocidad",desc:"Putea hacia objetivos a 3 m, 6 m, 9 m. Anota un punto si la bola se detiene a menos de un largo de palo. 5 intentos cada uno.",label:"Puntos obtenidos"},
  p9:{name:"Presion a 1.5m",purpose:"Rendimiento bajo presion",desc:"Emboca 5 seguidos desde 1.5 m. Cada fallo reinicia el contador. Simula la presion de competicion.",label:"Intentos para completar"},
  p10:{name:"Putt con Curva",purpose:"Lectura de la curva",desc:"Encuentra un putt con curva consistente a 2.5 m. Haz 10 putts siguiendo la linea de salida. Emboca 6+ para pasar.",label:"Embocados"},
  p11:{name:"Velocidad en Dos Niveles",purpose:"Control de velocidad en pendientes",desc:"Encuentra un green de dos niveles o una pendiente. Putea 10 bolas desde el nivel inferior hacia un hoyo en el nivel superior, enfocandote solo en la velocidad correcta.",label:"A menos de 1 m"},
  p12:{name:"100 Putts",purpose:"Resistencia y linea base",desc:"100 putts de 1 a 6 m mezclando lineas rectas y con curva. Registra cada acierto.",label:"Embocados"},
  p13:{name:"Presion 18",purpose:"Simulacion de torneo",desc:"18 situaciones de presion: 6 a 1.2 m, 6 a 1.8 m, 6 a 2.4 m. 2 pts si embocas, 1 para tap-in, 0 para 3-putt.",label:"Puntos"},
  p14:{name:"Circuito 3-6-9",purpose:"Anotar desde corta distancia",desc:"Emboca 3 putts a 1 m, 3 a 2 m, 3 a 3 m sin fallar. Cada fallo anade un putt de penalizacion.",label:"Total de putts"},
  p15:{name:"Maraton de Lag Putt",purpose:"Control de distancia en putts largos",desc:"15 putts de 12-15 m, todos a hoyos diferentes. Anota 2 puntos por quedar en rango de 2-putt (a menos de 1 m), 0 en otro caso.",label:"Puntos"},
  s1:{name:"Up and Down",purpose:"Chipping basico y finalizacion",desc:"Desde 5 m del green, haz chip y putt. 10 intentos. Cuenta los up and down logrados.",label:"Up and downs"},
  s2:{name:"Zona de Aterrizaje",purpose:"Conciencia del punto de aterrizaje",desc:"Coloca una toalla a 1 m en el green. Desde 9 m, golpea 15 tiros intentando aterrizar en la toalla. Elige el palo que de un vuelo bajo y controlado.",label:"Aciertos en la toalla"},
  s3:{name:"Chip hacia un Tee",purpose:"Control de proximidad y precision",desc:"Coloca un tee a 2 m del borde del green. Desde 7 m, golpea 10 tiros a menos de 1 m del tee.",label:"A menos de 1 m"},
  s4:{name:"Chips en Escalera",purpose:"Control de distancia en chips",desc:"Desde el mismo lugar, haz chip de 3 bolas a un objetivo cercano, 3 a uno medio, 3 a uno lejano, todos en el green. Ajusta solo la longitud de tu swing a la distancia.",label:"En objetivo (de 9)"},
  s5:{name:"Bump and Run",purpose:"Control de tiro bajo y rodado",desc:"Desde 18 m, haz un bump and run hacia un hoyo especifico con un tiro bajo y rodado. 10 intentos, registra precision a 2 m.",label:"A menos de 2 m"},
  s6:{name:"Elige Tu Palo",purpose:"Confianza en la seleccion de palo",desc:"Desde 14 m, golpea 15 tiros usando los 3 palos que elegirias naturalmente para este tiro. Observa cual da el resultado mas consistente — ese es tu palo de referencia.",label:"A menos de 1.2 m"},
  s7:{name:"Salida de Bunker",purpose:"Tecnica de arena",desc:"Desde un bunker junto al green, saca 10 bolas al green. Registra cuantas terminan a menos de 3 m de la bandera.",label:"Bolas en el green"},
  s8:{name:"Precision de Pitch",purpose:"Control de distancia con wedge",desc:"Desde 27 m, golpea 10 pitches. Aterriza a menos de 3 m y detente a menos de 4.5 m en total.",label:"A menos de 4.5 m"},
  s9:{name:"Pendientes Arriba / Abajo",purpose:"Adaptacion a la pendiente",desc:"Encuentra una posicion cuesta arriba y cuesta abajo cerca del green. Haz 5 chips de cada una, enfocandote en contacto solido y control de distancia a pesar de la pendiente.",label:"Up and downs"},
  s10:{name:"Flop Shot",purpose:"Dominio de trayectoria alta",desc:"Sobre un obstaculo desde 14 m, golpea 10 tiros altos y suaves. Debe aterrizar en el green y detenerse a menos de 2.5 m.",label:"Flops exitosos"},
  s11:{name:"Circuito de Juego Corto",purpose:"Consistencia completa del juego corto",desc:"5 estaciones alrededor del green a distancias variadas: chip, pitch, flop alto, bunker, posicion incomoda. 5 bolas cada una. Registra up and downs en cada una.",label:"Up and downs"},
  s12:{name:"18 Up and Downs",purpose:"Resistencia en scrambling",desc:"Simula 18 situaciones de juego corto: 6 desde rough, 6 desde arena, 6 desde posiciones dificiles, todas a menos de 20 m del green.",label:"Up and downs"},
  s13:{name:"Una Bola, Sin Repeticion",purpose:"Compromiso sin swing de practica",desc:"Camina a 10 puntos aleatorios a menos de 20 m del green. Golpea un tiro desde cada uno sin swing de practica ni repeticion, exactamente como en el campo. Registra up and downs.",label:"Up and downs"},
  l1:{name:"Ejercicio de Alineacion",purpose:"Postura y alineacion",desc:"Usa varillas de alineacion. Golpea 20 tiros de hierro medio enfocandote solo en contacto solido y centrado. Sin objetivo — solo siente el golpe.",label:"Contactos solidos"},
  l2:{name:"Swings en Camara Lenta",purpose:"Plano de swing y secuencia",desc:"15 bolas al 50% de velocidad con un hierro medio. Mantén el palo en el plano y termina en equilibrio. Califica cada swing del 1 al 3.",label:"Finales equilibrados"},
  l3:{name:"Pies Juntos",purpose:"Equilibrio y ritmo",desc:"15 bolas con los pies juntos usando cualquier hierro. Fuerza la transferencia de peso correcta y un ritmo natural.",label:"Contactos limpios"},
  l4:{name:"Control del Punto Bajo",purpose:"Contacto bola-luego-cesped",desc:"Dibuja una linea en el pasto o usa una linea de spray. Golpea 15 tiros de hierro medio intentando tomar el divot justo delante de la linea cada vez.",label:"Punto bajo correcto"},
  l5:{name:"Precision con Driver",purpose:"Precision con el driver",desc:"10 tiros de salida con tu driver hacia un corredor de calle definido. Registra aciertos y de que lado fallas.",label:"Calles acertadas"},
  l6:{name:"Precision de Hierro a 130m",purpose:"Dispersion de hierros a media distancia",desc:"Elige un objetivo a 130 m. Usa el palo que normalmente usarias a esa distancia. 15 tiros, registra cuantos terminan a menos de 18 m del objetivo.",label:"En el objetivo"},
  l7:{name:"Matriz de 9 Tiros",purpose:"Control de la forma del tiro",desc:"Golpea 9 tiros con un palo: alto, medio, bajo combinados con draw, recto, fade. 1 punto por forma intencional lograda.",label:"Formas logradas"},
  l8:{name:"Escalera de Distancia de Wedge",purpose:"Calibracion de swing parcial",desc:"5 bolas cada una al 50, 75 y 100% de velocidad de swing con tu wedge mas corto. Anota cuanto llega cada nivel de esfuerzo — esto se convierte en tu tabla personal de distancias.",label:"A menos de 5 m de lo previsto"},
  l9:{name:"Repetibilidad del Tiro Base",purpose:"Consistencia sin presion",desc:"Elige un palo y un objetivo. Golpea 15 tiros intentando repetir exactamente el mismo tiro cada vez. Registra cuantos terminan en un circulo de 10 m.",label:"A menos de 10 m"},
  l10:{name:"Simulacion de Par 3",purpose:"Juego de hierros bajo presion",desc:"Simula 9 hoyos par 3 a distancias variadas de 90 a 165 m. Elige objetivos y palos realistas. Registra greens en regulacion.",label:"Greens logrados"},
  l11:{name:"Desafio de Bolsa Completa",purpose:"Consistencia de toda la bolsa",desc:"2 tiros con cada palo de tu bolsa, del mas largo al mas corto. Califica cada tiro: 0 malo, 1 regular, 2 excelente.",label:"Puntos"},
  l12:{name:"Driver Bajo Presion",purpose:"Rendimiento bajo estres",desc:"10 tiros de driver hacia el corredor mas estrecho que puedas definir. Simula tu tiro de salida mas exigente en casa.",label:"Calles acertadas"},
  l13:{name:"Tiros de Problemas",purpose:"Habilidades de recuperacion",desc:"Simula 10 situaciones problematicas: golpe bajo una rama, draw alrededor de un obstaculo, fade sobre problemas. Califica cada tiro de 0 (fallido) a 2 (ejecutado segun el plan).",label:"Puntos"},
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
  p2:{name:"Kurzputt-Vertrauen",purpose:"Routine und Vertrauen bei kurzen Putts",desc:"Platziere 10 Baelle im Kreis 30 cm vom Loch, lochle alle ein, dann gehe auf 60 cm.",label:"In Folge eingelocht"},
  p3:{name:"Gerader Putt",purpose:"Putt-Mechanik und Tempo",desc:"Finde den geradesten Putt auf dem Gruen. Spiele 15 Putts aus 1 m mit einem ruhigen Pendelschlag.",label:"Eingelocht"},
  p4:{name:"Lag zum Vorgruen",purpose:"Distanzkontrolle und Geschwindigkeit",desc:"Aus 9 m, stoppe 10 Baelle innerhalb 15 cm vom Vorgruen ohne es zu ueberrollen.",label:"In der Zone gestoppt"},
  p5:{name:"Einhand-Drill",purpose:"Gefuehl und verhindert Handgelenk-Flip",desc:"Putte 10 Baelle nur mit der fuehrenden Hand aus 1.2 m. Entwickelt Gefuehl und verhindert das Flippen beim Treffmoment.",label:"Eingelocht"},
  p6:{name:"Leiter zum Loch",purpose:"Grundlegendes Geschwindigkeitsgefuehl",desc:"Putte je einen Ball aus 2 m, 4 m, 6 m, 8 m, mit dem Ziel, hinter dem Loch aber innerhalb 1 m zu landen. Wiederhole die Leiter 3 Mal.",label:"In der Zone (von 12)"},
  p7:{name:"Uhren-Drill",purpose:"Konstanz aus allen Winkeln",desc:"4 Baelle aus 1 m rund um das Loch wie eine Uhr. Vervollstaendige den ganzen Kreis ohne Fehlschlag. Wiederhole 3 Runden.",label:"In Folge eingelocht"},
  p8:{name:"Distanzleiter",purpose:"Geschwindigkeitskalibrierung",desc:"Putte auf Ziele aus 3 m, 6 m, 9 m. Punkt wenn der Ball innerhalb einer Schlaegerlaenge stoppt. Je 5 Versuche.",label:"Erzielte Punkte"},
  p9:{name:"Druck aus 1.5m",purpose:"Leistung unter Druck",desc:"Lochle 5 in Folge aus 1.5 m ein. Jeder Fehlschlag setzt den Zaehler zurueck. Simuliert Wettkampfdruck.",label:"Versuche zum Abschluss"},
  p10:{name:"Break-Putt",purpose:"Break lesen",desc:"Finde einen Putt mit konstantem Break aus 2.5 m. Spiele 10 Putts und verfolge die Startlinie. Lochle 6+ ein, um zu bestehen.",label:"Eingelocht"},
  p11:{name:"Zwei-Stufen-Geschwindigkeit",purpose:"Geschwindigkeitskontrolle auf Haengen",desc:"Finde ein zweistufiges Gruen oder einen Hang. Putte 10 Baelle von der unteren Stufe zu einem Loch auf der oberen Stufe, konzentriere dich nur auf die richtige Geschwindigkeit.",label:"Innerhalb 1 m"},
  p12:{name:"100-Ball-Putting",purpose:"Ausdauer und Basiswert",desc:"100 Putts aus 1 bis 6 m, gerade und mit Break gemischt. Verfolge jeden Treffer.",label:"Eingelocht"},
  p13:{name:"Druck 18",purpose:"Turniersimulation",desc:"18 Drucksituationen: 6 aus 1.2 m, 6 aus 1.8 m, 6 aus 2.4 m. 2 Pkt fuer Treffer, 1 fuer Tap-in, 0 fuer 3-Putt.",label:"Punkte"},
  p14:{name:"3-6-9 Zirkel",purpose:"Punkten aus kurzer Distanz",desc:"Lochle 3 aus 1 m, 3 aus 2 m, 3 aus 3 m ohne Fehlschlag ein. Jeder Fehlschlag fuegt einen Strafputt hinzu.",label:"Putts gesamt"},
  p15:{name:"Lag-Putt-Marathon",purpose:"Distanzkontrolle bei langen Putts",desc:"15 Putts aus 12-15 m, alle zu unterschiedlichen Loechern. 2 Punkte fuer 2-Putt-Bereich (innerhalb 1 m), 0 sonst.",label:"Punkte"},
  s1:{name:"Up and Down",purpose:"Grundlegendes Chippen und Abschliessen",desc:"Aus 5 m neben dem Gruen, chippe und putte. 10 Versuche. Zaehle erfolgreiche Up and Downs.",label:"Up and Downs"},
  s2:{name:"Landezone",purpose:"Bewusstsein fuer den Landepunkt",desc:"Lege ein Handtuch 1 m auf das Gruen. Aus 9 m, spiele 15 Schlaege und versuche das Handtuch zu treffen. Waehle den Schlaeger, der einen niedrigen, kontrollierten Flug ergibt.",label:"Treffer auf Handtuch"},
  s3:{name:"Chip zum Tee",purpose:"Praezisions- und Naehekontrolle",desc:"Stecke ein Tee 2 m vom Gruenrand. Aus 7 m, spiele 10 Schlaege innerhalb 1 m vom Tee.",label:"Innerhalb 1 m"},
  s4:{name:"Chip-Leiter",purpose:"Distanzkontrolle bei Chips",desc:"Vom gleichen Punkt aus, chippe 3 Baelle zu einem nahen Ziel, 3 zu einem mittleren, 3 zu einem weiten, alle auf dem Gruen. Passe nur die Schwunglaenge an die Distanz an.",label:"Im Ziel (von 9)"},
  s5:{name:"Bump and Run",purpose:"Kontrolle des niedrigen Rollschlags",desc:"Aus 18 m, spiele einen Bump and Run zu einem bestimmten Loch mit einem niedrigen, rollenden Schlag. 10 Versuche, verfolge Genauigkeit auf 2 m.",label:"Innerhalb 2 m"},
  s6:{name:"Waehle Deinen Schlaeger",purpose:"Vertrauen bei der Schlaegerwahl",desc:"Aus 14 m, spiele 15 Schlaege mit den 3 Schlaegern, die du natuerlich fuer diesen Schlag waehlen wuerdest. Beobachte, welcher das konstanteste Ergebnis liefert — das ist dein Standardschlaeger.",label:"Innerhalb 1.2 m"},
  s7:{name:"Bunker-Ausstieg",purpose:"Sandtechnik",desc:"Aus einem Gruenbunker, bringe 10 Baelle aufs Gruen. Verfolge, wie viele innerhalb 3 m von der Flagge landen.",label:"Baelle auf dem Gruen"},
  s8:{name:"Pitch-Praezision",purpose:"Distanzkontrolle mit dem Wedge",desc:"Aus 27 m, spiele 10 Pitch-Schlaege. Lande innerhalb 3 m und stoppe innerhalb 4.5 m insgesamt.",label:"Innerhalb 4.5 m"},
  s9:{name:"Bergauf / Bergab Lagen",purpose:"Anpassung an Haenge",desc:"Finde eine Bergauf- und Bergab-Position nahe dem Gruen. Spiele 5 Chips von jeder, mit Fokus auf solidem Kontakt und Distanzkontrolle trotz des Hangs.",label:"Up and Downs"},
  s10:{name:"Flop Shot",purpose:"Beherrschung der hohen Flugbahn",desc:"Ueber ein Hindernis aus 14 m, spiele 10 hohe, weiche Schlaege. Muss aufs Gruen landen und innerhalb 2.5 m stoppen.",label:"Erfolgreiche Flops"},
  s11:{name:"Kurzes-Spiel-Zirkel",purpose:"Vollstaendige Konstanz im kurzen Spiel",desc:"5 Stationen rund um das Gruen mit unterschiedlichen Distanzen: Chip, Pitch, hoher Flop, Bunker, schwierige Lage. Je 5 Baelle. Verfolge Up and Downs an jeder Station.",label:"Up and Downs"},
  s12:{name:"18 Up and Downs",purpose:"Scrambling-Ausdauer",desc:"Simuliere 18 Kurzspiel-Situationen: 6 aus dem Rough, 6 aus dem Sand, 6 aus schwierigen Lagen, alle innerhalb 20 m vom Gruen.",label:"Up and Downs"},
  s13:{name:"Ein Ball, Keine Wiederholung",purpose:"Engagement ohne Probeschwung",desc:"Gehe zu 10 zufaelligen Punkten innerhalb 20 m vom Gruen. Spiele von jedem einen Schlag ohne Probeschwung oder Wiederholung, genau wie auf dem Platz. Verfolge Up and Downs.",label:"Up and Downs"},
  l1:{name:"Ausrichtungs-Drill",purpose:"Setup und Ausrichtung",desc:"Verwende Ausrichtungsstaebe. Spiele 20 Schlaege mit einem mittleren Eisen und fokussiere nur auf solidem, zentriertem Kontakt. Kein Ziel — spuere nur den Schlag.",label:"Solide Kontakte"},
  l2:{name:"Zeitlupen-Schwuenge",purpose:"Schwungebene und Sequenzierung",desc:"15 Baelle mit 50% Geschwindigkeit mit einem mittleren Eisen. Halte den Schlaeger auf der Ebene und beende im Gleichgewicht. Bewerte jeden Schwung 1 bis 3.",label:"Ausgeglichene Finishs"},
  l3:{name:"Fuesse Zusammen",purpose:"Balance und Rhythmus",desc:"15 Baelle mit zusammengestellten Fuessen mit einem beliebigen Eisen. Zwingt zur korrekten Gewichtsverlagerung und natuerlichem Rhythmus.",label:"Saubere Kontakte"},
  l4:{name:"Tiefpunkt-Kontrolle",purpose:"Ball-dann-Rasen-Kontakt",desc:"Zeichne eine Linie ins Gras oder verwende eine Spruehlinie. Spiele 15 Schlaege mit mittlerem Eisen und versuche, jedes Mal das Divot direkt vor der Linie zu nehmen.",label:"Korrekter Tiefpunkt"},
  l5:{name:"Driver-Genauigkeit",purpose:"Genauigkeit mit dem Driver",desc:"10 Abschlaege mit deinem Driver in einen definierten Fairway-Korridor. Verfolge Treffer und auf welcher Seite du verfehlst.",label:"Fairways getroffen"},
  l6:{name:"Eisen-Genauigkeit auf 130m",purpose:"Streuung von Eisen auf mittlere Distanz",desc:"Waehle ein Ziel 130 m entfernt. Verwende den Schlaeger, den du normalerweise auf diese Distanz spielst. 15 Schlaege, verfolge, wie viele innerhalb 18 m vom Ziel landen.",label:"Auf dem Ziel"},
  l7:{name:"9-Schlag-Matrix",purpose:"Kontrolle der Schlagform",desc:"Spiele 9 Schlaege mit einem Schlaeger: hoch, mittel, niedrig kombiniert mit Draw, gerade, Fade. 1 Punkt pro erfolgreich erzielter Form.",label:"Erzielte Formen"},
  l8:{name:"Wedge-Distanzleiter",purpose:"Kalibrierung des Teilschwungs",desc:"5 Baelle je bei 50, 75 und 100% Schwunggeschwindigkeit mit deinem kuerzesten Wedge. Notiere, wie weit jede Anstrengungsstufe traegt — das wird deine persoenliche Distanztabelle.",label:"Innerhalb 5 m vom Ziel"},
  l9:{name:"Wiederholbarkeit des Standardschlags",purpose:"Konstanz ohne Druck",desc:"Waehle einen Schlaeger und ein Ziel. Spiele 15 Schlaege und versuche, jedes Mal genau den gleichen Schlag zu wiederholen. Verfolge, wie viele innerhalb eines 10-m-Kreises landen.",label:"Innerhalb 10 m"},
  l10:{name:"Par-3-Simulation",purpose:"Eisenspiel unter Druck",desc:"Simuliere 9 Par-3-Loecher mit unterschiedlichen Distanzen von 90 bis 165 m. Waehle realistische Ziele und Schlaeger. Verfolge getroffene Gruens.",label:"Gruens getroffen"},
  l11:{name:"Volle-Tasche-Herausforderung",purpose:"Konstanz der gesamten Tasche",desc:"2 Schlaege mit jedem Schlaeger in deiner Tasche, vom laengsten zum kuerzesten. Bewerte jeden Schlag: 0 schlecht, 1 okay, 2 grossartig.",label:"Punkte"},
  l12:{name:"Driver Unter Druck",purpose:"Leistung unter Stress",desc:"10 Drives in den engsten Korridor, den du definieren kannst. Simuliere deinen engsten Abschlag zu Hause.",label:"Fairways getroffen"},
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
  p2:{name:"Fiducia Putt Corti",purpose:"Routine e fiducia sui putt corti",desc:"Posiziona 10 palline in cerchio a 30 cm dalla buca, imbucale tutte, poi passa a 60 cm.",label:"Consecutivi imbucati"},
  p3:{name:"Putt Diritto",purpose:"Meccanica del putt e tempo",desc:"Trova il putt piu dritto sul green. Fai 15 putt da 1 m con un movimento a pendolo fluido.",label:"Imbucati"},
  p4:{name:"Lag verso il Bordo",purpose:"Controllo della distanza e velocita",desc:"Da 9 m, ferma 10 palline a meno di 15 cm dal bordo senza superarlo.",label:"Fermate nella zona"},
  p5:{name:"Esercizio a Una Mano",purpose:"Sensibilita e previene il flip del polso",desc:"Putta 10 palline solo con la mano guida da 1.2 m. Sviluppa sensibilita e previene il flip all'impatto.",label:"Imbucati"},
  p6:{name:"Scala verso la Buca",purpose:"Giudizio base della velocita",desc:"Putta una pallina da 2 m, 4 m, 6 m, 8 m, cercando di finire oltre la buca ma entro 1 m. Ripeti la scala 3 volte.",label:"In zona (su 12)"},
  p7:{name:"Esercizio dell'Orologio",purpose:"Costanza da tutte le angolazioni",desc:"4 palline a 1 m attorno alla buca come un orologio. Completa il cerchio intero senza errori. Ripeti 3 giri.",label:"Consecutivi imbucati"},
  p8:{name:"Scala di Distanza",purpose:"Calibrazione della velocita",desc:"Putta verso obiettivi a 3 m, 6 m, 9 m. Segna un punto se la palla si ferma entro una lunghezza di bastone. 5 tentativi ciascuno.",label:"Punti ottenuti"},
  p9:{name:"Pressione da 1.5m",purpose:"Prestazione sotto pressione",desc:"Imbuca 5 di fila da 1.5 m. Ogni errore azzera il conteggio. Simula la pressione della competizione.",label:"Tentativi per completare"},
  p10:{name:"Putt con Effetto",purpose:"Lettura dell'effetto",desc:"Trova un putt con effetto costante a 2.5 m. Fai 10 putt seguendo la linea di partenza. Imbucane 6+ per passare.",label:"Imbucati"},
  p11:{name:"Velocita a Due Livelli",purpose:"Controllo della velocita sui pendii",desc:"Trova un green a due livelli o un pendio. Putta 10 palline dal livello inferiore verso una buca sul livello superiore, concentrandoti solo sulla velocita corretta.",label:"Entro 1 m"},
  p12:{name:"100 Putt",purpose:"Resistenza e base di riferimento",desc:"100 putt da 1 a 6 m mescolando linee dritte ed effetto. Traccia ogni imbucata.",label:"Imbucati"},
  p13:{name:"Pressione 18",purpose:"Simulazione di torneo",desc:"18 situazioni di pressione: 6 da 1.2 m, 6 da 1.8 m, 6 da 2.4 m. 2 pt se imbuchi, 1 per tap-in, 0 per 3-putt.",label:"Punti"},
  p14:{name:"Circuito 3-6-9",purpose:"Segnare da distanza corta",desc:"Imbuca 3 putt da 1 m, 3 da 2 m, 3 da 3 m senza errori. Ogni errore aggiunge un putt di penalita.",label:"Putt totali"},
  p15:{name:"Maratona di Lag Putt",purpose:"Controllo della distanza sui putt lunghi",desc:"15 putt da 12-15 m, tutti verso buche diverse. Segna 2 punti per la zona 2-putt (entro 1 m), 0 altrimenti.",label:"Punti"},
  s1:{name:"Up and Down",purpose:"Chip base e finalizzazione",desc:"Da 5 m dal green, fai chip e putt. 10 tentativi. Conta gli up and down riusciti.",label:"Up and down"},
  s2:{name:"Zona di Atterraggio",purpose:"Consapevolezza del punto di atterraggio",desc:"Posiziona un asciugamano a 1 m sul green. Da 9 m, colpisci 15 tiri provando ad atterrare sull'asciugamano. Scegli il bastone che da un volo basso e controllato.",label:"Colpi sull'asciugamano"},
  s3:{name:"Chip verso un Tee",purpose:"Controllo di precisione e prossimita",desc:"Pianta un tee a 2 m dal bordo del green. Da 7 m, colpisci 10 tiri entro 1 m dal tee.",label:"Entro 1 m"},
  s4:{name:"Chip a Scala",purpose:"Controllo della distanza sui chip",desc:"Dallo stesso punto, fai chip di 3 palline verso un obiettivo vicino, 3 verso uno medio, 3 verso uno lontano, tutti sul green. Adatta solo la lunghezza dello swing alla distanza.",label:"Sul bersaglio (su 9)"},
  s5:{name:"Bump and Run",purpose:"Controllo del tiro basso e rullante",desc:"Da 18 m, fai un bump and run verso una buca specifica con un tiro basso e rullante. 10 tentativi, traccia la precisione a 2 m.",label:"Entro 2 m"},
  s6:{name:"Scegli il Tuo Bastone",purpose:"Fiducia nella scelta del bastone",desc:"Da 14 m, colpisci 15 tiri usando i 3 bastoni che scegli naturalmente per questo tiro. Nota quale da il risultato piu costante — quello e il tuo bastone di riferimento.",label:"Entro 1.2 m"},
  s7:{name:"Uscita dal Bunker",purpose:"Tecnica della sabbia",desc:"Da un bunker vicino al green, porta 10 palline sul green. Traccia quante finiscono entro 3 m dalla bandiera.",label:"Palline sul green"},
  s8:{name:"Precisione di Pitch",purpose:"Controllo della distanza con il wedge",desc:"Da 27 m, colpisci 10 pitch. Atterra entro 3 m e fermati entro 4.5 m totali.",label:"Entro 4.5 m"},
  s9:{name:"Pendii in Salita / Discesa",purpose:"Adattamento al pendio",desc:"Trova una posizione in salita e in discesa vicino al green. Fai 5 chip da ciascuna, concentrandoti su un contatto solido e sul controllo della distanza nonostante il pendio.",label:"Up and down"},
  s10:{name:"Flop Shot",purpose:"Padronanza della traiettoria alta",desc:"Sopra un ostacolo da 14 m, colpisci 10 tiri alti e morbidi. Deve atterrare sul green e fermarsi entro 2.5 m.",label:"Flop riusciti"},
  s11:{name:"Circuito di Gioco Corto",purpose:"Costanza completa del gioco corto",desc:"5 stazioni attorno al green a distanze variate: chip, pitch, flop alto, bunker, posizione scomoda. 5 palline ciascuna. Traccia gli up and down a ogni stazione.",label:"Up and down"},
  s12:{name:"18 Up and Down",purpose:"Resistenza nello scrambling",desc:"Simula 18 situazioni di gioco corto: 6 dal rough, 6 dalla sabbia, 6 da posizioni difficili, tutte entro 20 m dal green.",label:"Up and down"},
  s13:{name:"Una Palla, Senza Ripetizione",purpose:"Impegno senza swing di prova",desc:"Cammina verso 10 punti casuali entro 20 m dal green. Colpisci un tiro da ciascuno senza swing di prova o ripetizione, esattamente come in campo. Traccia gli up and down.",label:"Up and down"},
  l1:{name:"Esercizio di Allineamento",purpose:"Postura e allineamento",desc:"Usa bastoncini di allineamento. Colpisci 20 tiri di ferro medio concentrandoti solo su un contatto solido e centrato. Nessun obiettivo — senti solo il colpo.",label:"Contatti solidi"},
  l2:{name:"Swing al Rallentatore",purpose:"Piano dello swing e sequenza",desc:"15 palline al 50% della velocita con un ferro medio. Mantieni il bastone sul piano e finisci in equilibrio. Valuta ogni swing da 1 a 3.",label:"Finali equilibrati"},
  l3:{name:"Piedi Uniti",purpose:"Equilibrio e ritmo",desc:"15 palline con i piedi uniti usando un ferro qualsiasi. Forza il corretto trasferimento del peso e un ritmo naturale.",label:"Contatti puliti"},
  l4:{name:"Controllo del Punto Basso",purpose:"Contatto palla-poi-erba",desc:"Disegna una linea nell'erba o usa una linea spray. Colpisci 15 tiri di ferro medio provando a prendere la zolla appena davanti alla linea ogni volta.",label:"Punto basso corretto"},
  l5:{name:"Precisione del Driver",purpose:"Precisione con il driver",desc:"10 tiri dal tee con il tuo driver verso un corridoio di fairway definito. Traccia i colpi riusciti e da che lato sbagli.",label:"Fairway centrati"},
  l6:{name:"Precisione di Ferro a 130m",purpose:"Dispersione dei ferri a media distanza",desc:"Scegli un obiettivo a 130 m. Usa il bastone che colpiresti normalmente a quella distanza. 15 tiri, traccia quanti finiscono entro 18 m dall'obiettivo.",label:"Sul bersaglio"},
  l7:{name:"Matrice a 9 Tiri",purpose:"Controllo della traiettoria del tiro",desc:"Colpisci 9 tiri con un bastone: alto, medio, basso combinati con draw, dritto, fade. 1 punto per ogni traiettoria intenzionale riuscita.",label:"Traiettorie riuscite"},
  l8:{name:"Scala di Distanza del Wedge",purpose:"Calibrazione dello swing parziale",desc:"5 palline ciascuna al 50, 75 e 100% della velocita di swing con il tuo wedge piu corto. Annota quanto arriva ogni livello di sforzo — diventa la tua tabella personale delle distanze.",label:"Entro 5 m dall'obiettivo"},
  l9:{name:"Ripetibilita del Tiro Standard",purpose:"Costanza senza pressione",desc:"Scegli un bastone e un obiettivo. Colpisci 15 tiri provando a ripetere esattamente lo stesso tiro ogni volta. Traccia quanti finiscono in un cerchio di 10 m.",label:"Entro 10 m"},
  l10:{name:"Simulazione Par 3",purpose:"Gioco di ferri sotto pressione",desc:"Simula 9 buche par 3 a distanze variate da 90 a 165 m. Scegli obiettivi e bastoni realistici. Traccia i green centrati.",label:"Green centrati"},
  l11:{name:"Sfida del Sacco Completo",purpose:"Costanza di tutto il sacco",desc:"2 tiri con ogni bastone nel tuo sacco, dal piu lungo al piu corto. Valuta ogni tiro: 0 scarso, 1 ok, 2 ottimo.",label:"Punti"},
  l12:{name:"Driver Sotto Pressione",purpose:"Prestazione sotto stress",desc:"10 drive verso il corridoio piu stretto che riesci a definire. Simula il tuo tiro dal tee piu stretto a casa.",label:"Fairway centrati"},
  l13:{name:"Tiri di Difficolta",purpose:"Abilita di recupero",desc:"Simula 10 situazioni difficili: colpo sotto un ramo, draw attorno a un ostacolo, fade sopra un problema. Valuta ogni tiro da 0 (fallito) a 2 (eseguito come previsto).",label:"Punti"},
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
  p2:{name:"Confianca em Putts Curtos",purpose:"Rotina e confianca em putts curtos",desc:"Coloque 10 bolas em circulo a 30 cm do buraco, encaçape todas, depois mude para 60 cm.",label:"Consecutivos encaçapados"},
  p3:{name:"Putt Reto",purpose:"Mecanica do putt e tempo",desc:"Encontre o putt mais reto no green. Faca 15 putts de 1 m com um movimento de pendulo suave.",label:"Encaçapados"},
  p4:{name:"Lag para a Margem",purpose:"Controle de distancia e velocidade",desc:"De 9 m, pare 10 bolas a menos de 15 cm da margem sem passar.",label:"Paradas na zona"},
  p5:{name:"Exercicio com Uma Mao",purpose:"Sensibilidade e evita o flip do pulso",desc:"Pute 10 bolas apenas com a mao guia de 1.2 m. Desenvolve sensibilidade e evita o flip no impacto.",label:"Encaçapados"},
  p6:{name:"Escada para o Buraco",purpose:"Julgamento basico de velocidade",desc:"Pute uma bola de 2 m, 4 m, 6 m, 8 m, buscando terminar apos o buraco mas a menos de 1 m. Repita a escada 3 vezes.",label:"Na zona (de 12)"},
  p7:{name:"Exercicio do Relogio",purpose:"Consistencia de todos os angulos",desc:"4 bolas a 1 m em volta do buraco como um relogio. Complete o circulo inteiro sem errar. Repita 3 voltas.",label:"Consecutivos encaçapados"},
  p8:{name:"Escada de Distancia",purpose:"Calibragem de velocidade",desc:"Pute em direcao a alvos a 3 m, 6 m, 9 m. Marque um ponto se a bola parar a menos de um comprimento de taco. 5 tentativas cada.",label:"Pontos obtidos"},
  p9:{name:"Pressao de 1.5m",purpose:"Desempenho sob pressao",desc:"Encaçape 5 seguidos de 1.5 m. Cada erro reinicia a contagem. Simula a pressao de competicao.",label:"Tentativas para completar"},
  p10:{name:"Putt com Curva",purpose:"Leitura da curva",desc:"Encontre um putt com curva consistente a 2.5 m. Faca 10 putts seguindo a linha de saida. Encaçape 6+ para passar.",label:"Encaçapados"},
  p11:{name:"Velocidade em Dois Niveis",purpose:"Controle de velocidade em inclinacoes",desc:"Encontre um green de dois niveis ou uma inclinacao. Pute 10 bolas do nivel inferior para um buraco no nivel superior, focando apenas na velocidade correta.",label:"A menos de 1 m"},
  p12:{name:"100 Putts",purpose:"Resistencia e linha de base",desc:"100 putts de 1 a 6 m misturando linhas retas e com curva. Registre cada acerto.",label:"Encaçapados"},
  p13:{name:"Pressao 18",purpose:"Simulacao de torneio",desc:"18 situacoes de pressao: 6 de 1.2 m, 6 de 1.8 m, 6 de 2.4 m. 2 pts se encaçapar, 1 para tap-in, 0 para 3-putt.",label:"Pontos"},
  p14:{name:"Circuito 3-6-9",purpose:"Pontuar de curta distancia",desc:"Encaçape 3 putts de 1 m, 3 de 2 m, 3 de 3 m sem errar. Cada erro adiciona um putt de penalidade.",label:"Total de putts"},
  p15:{name:"Maratona de Lag Putt",purpose:"Controle de distancia em putts longos",desc:"15 putts de 12-15 m, todos para buracos diferentes. Marque 2 pontos pela zona de 2-putt (a menos de 1 m), 0 caso contrario.",label:"Pontos"},
  s1:{name:"Up and Down",purpose:"Chip basico e finalizacao",desc:"De 5 m do green, faca chip e putt. 10 tentativas. Conte os up and downs bem-sucedidos.",label:"Up and downs"},
  s2:{name:"Zona de Aterrissagem",purpose:"Consciencia do ponto de aterrissagem",desc:"Coloque uma toalha a 1 m no green. De 9 m, bata 15 tacadas tentando aterrissar na toalha. Escolha o taco que da um voo baixo e controlado.",label:"Acertos na toalha"},
  s3:{name:"Chip para um Tee",purpose:"Controle de proximidade e precisao",desc:"Coloque um tee a 2 m da borda do green. De 7 m, bata 10 tacadas a menos de 1 m do tee.",label:"A menos de 1 m"},
  s4:{name:"Chips em Escada",purpose:"Controle de distancia em chips",desc:"Do mesmo lugar, faca chip de 3 bolas para um alvo proximo, 3 para um medio, 3 para um distante, todos no green. Ajuste apenas o comprimento do seu swing a distancia.",label:"No alvo (de 9)"},
  s5:{name:"Bump and Run",purpose:"Controle da tacada baixa e rolada",desc:"De 18 m, faca um bump and run para um buraco especifico com uma tacada baixa e rolada. 10 tentativas, registre precisao a 2 m.",label:"A menos de 2 m"},
  s6:{name:"Escolha Seu Taco",purpose:"Confianca na escolha do taco",desc:"De 14 m, bata 15 tacadas usando os 3 tacos que voce escolheria naturalmente para esta tacada. Observe qual da o resultado mais consistente — esse e seu taco padrao.",label:"A menos de 1.2 m"},
  s7:{name:"Saida do Bunker",purpose:"Tecnica de areia",desc:"De um bunker perto do green, tire 10 bolas para o green. Registre quantas terminam a menos de 3 m da bandeira.",label:"Bolas no green"},
  s8:{name:"Precisao de Pitch",purpose:"Controle de distancia com wedge",desc:"De 27 m, bata 10 pitches. Aterrisse a menos de 3 m e pare a menos de 4.5 m no total.",label:"A menos de 4.5 m"},
  s9:{name:"Inclinacoes Subida / Descida",purpose:"Adaptacao a inclinacao",desc:"Encontre uma posicao em subida e descida perto do green. Faca 5 chips de cada, focando em contato solido e controle de distancia apesar da inclinacao.",label:"Up and downs"},
  s10:{name:"Flop Shot",purpose:"Dominio da trajetoria alta",desc:"Sobre um obstaculo de 14 m, bata 10 tacadas altas e suaves. Deve aterrissar no green e parar a menos de 2.5 m.",label:"Flops bem-sucedidos"},
  s11:{name:"Circuito de Jogo Curto",purpose:"Consistencia completa do jogo curto",desc:"5 estacoes em torno do green a distancias variadas: chip, pitch, flop alto, bunker, posicao dificil. 5 bolas cada. Registre up and downs em cada estacao.",label:"Up and downs"},
  s12:{name:"18 Up and Downs",purpose:"Resistencia no scrambling",desc:"Simule 18 situacoes de jogo curto: 6 do rough, 6 da areia, 6 de posicoes dificeis, todas a menos de 20 m do green.",label:"Up and downs"},
  s13:{name:"Uma Bola, Sem Repeticao",purpose:"Compromisso sem swing de pratica",desc:"Caminhe para 10 pontos aleatorios a menos de 20 m do green. Bata uma tacada de cada sem swing de pratica ou repeticao, exatamente como no campo. Registre up and downs.",label:"Up and downs"},
  l1:{name:"Exercicio de Alinhamento",purpose:"Postura e alinhamento",desc:"Use bastoes de alinhamento. Bata 20 tacadas de ferro medio focando apenas em contato solido e centralizado. Sem alvo — apenas sinta a tacada.",label:"Contatos solidos"},
  l2:{name:"Swings em Camera Lenta",purpose:"Plano de swing e sequenciamento",desc:"15 bolas a 50% de velocidade com um ferro medio. Mantenha o taco no plano e termine em equilibrio. Avalie cada swing de 1 a 3.",label:"Finalizacoes equilibradas"},
  l3:{name:"Pes Juntos",purpose:"Equilibrio e ritmo",desc:"15 bolas com os pes juntos usando qualquer ferro. Forca a transferencia de peso correta e ritmo natural.",label:"Contatos limpos"},
  l4:{name:"Controle do Ponto Baixo",purpose:"Contato bola-depois-grama",desc:"Desenhe uma linha na grama ou use uma linha de spray. Bata 15 tacadas de ferro medio tentando pegar a marca de divot bem na frente da linha sempre.",label:"Ponto baixo correto"},
  l5:{name:"Precisao do Driver",purpose:"Precisao com o driver",desc:"10 tacadas de saida com seu driver para um corredor de fairway definido. Registre acertos e de que lado voce erra.",label:"Fairways acertados"},
  l6:{name:"Precisao de Ferro a 130m",purpose:"Dispersao de ferros em media distancia",desc:"Escolha um alvo a 130 m. Use o taco que voce normalmente bateria nessa distancia. 15 tacadas, registre quantas terminam a menos de 18 m do alvo.",label:"No alvo"},
  l7:{name:"Matriz de 9 Tacadas",purpose:"Controle da trajetoria da tacada",desc:"Bata 9 tacadas com um taco: alto, medio, baixo combinados com draw, reto, fade. 1 ponto por trajetoria intencional bem-sucedida.",label:"Trajetorias alcancadas"},
  l8:{name:"Escada de Distancia do Wedge",purpose:"Calibragem do swing parcial",desc:"5 bolas cada a 50, 75 e 100% da velocidade do swing com seu wedge mais curto. Anote o quanto cada nivel de esforco alcanca — isso se torna sua tabela pessoal de distancias.",label:"A menos de 5 m do pretendido"},
  l9:{name:"Repetibilidade da Tacada Padrao",purpose:"Consistencia sem pressao",desc:"Escolha um taco e um alvo. Bata 15 tacadas tentando repetir exatamente a mesma tacada sempre. Registre quantas terminam em um circulo de 10 m.",label:"A menos de 10 m"},
  l10:{name:"Simulacao Par 3",purpose:"Jogo de ferros sob pressao",desc:"Simule 9 buracos par 3 a distancias variadas de 90 a 165 m. Escolha alvos e tacos realistas. Registre greens alcancados.",label:"Greens alcancados"},
  l11:{name:"Desafio do Saco Completo",purpose:"Consistencia de todo o saco",desc:"2 tacadas com cada taco do seu saco, do mais longo ao mais curto. Avalie cada tacada: 0 ruim, 1 ok, 2 otimo.",label:"Pontos"},
  l12:{name:"Driver Sob Pressao",purpose:"Desempenho sob estresse",desc:"10 tacadas de driver para o corredor mais estreito que voce conseguir definir. Simule sua tacada de saida mais apertada em casa.",label:"Fairways acertados"},
  l13:{name:"Tacadas de Problema",purpose:"Habilidades de recuperacao",desc:"Simule 10 situacoes de problema: tacada sob um galho, draw em torno de um obstaculo, fade sobre um problema. Avalie cada tacada de 0 (falhou) a 2 (executada como planejado).",label:"Pontos"},
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

const FOCUS_AREAS = [
  {id:"putting", label:"Putting", emoji:"🟢", desc:"Green mastery"},
  {id:"shortGame", label:"Short Game", emoji:"⛳", desc:"Inside 50 metres"},
  {id:"longGame", label:"Long Game", emoji:"🏌️", desc:"Tee to green"},
  {id:"mental", label:"Mental Game", emoji:"🧠", desc:"Routine and pressure"},
];

const DURATIONS = [10,15,20,30,40,60]; // capped at 60 min — sessions longer than 1 hour aren't offered
const FEELING_KEYS = ["focused","relaxed","neutral","tired","pumped","anxious"];
const LANG_CODES = ["en","fr","es","de","it","pt"];
const LANG_NAMES = {en:"English",fr:"Francais",es:"Espanol",de:"Deutsch",it:"Italiano",pt:"Portugues"};
const FREQ_KEYS = ["everyday","f45","f23","weekly","monthly","occasional"];
const SCORES = ["under70","70_74","75_79","80_84","85_89","90_94","95_99","100plus"];
const GOAL_KEYS = ["lowerHcp","break90","break80","break70","shortGame","management","enjoy","compete"];
const WEAK_KEYS = ["driver","irons","wedges","putting","bunker","mental","shortGame2","strategy"];

const DEF_SETTINGS = {language:"en", units:"imperial", holes:18};

// ── TRANSLATIONS — all 6 languages fully written, no silent fallback ────────
const TR = {
  en: {
    appTagline:"Train smarter. Score lower.", createAccount:"Create Account", signIn:"Sign In",
    welcomeBack:"Welcome back", signInSub:"Sign in to keep training", email:"Email", password:"Password",
    noAccount:"No account? Create one", notYou:"Not you? Use a different account", createAcct:"Create account", step1:"Step 1 of 2", step2:"Step 2 of 2",
    finisherGames:"Finisher Games", players:"Players", addPlayer:"Add Player", localMultiplayerNote:"Local multiplayer: pass the phone between players each station.",
    startFinisher:"Start Finisher", station:"Station", scoreForStation:"Score for this station", prevStation:"Previous", nextStation:"Next Station", finishGame:"Finish Game",
    handPhoneTo:"Hand the phone to", nextPlayer:"Next Player", byStation:"By Station", yourEvolution:"Your Evolution", runningTotal:"Running Total", today:"Today", bestPrevious:"Best Previous",
    exportImage:"Export as Image", exporting:"Exporting", exported:"Saved", exportFailed:"Couldn't export — try a screenshot instead", tapToExpand:"Tap to expand",
    copied:"Copied to clipboard", shareResult:"Share Result", howWhy:"How & Why",
    noSessionsYetTap:"No sessions yet — tap to see what's here", noSessionsYet:"No sessions yet", noSessionsYetDesc:"Train this area to start building your progress history here.",
    avgScore:"Avg Score", worst:"Lowest", evolution:"Evolution", sinceStart:"since start", needMoreSessions:"Complete one more session to see your trend.",
    exercisesPracticed:"Exercises Practiced", allSessions:"All Sessions", upMeansImproving:"Line trending up = improving (lower scores)",
    createSub:"Your personal training starts here", fullName:"Full Name", choosePass:"Choose a password",
    continue:"Continue", haveAccount:"Already have an account? Sign in", golfProfile:"Golf profile",
    golfProfileSub:"Personalizes your training plan", handicapIndex:"Handicap Index", handicapHelp:"Use + for plus handicaps (e.g. +2.4)",
    selectHcp:"Select handicap", playFreq:"How often do you play?", selectFreq:"Select frequency", measurement:"Measurement",
    yardsFeet:"Yards / Feet", metres:"Metres", language:"Language", startTraining:"Start Training",
    fillAll:"Please fill all fields.", wrongLogin:"Wrong email or password.", emailTaken:"Email already registered.",
    back:"Back",
    train:"Train", scorecard:"Scorecard", stats:"Stats", history:"History", player:"Player",
    chooseFocus:"Choose your focus area", start:"Start", sessions:"sessions",
    howLong:"How long do you have?", min:"min", hour:"hour", chooseExercise:"Choose Exercise", drillsAvail:"drills available",
    last:"Last", purpose:"Purpose", yourHistory:"Your History", first:"First", best:"Best",
    outOf:"out of", saveResult:"Save Result", excellent:"Excellent!", goodWork:"Good Work", keepGoing:"Keep Going",
    yourScore:"Your Score", vsLast:"vs last session", whyMatters:"Why this matters", newSession:"New Session",
    trackRound:"Track your round, hole by hole", holes:"holes", startRound:"Start Round",
    golfCourse:"Golf Course", coursePh:"e.g. Pebble Beach...", feelToday:"How do you feel today?",
    notesOptional:"Notes (optional)", notesPh:"Windy back nine, putts were rolling true...",
    cancel:"Cancel", saveRound:"Save Round", hole:"Hole", par:"Par", score:"Score", putts:"Putts", miss:"Miss",
    roundSaved:"Round Saved!", roundSavedSub:"Nice work out there", viewSummary:"View Summary", done:"Done",
    gameGlance:"Your game at a glance", onCourse:"On-Course", avgPutts:"Avg Putts", perHole:"per hole",
    girPct:"GIR %", greens:"greens", firPct:"FIR %", fairways:"fairways", topMiss:"Top Miss", common:"common",
    scoreVsPar:"Score vs Par", lastRounds:"Last", rounds:"rounds", trainingProgress:"Training Progress",
    hdcpVsActual:"Handicap vs Actual", declaredHdcp:"Your Handicap", actualAvg:"Actual Avg (vs par)",
    playingAbove:"Playing above your handicap", playingBelow:"Playing below your handicap", playingOnTarget:"Right on target",
    playingAboveDesc:"Your recent rounds average {n} strokes higher than your handicap suggests. Worth digging into Stats by area to see where strokes are slipping away.",
    playingBelowDesc:"Your recent rounds average {n} strokes better than your handicap suggests — nice work, your index may be due for an update.",
    playingOnTargetDesc:"Your actual scoring closely matches your declared handicap. Solid consistency.",
    hdcpDisclaimer:"Simplified estimate — does not account for course rating or slope.",
    myPlan:"My Plan", planSub:"Sessions queued up for next time", planEmpty:"No sessions planned yet. Build a queue of drills to work through next time you train.",
    addSession:"Add Session", addToPlan:"Add to your plan", startNext:"Start Next", nextInPlan:"Next in your plan",
    focusRec:"Focus Recommendation", focus:"Focus", strong:"Strong", noStatsYet:"Complete a session or round to see your stats.",
    getStarted:"Get started", getStartedSub:"Train a skill or log a round to begin tracking your progress.",
    startTrainingCta:"Start Training", logRoundCta:"Log a Round", unlockStatsHint:"Track FIR, GIR, putts and miss direction for every hole to unlock detailed stats.",
    sessionsCount:"session", sessionsCount2:"sessions", clearAll:"Clear all", noHistory:"Your sessions will appear here.",
    confirmClear:"Clear all history?", deleteThis:"Delete this entry?", delete:"Delete",
    roundSummary:"Round Summary", tapToView:"Tap to view",
    profile:"Profile", settings:"Settings", personalInfo:"Personal Info", yourName:"Your name",
    homeClub:"Home Club", homeClubPh:"e.g. Pebble Beach", location:"Location", locationPh:"City, Country",
    typicalScore:"Typical Score", dominantHand:"Dominant Hand", right:"Right", left:"Left", select:"Select...",
    mainGoal:"Main Goal", weaknesses:"Weaknesses", saveProfile:"Save Profile", profileSaved:"Profile Saved",
    signOut:"Sign Out", defaultHoles:"Default Holes", settingsAuto:"Settings save automatically",
    streakDay:"day streak", streakDays:"day streak", keepItUp:"Keep it up!",
    feel_focused:"Focused", feel_relaxed:"Relaxed", feel_neutral:"Neutral", feel_tired:"Tired", feel_pumped:"Pumped", feel_anxious:"Anxious",
    freq_everyday:"Every day", freq_f45:"4-5x/week", freq_f23:"2-3x/week", freq_weekly:"Once a week", freq_monthly:"Monthly", freq_occasional:"Occasionally",
    score_under70:"Under 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Lower handicap", goal_break90:"Break 90", goal_break80:"Break 80", goal_break70:"Break 70", goal_shortGame:"Better short game", goal_management:"Course management", goal_enjoy:"Enjoy the game", goal_compete:"Compete",
    weak_driver:"Driver", weak_irons:"Irons", weak_wedges:"Wedges", weak_putting:"Putting", weak_bunker:"Bunker", weak_mental:"Mental", weak_shortGame2:"Short game", weak_strategy:"Strategy",
    diff_Beginner:"Beginner", diff_Intermediate:"Intermediate", diff_Advanced:"Advanced",
    left_dir:"Left", right_dir:"Right", short_dir:"Short", long_dir:"Long",
  },
  fr: {
    appTagline:"Entrainez-vous mieux. Jouez moins.", createAccount:"Creer un compte", signIn:"Se connecter",
    welcomeBack:"Bon retour", signInSub:"Connectez-vous pour continuer", email:"Email", password:"Mot de passe",
    noAccount:"Pas de compte ? En creer un", notYou:"Pas vous ? Utiliser un autre compte", createAcct:"Creer un compte", step1:"Etape 1 sur 2", step2:"Etape 2 sur 2",
    finisherGames:"Jeux Finisher", players:"Joueurs", addPlayer:"Ajouter un joueur", localMultiplayerNote:"Multijoueur local : passez le telephone entre joueurs a chaque station.",
    startFinisher:"Demarrer", station:"Station", scoreForStation:"Score pour cette station", prevStation:"Precedent", nextStation:"Station suivante", finishGame:"Terminer",
    handPhoneTo:"Passez le telephone a", nextPlayer:"Joueur suivant", byStation:"Par station", yourEvolution:"Votre evolution", runningTotal:"Total cumule", today:"Aujourd'hui", bestPrevious:"Meilleur precedent",
    exportImage:"Exporter en image", exporting:"Export en cours", exported:"Enregistre", exportFailed:"Echec de l'export — essayez une capture d'ecran", tapToExpand:"Touchez pour agrandir",
    copied:"Copie dans le presse-papiers", shareResult:"Partager le resultat", howWhy:"Comment et pourquoi",
    noSessionsYetTap:"Aucune session encore — touchez pour voir", noSessionsYet:"Aucune session encore", noSessionsYetDesc:"Entrainez ce domaine pour commencer a suivre vos progres ici.",
    avgScore:"Score moyen", worst:"Plus bas", evolution:"Evolution", sinceStart:"depuis le debut", needMoreSessions:"Completez une session de plus pour voir votre tendance.",
    exercisesPracticed:"Exercices pratiques", allSessions:"Toutes les sessions", upMeansImproving:"Courbe vers le haut = progres (scores plus bas)",
    createSub:"Votre entrainement personnel commence ici", fullName:"Nom complet", choosePass:"Choisissez un mot de passe",
    continue:"Continuer", haveAccount:"Deja un compte ? Se connecter", golfProfile:"Profil golf",
    golfProfileSub:"Personnalise votre plan d'entrainement", handicapIndex:"Index de handicap", handicapHelp:"Utilisez + pour un handicap positif (ex: +2.4)",
    selectHcp:"Choisir handicap", playFreq:"A quelle frequence jouez-vous ?", selectFreq:"Choisir frequence", measurement:"Unites",
    yardsFeet:"Yards / Pieds", metres:"Metres", language:"Langue", startTraining:"Commencer",
    fillAll:"Merci de remplir tous les champs.", wrongLogin:"Email ou mot de passe incorrect.", emailTaken:"Cet email est deja utilise.",
    back:"Retour",
    train:"Entrainement", scorecard:"Carte de score", stats:"Statistiques", history:"Historique", player:"Joueur",
    chooseFocus:"Choisissez votre domaine", start:"Demarrer", sessions:"sessions",
    howLong:"Combien de temps avez-vous ?", min:"min", hour:"heure", chooseExercise:"Choisir un exercice", drillsAvail:"exercices disponibles",
    last:"Dernier", purpose:"Objectif", yourHistory:"Votre historique", first:"Premier", best:"Meilleur",
    outOf:"sur", saveResult:"Enregistrer", excellent:"Excellent !", goodWork:"Bon travail", keepGoing:"Continuez",
    yourScore:"Votre score", vsLast:"vs derniere session", whyMatters:"Pourquoi c'est important", newSession:"Nouvelle session",
    trackRound:"Suivez votre partie, trou par trou", holes:"trous", startRound:"Demarrer la partie",
    golfCourse:"Terrain de golf", coursePh:"ex: Pebble Beach...", feelToday:"Comment vous sentez-vous ?",
    notesOptional:"Notes (optionnel)", notesPh:"Vent sur les 9 derniers trous, bons putts...",
    cancel:"Annuler", saveRound:"Enregistrer", hole:"Trou", par:"Par", score:"Score", putts:"Putts", miss:"Erreur",
    roundSaved:"Partie enregistree !", roundSavedSub:"Beau parcours", viewSummary:"Voir le resume", done:"Termine",
    gameGlance:"Votre jeu en un coup d'oeil", onCourse:"Sur le terrain", avgPutts:"Putts moy.", perHole:"par trou",
    girPct:"GIR %", greens:"greens", firPct:"FIR %", fairways:"fairways", topMiss:"Erreur principale", common:"frequente",
    scoreVsPar:"Score vs Par", lastRounds:"Dernieres", rounds:"parties", trainingProgress:"Progression",
    hdcpVsActual:"Handicap vs Reel", declaredHdcp:"Votre handicap", actualAvg:"Moyenne reelle (vs par)",
    playingAbove:"Vous jouez au-dessus de votre handicap", playingBelow:"Vous jouez en-dessous de votre handicap", playingOnTarget:"Tout a fait dans la cible",
    playingAboveDesc:"Vos dernieres parties sont en moyenne {n} coups plus elevees que ce que suggere votre handicap. Regardez vos statistiques par domaine pour voir ou les coups s'echappent.",
    playingBelowDesc:"Vos dernieres parties sont en moyenne {n} coups meilleures que ce que suggere votre handicap — beau travail, votre index merite peut-etre une mise a jour.",
    playingOnTargetDesc:"Votre score reel correspond bien a votre handicap declare. Belle constance.",
    hdcpDisclaimer:"Estimation simplifiee — ne tient pas compte du rating ou du slope du parcours.",
    myPlan:"Mon Plan", planSub:"Sessions prevues pour la prochaine fois", planEmpty:"Aucune session planifiee. Preparez une liste d'exercices a faire la prochaine fois.",
    addSession:"Ajouter une session", addToPlan:"Ajouter a votre plan", startNext:"Demarrer", nextInPlan:"Prochaine dans votre plan",
    focusRec:"Recommandation", focus:"A travailler", strong:"Solide", noStatsYet:"Completez une session pour voir vos statistiques.",
    getStarted:"Commencer", getStartedSub:"Entrainez une competence ou enregistrez une partie pour suivre vos progres.",
    startTrainingCta:"Commencer l'entrainement", logRoundCta:"Enregistrer une partie", unlockStatsHint:"Suivez FIR, GIR, putts et direction des erreurs sur chaque trou pour debloquer des statistiques detaillees.",
    sessionsCount:"session", sessionsCount2:"sessions", clearAll:"Tout effacer", noHistory:"Vos sessions apparaitront ici.",
    confirmClear:"Effacer tout l'historique ?", deleteThis:"Supprimer cette entree ?", delete:"Supprimer",
    roundSummary:"Resume de la partie", tapToView:"Toucher pour voir",
    profile:"Profil", settings:"Parametres", personalInfo:"Informations", yourName:"Votre nom",
    homeClub:"Club", homeClubPh:"ex: Pebble Beach", location:"Lieu", locationPh:"Ville, Pays",
    typicalScore:"Score habituel", dominantHand:"Main dominante", right:"Droite", left:"Gauche", select:"Choisir...",
    mainGoal:"Objectif principal", weaknesses:"Points faibles", saveProfile:"Enregistrer le profil", profileSaved:"Profil enregistre",
    signOut:"Se deconnecter", defaultHoles:"Trous par defaut", settingsAuto:"Sauvegarde automatique",
    streakDay:"jour de suite", streakDays:"jours de suite", keepItUp:"Continuez ainsi !",
    feel_focused:"Concentre", feel_relaxed:"Detendu", feel_neutral:"Neutre", feel_tired:"Fatigue", feel_pumped:"Motive", feel_anxious:"Anxieux",
    freq_everyday:"Tous les jours", freq_f45:"4-5x/semaine", freq_f23:"2-3x/semaine", freq_weekly:"Une fois/semaine", freq_monthly:"Mensuel", freq_occasional:"Occasionnel",
    score_under70:"Moins de 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Baisser mon handicap", goal_break90:"Passer sous 90", goal_break80:"Passer sous 80", goal_break70:"Passer sous 70", goal_shortGame:"Ameliorer le petit jeu", goal_management:"Gestion de parcours", goal_enjoy:"Profiter du jeu", goal_compete:"Competition",
    weak_driver:"Driver", weak_irons:"Fers", weak_wedges:"Wedges", weak_putting:"Putting", weak_bunker:"Bunker", weak_mental:"Mental", weak_shortGame2:"Petit jeu", weak_strategy:"Strategie",
    diff_Beginner:"Debutant", diff_Intermediate:"Intermediaire", diff_Advanced:"Avance",
    left_dir:"Gauche", right_dir:"Droite", short_dir:"Court", long_dir:"Long",
  },
  es: {
    appTagline:"Entrena mejor. Juega con menos golpes.", createAccount:"Crear cuenta", signIn:"Iniciar sesion",
    welcomeBack:"Bienvenido de nuevo", signInSub:"Inicia sesion para seguir entrenando", email:"Correo electronico", password:"Contrasena",
    noAccount:"No tienes cuenta? Crea una", notYou:"No eres tu? Usa otra cuenta", createAcct:"Crear cuenta", step1:"Paso 1 de 2", step2:"Paso 2 de 2",
    finisherGames:"Juegos Finisher", players:"Jugadores", addPlayer:"Anadir jugador", localMultiplayerNote:"Multijugador local: pasa el telefono entre jugadores en cada estacion.",
    startFinisher:"Empezar", station:"Estacion", scoreForStation:"Puntuacion para esta estacion", prevStation:"Anterior", nextStation:"Siguiente estacion", finishGame:"Terminar",
    handPhoneTo:"Pasa el telefono a", nextPlayer:"Siguiente jugador", byStation:"Por estacion", yourEvolution:"Tu evolucion", runningTotal:"Total acumulado", today:"Hoy", bestPrevious:"Mejor anterior",
    exportImage:"Exportar como imagen", exporting:"Exportando", exported:"Guardado", exportFailed:"No se pudo exportar — prueba una captura de pantalla", tapToExpand:"Toca para ampliar",
    copied:"Copiado al portapapeles", shareResult:"Compartir resultado", howWhy:"Como y por que",
    noSessionsYetTap:"Sin sesiones aun — toca para ver", noSessionsYet:"Sin sesiones aun", noSessionsYetDesc:"Entrena esta area para empezar a registrar tu progreso aqui.",
    avgScore:"Puntuacion media", worst:"Mas bajo", evolution:"Evolucion", sinceStart:"desde el inicio", needMoreSessions:"Completa una sesion mas para ver tu tendencia.",
    exercisesPracticed:"Ejercicios practicados", allSessions:"Todas las sesiones", upMeansImproving:"Linea ascendente = mejorando (puntuaciones mas bajas)",
    createSub:"Tu entrenamiento personal empieza aqui", fullName:"Nombre completo", choosePass:"Elige una contrasena",
    continue:"Continuar", haveAccount:"Ya tienes cuenta? Inicia sesion", golfProfile:"Perfil de golf",
    golfProfileSub:"Personaliza tu plan de entrenamiento", handicapIndex:"Indice de handicap", handicapHelp:"Usa + para handicap positivo (ej: +2.4)",
    selectHcp:"Selecciona handicap", playFreq:"Con que frecuencia juegas?", selectFreq:"Selecciona frecuencia", measurement:"Unidades",
    yardsFeet:"Yardas / Pies", metres:"Metros", language:"Idioma", startTraining:"Empezar a entrenar",
    fillAll:"Por favor completa todos los campos.", wrongLogin:"Correo o contrasena incorrectos.", emailTaken:"Este correo ya esta registrado.",
    back:"Atras",
    train:"Entrenar", scorecard:"Tarjeta", stats:"Estadisticas", history:"Historial", player:"Jugador",
    chooseFocus:"Elige tu area de enfoque", start:"Empezar", sessions:"sesiones",
    howLong:"Cuanto tiempo tienes?", min:"min", hour:"hora", chooseExercise:"Elegir ejercicio", drillsAvail:"ejercicios disponibles",
    last:"Ultimo", purpose:"Proposito", yourHistory:"Tu historial", first:"Primero", best:"Mejor",
    outOf:"de", saveResult:"Guardar resultado", excellent:"Excelente!", goodWork:"Buen trabajo", keepGoing:"Sigue asi",
    yourScore:"Tu puntuacion", vsLast:"vs sesion anterior", whyMatters:"Por que importa", newSession:"Nueva sesion",
    trackRound:"Registra tu ronda, hoyo por hoyo", holes:"hoyos", startRound:"Empezar ronda",
    golfCourse:"Campo de golf", coursePh:"ej: Pebble Beach...", feelToday:"Como te sientes hoy?",
    notesOptional:"Notas (opcional)", notesPh:"Viento en los ultimos hoyos, buenos putts...",
    cancel:"Cancelar", saveRound:"Guardar ronda", hole:"Hoyo", par:"Par", score:"Puntuacion", putts:"Putts", miss:"Fallo",
    roundSaved:"Ronda guardada!", roundSavedSub:"Buen trabajo ahi fuera", viewSummary:"Ver resumen", done:"Listo",
    gameGlance:"Tu juego de un vistazo", onCourse:"En el campo", avgPutts:"Putts prom.", perHole:"por hoyo",
    girPct:"GIR %", greens:"greens", firPct:"FIR %", fairways:"calles", topMiss:"Fallo principal", common:"frecuente",
    scoreVsPar:"Puntuacion vs Par", lastRounds:"Ultimas", rounds:"rondas", trainingProgress:"Progreso de entrenamiento",
    hdcpVsActual:"Handicap vs Real", declaredHdcp:"Tu handicap", actualAvg:"Promedio real (vs par)",
    playingAbove:"Jugando por encima de tu handicap", playingBelow:"Jugando por debajo de tu handicap", playingOnTarget:"En el objetivo",
    playingAboveDesc:"Tus ultimas rondas promedian {n} golpes mas que lo que sugiere tu handicap. Revisa las estadisticas por area para ver donde se escapan los golpes.",
    playingBelowDesc:"Tus ultimas rondas promedian {n} golpes mejor de lo que sugiere tu handicap — buen trabajo, tu indice podria necesitar actualizarse.",
    playingOnTargetDesc:"Tu puntuacion real coincide bien con tu handicap declarado. Buena consistencia.",
    hdcpDisclaimer:"Estimacion simplificada — no considera el rating ni el slope del campo.",
    myPlan:"Mi Plan", planSub:"Sesiones en cola para la proxima vez", planEmpty:"Aun no hay sesiones planificadas. Prepara una lista de ejercicios para la proxima vez.",
    addSession:"Anadir sesion", addToPlan:"Anadir a tu plan", startNext:"Empezar", nextInPlan:"Siguiente en tu plan",
    focusRec:"Recomendacion", focus:"A mejorar", strong:"Fuerte", noStatsYet:"Completa una sesion o ronda para ver tus estadisticas.",
    getStarted:"Empezar", getStartedSub:"Entrena una habilidad o registra una ronda para seguir tu progreso.",
    startTrainingCta:"Empezar a entrenar", logRoundCta:"Registrar una ronda", unlockStatsHint:"Registra FIR, GIR, putts y direccion de fallos en cada hoyo para desbloquear estadisticas detalladas.",
    sessionsCount:"sesion", sessionsCount2:"sesiones", clearAll:"Borrar todo", noHistory:"Tus sesiones apareceran aqui.",
    confirmClear:"Borrar todo el historial?", deleteThis:"Eliminar esta entrada?", delete:"Eliminar",
    roundSummary:"Resumen de la ronda", tapToView:"Toca para ver",
    profile:"Perfil", settings:"Ajustes", personalInfo:"Informacion personal", yourName:"Tu nombre",
    homeClub:"Club", homeClubPh:"ej: Pebble Beach", location:"Ubicacion", locationPh:"Ciudad, Pais",
    typicalScore:"Puntuacion habitual", dominantHand:"Mano dominante", right:"Derecha", left:"Izquierda", select:"Seleccionar...",
    mainGoal:"Objetivo principal", weaknesses:"Debilidades", saveProfile:"Guardar perfil", profileSaved:"Perfil guardado",
    signOut:"Cerrar sesion", defaultHoles:"Hoyos por defecto", settingsAuto:"Los ajustes se guardan automaticamente",
    streakDay:"dia consecutivo", streakDays:"dias consecutivos", keepItUp:"Sigue asi!",
    feel_focused:"Concentrado", feel_relaxed:"Relajado", feel_neutral:"Neutral", feel_tired:"Cansado", feel_pumped:"Motivado", feel_anxious:"Ansioso",
    freq_everyday:"Todos los dias", freq_f45:"4-5x/semana", freq_f23:"2-3x/semana", freq_weekly:"Una vez/semana", freq_monthly:"Mensual", freq_occasional:"Ocasional",
    score_under70:"Menos de 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Bajar mi handicap", goal_break90:"Romper 90", goal_break80:"Romper 80", goal_break70:"Romper 70", goal_shortGame:"Mejorar juego corto", goal_management:"Gestion de campo", goal_enjoy:"Disfrutar el juego", goal_compete:"Competir",
    weak_driver:"Driver", weak_irons:"Hierros", weak_wedges:"Wedges", weak_putting:"Putt", weak_bunker:"Bunker", weak_mental:"Mental", weak_shortGame2:"Juego corto", weak_strategy:"Estrategia",
    diff_Beginner:"Principiante", diff_Intermediate:"Intermedio", diff_Advanced:"Avanzado",
    left_dir:"Izquierda", right_dir:"Derecha", short_dir:"Corto", long_dir:"Largo",
  },
  de: {
    appTagline:"Trainiere klueger. Spiele besser.", createAccount:"Konto erstellen", signIn:"Anmelden",
    welcomeBack:"Willkommen zurueck", signInSub:"Melde dich an, um weiterzutrainieren", email:"E-Mail", password:"Passwort",
    noAccount:"Kein Konto? Jetzt erstellen", notYou:"Nicht du? Anderes Konto verwenden", createAcct:"Konto erstellen", step1:"Schritt 1 von 2", step2:"Schritt 2 von 2",
    finisherGames:"Finisher-Spiele", players:"Spieler", addPlayer:"Spieler hinzufuegen", localMultiplayerNote:"Lokaler Mehrspielermodus: Gib das Telefon zwischen den Spielern bei jeder Station weiter.",
    startFinisher:"Starten", station:"Station", scoreForStation:"Ergebnis fuer diese Station", prevStation:"Zurueck", nextStation:"Naechste Station", finishGame:"Spiel beenden",
    handPhoneTo:"Gib das Telefon weiter an", nextPlayer:"Naechster Spieler", byStation:"Nach Station", yourEvolution:"Deine Entwicklung", runningTotal:"Laufende Summe", today:"Heute", bestPrevious:"Beste vorherige",
    exportImage:"Als Bild exportieren", exporting:"Wird exportiert", exported:"Gespeichert", exportFailed:"Export fehlgeschlagen — versuche einen Screenshot", tapToExpand:"Tippen zum Vergroessern",
    copied:"In die Zwischenablage kopiert", shareResult:"Ergebnis teilen", howWhy:"Wie & Warum",
    noSessionsYetTap:"Noch keine Einheiten — tippen zum Ansehen", noSessionsYet:"Noch keine Einheiten", noSessionsYetDesc:"Trainiere diesen Bereich, um hier deinen Fortschritt aufzubauen.",
    avgScore:"Durchschnitt", worst:"Niedrigster", evolution:"Entwicklung", sinceStart:"seit Beginn", needMoreSessions:"Schliesse eine weitere Einheit ab, um deinen Trend zu sehen.",
    exercisesPracticed:"Geuebte Uebungen", allSessions:"Alle Einheiten", upMeansImproving:"Aufwaertstrend = Verbesserung (niedrigere Ergebnisse)",
    createSub:"Dein personliches Training beginnt hier", fullName:"Vollstandiger Name", choosePass:"Passwort wahlen",
    continue:"Weiter", haveAccount:"Schon ein Konto? Anmelden", golfProfile:"Golfprofil",
    golfProfileSub:"Personalisiert deinen Trainingsplan", handicapIndex:"Handicap-Index", handicapHelp:"Nutze + fuer ein Plus-Handicap (z.B. +2.4)",
    selectHcp:"Handicap auswahlen", playFreq:"Wie oft spielst du?", selectFreq:"Haufigkeit auswahlen", measurement:"Masseinheit",
    yardsFeet:"Yards / Fuss", metres:"Meter", language:"Sprache", startTraining:"Training starten",
    fillAll:"Bitte fuelle alle Felder aus.", wrongLogin:"Falsche E-Mail oder Passwort.", emailTaken:"Diese E-Mail ist bereits registriert.",
    back:"Zurueck",
    train:"Training", scorecard:"Scorekarte", stats:"Statistik", history:"Verlauf", player:"Spieler",
    chooseFocus:"Wahle deinen Fokusbereich", start:"Start", sessions:"Einheiten",
    howLong:"Wie viel Zeit hast du?", min:"Min", hour:"Stunde", chooseExercise:"Uebung wahlen", drillsAvail:"Uebungen verfuegbar",
    last:"Letzte", purpose:"Zweck", yourHistory:"Dein Verlauf", first:"Erste", best:"Beste",
    outOf:"von", saveResult:"Ergebnis speichern", excellent:"Ausgezeichnet!", goodWork:"Gute Arbeit", keepGoing:"Weiter so",
    yourScore:"Dein Ergebnis", vsLast:"vs letzte Einheit", whyMatters:"Warum das wichtig ist", newSession:"Neue Einheit",
    trackRound:"Verfolge deine Runde, Loch fuer Loch", holes:"Locher", startRound:"Runde starten",
    golfCourse:"Golfplatz", coursePh:"z.B. Pebble Beach...", feelToday:"Wie fuhlst du dich heute?",
    notesOptional:"Notizen (optional)", notesPh:"Windig auf den letzten Lochern, gute Putts...",
    cancel:"Abbrechen", saveRound:"Runde speichern", hole:"Loch", par:"Par", score:"Ergebnis", putts:"Putts", miss:"Fehler",
    roundSaved:"Runde gespeichert!", roundSavedSub:"Gut gespielt", viewSummary:"Zusammenfassung ansehen", done:"Fertig",
    gameGlance:"Dein Spiel auf einen Blick", onCourse:"Auf dem Platz", avgPutts:"Putts Schnitt", perHole:"pro Loch",
    girPct:"GIR %", greens:"Greens", firPct:"FIR %", fairways:"Fairways", topMiss:"Haufigster Fehler", common:"haufig",
    scoreVsPar:"Ergebnis vs Par", lastRounds:"Letzte", rounds:"Runden", trainingProgress:"Trainingsfortschritt",
    hdcpVsActual:"Handicap vs Tatsaechlich", declaredHdcp:"Dein Handicap", actualAvg:"Tatsaechlicher Schnitt (vs Par)",
    playingAbove:"Du spielst ueber deinem Handicap", playingBelow:"Du spielst unter deinem Handicap", playingOnTarget:"Genau im Soll",
    playingAboveDesc:"Deine letzten Runden liegen im Schnitt {n} Schlaege hoeher als dein Handicap vermuten laesst. Schau in die Statistik nach Bereich, um zu sehen wo die Schlaege verloren gehen.",
    playingBelowDesc:"Deine letzten Runden liegen im Schnitt {n} Schlaege besser als dein Handicap vermuten laesst — gute Arbeit, dein Index ist vielleicht reif fuer ein Update.",
    playingOnTargetDesc:"Dein tatsaechliches Ergebnis passt gut zu deinem angegebenen Handicap. Solide Konstanz.",
    hdcpDisclaimer:"Vereinfachte Schaetzung — beruecksichtigt nicht Course Rating oder Slope.",
    myPlan:"Mein Plan", planSub:"Geplante Einheiten fuer naechstes Mal", planEmpty:"Noch keine Einheiten geplant. Stelle eine Liste von Uebungen fuer naechstes Mal zusammen.",
    addSession:"Einheit hinzufuegen", addToPlan:"Zu deinem Plan hinzufuegen", startNext:"Starten", nextInPlan:"Naechstes in deinem Plan",
    focusRec:"Fokus-Empfehlung", focus:"Fokus", strong:"Stark", noStatsYet:"Schliesse eine Einheit oder Runde ab, um Statistiken zu sehen.",
    getStarted:"Los geht's", getStartedSub:"Trainiere eine Fahigkeit oder erfasse eine Runde, um deinen Fortschritt zu verfolgen.",
    startTrainingCta:"Training starten", logRoundCta:"Runde erfassen", unlockStatsHint:"Erfasse FIR, GIR, Putts und Fehlerrichtung fuer jedes Loch, um detaillierte Statistiken freizuschalten.",
    sessionsCount:"Einheit", sessionsCount2:"Einheiten", clearAll:"Alles loschen", noHistory:"Deine Einheiten erscheinen hier.",
    confirmClear:"Gesamten Verlauf loschen?", deleteThis:"Diesen Eintrag loschen?", delete:"Loschen",
    roundSummary:"Rundenzusammenfassung", tapToView:"Tippen zum Ansehen",
    profile:"Profil", settings:"Einstellungen", personalInfo:"Personliche Daten", yourName:"Dein Name",
    homeClub:"Heimatclub", homeClubPh:"z.B. Pebble Beach", location:"Standort", locationPh:"Stadt, Land",
    typicalScore:"Typisches Ergebnis", dominantHand:"Dominante Hand", right:"Rechts", left:"Links", select:"Auswahlen...",
    mainGoal:"Hauptziel", weaknesses:"Schwachen", saveProfile:"Profil speichern", profileSaved:"Profil gespeichert",
    signOut:"Abmelden", defaultHoles:"Standard-Locher", settingsAuto:"Einstellungen werden automatisch gespeichert",
    streakDay:"Tag Serie", streakDays:"Tage Serie", keepItUp:"Weiter so!",
    feel_focused:"Fokussiert", feel_relaxed:"Entspannt", feel_neutral:"Neutral", feel_tired:"Mude", feel_pumped:"Motiviert", feel_anxious:"Angespannt",
    freq_everyday:"Jeden Tag", freq_f45:"4-5x/Woche", freq_f23:"2-3x/Woche", freq_weekly:"Einmal/Woche", freq_monthly:"Monatlich", freq_occasional:"Gelegentlich",
    score_under70:"Unter 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Handicap senken", goal_break90:"Unter 90 spielen", goal_break80:"Unter 80 spielen", goal_break70:"Unter 70 spielen", goal_shortGame:"Kurzes Spiel verbessern", goal_management:"Platzmanagement", goal_enjoy:"Das Spiel geniessen", goal_compete:"Wettkampf",
    weak_driver:"Driver", weak_irons:"Eisen", weak_wedges:"Wedges", weak_putting:"Putten", weak_bunker:"Bunker", weak_mental:"Mental", weak_shortGame2:"Kurzes Spiel", weak_strategy:"Strategie",
    diff_Beginner:"Anfanger", diff_Intermediate:"Fortgeschritten", diff_Advanced:"Experte",
    left_dir:"Links", right_dir:"Rechts", short_dir:"Kurz", long_dir:"Lang",
  },
  it: {
    appTagline:"Allenati meglio. Gioca con meno colpi.", createAccount:"Crea account", signIn:"Accedi",
    welcomeBack:"Bentornato", signInSub:"Accedi per continuare l'allenamento", email:"Email", password:"Password",
    noAccount:"Non hai un account? Creane uno", notYou:"Non sei tu? Usa un altro account", createAcct:"Crea account", step1:"Passo 1 di 2", step2:"Passo 2 di 2",
    finisherGames:"Giochi Finisher", players:"Giocatori", addPlayer:"Aggiungi giocatore", localMultiplayerNote:"Multiplayer locale: passa il telefono tra i giocatori a ogni stazione.",
    startFinisher:"Inizia", station:"Stazione", scoreForStation:"Punteggio per questa stazione", prevStation:"Precedente", nextStation:"Stazione successiva", finishGame:"Termina gioco",
    handPhoneTo:"Passa il telefono a", nextPlayer:"Prossimo giocatore", byStation:"Per stazione", yourEvolution:"La tua evoluzione", runningTotal:"Totale progressivo", today:"Oggi", bestPrevious:"Migliore precedente",
    exportImage:"Esporta come immagine", exporting:"Esportazione in corso", exported:"Salvato", exportFailed:"Esportazione non riuscita — prova uno screenshot", tapToExpand:"Tocca per espandere",
    copied:"Copiato negli appunti", shareResult:"Condividi risultato", howWhy:"Come e perche",
    noSessionsYetTap:"Nessuna sessione ancora — tocca per vedere", noSessionsYet:"Nessuna sessione ancora", noSessionsYetDesc:"Allena quest'area per iniziare a costruire i tuoi progressi qui.",
    avgScore:"Punteggio medio", worst:"Piu basso", evolution:"Evoluzione", sinceStart:"dall'inizio", needMoreSessions:"Completa un'altra sessione per vedere il tuo andamento.",
    exercisesPracticed:"Esercizi praticati", allSessions:"Tutte le sessioni", upMeansImproving:"Linea in salita = miglioramento (punteggi piu bassi)",
    createSub:"Il tuo allenamento personale inizia qui", fullName:"Nome completo", choosePass:"Scegli una password",
    continue:"Continua", haveAccount:"Hai gia un account? Accedi", golfProfile:"Profilo golf",
    golfProfileSub:"Personalizza il tuo piano di allenamento", handicapIndex:"Indice di handicap", handicapHelp:"Usa + per handicap positivo (es: +2.4)",
    selectHcp:"Seleziona handicap", playFreq:"Con che frequenza giochi?", selectFreq:"Seleziona frequenza", measurement:"Unita di misura",
    yardsFeet:"Yard / Piedi", metres:"Metri", language:"Lingua", startTraining:"Inizia l'allenamento",
    fillAll:"Compila tutti i campi.", wrongLogin:"Email o password errati.", emailTaken:"Questa email e gia registrata.",
    back:"Indietro",
    train:"Allenamento", scorecard:"Scorecard", stats:"Statistiche", history:"Cronologia", player:"Giocatore",
    chooseFocus:"Scegli la tua area di interesse", start:"Inizia", sessions:"sessioni",
    howLong:"Quanto tempo hai?", min:"min", hour:"ora", chooseExercise:"Scegli esercizio", drillsAvail:"esercizi disponibili",
    last:"Ultimo", purpose:"Obiettivo", yourHistory:"La tua cronologia", first:"Primo", best:"Migliore",
    outOf:"su", saveResult:"Salva risultato", excellent:"Eccellente!", goodWork:"Buon lavoro", keepGoing:"Continua cosi",
    yourScore:"Il tuo punteggio", vsLast:"vs ultima sessione", whyMatters:"Perche e importante", newSession:"Nuova sessione",
    trackRound:"Registra il tuo giro, buca per buca", holes:"buche", startRound:"Inizia il giro",
    golfCourse:"Campo da golf", coursePh:"es: Pebble Beach...", feelToday:"Come ti senti oggi?",
    notesOptional:"Note (opzionale)", notesPh:"Vento sulle ultime buche, buoni putt...",
    cancel:"Annulla", saveRound:"Salva giro", hole:"Buca", par:"Par", score:"Punteggio", putts:"Putt", miss:"Errore",
    roundSaved:"Giro salvato!", roundSavedSub:"Bel giro", viewSummary:"Vedi riepilogo", done:"Fatto",
    gameGlance:"Il tuo gioco in breve", onCourse:"In campo", avgPutts:"Putt medi", perHole:"per buca",
    girPct:"GIR %", greens:"green", firPct:"FIR %", fairways:"fairway", topMiss:"Errore principale", common:"frequente",
    scoreVsPar:"Punteggio vs Par", lastRounds:"Ultimi", rounds:"giri", trainingProgress:"Progresso allenamento",
    hdcpVsActual:"Handicap vs Reale", declaredHdcp:"Il tuo handicap", actualAvg:"Media reale (vs par)",
    playingAbove:"Stai giocando sopra il tuo handicap", playingBelow:"Stai giocando sotto il tuo handicap", playingOnTarget:"Perfettamente in linea",
    playingAboveDesc:"I tuoi ultimi giri hanno una media di {n} colpi superiore a quanto suggerisce il tuo handicap. Controlla le statistiche per area per capire dove si perdono i colpi.",
    playingBelowDesc:"I tuoi ultimi giri hanno una media di {n} colpi migliore di quanto suggerisce il tuo handicap — ottimo lavoro, il tuo indice potrebbe necessitare un aggiornamento.",
    playingOnTargetDesc:"Il tuo punteggio reale corrisponde bene al tuo handicap dichiarato. Buona costanza.",
    hdcpDisclaimer:"Stima semplificata — non considera il rating o lo slope del campo.",
    myPlan:"Il Mio Piano", planSub:"Sessioni in coda per la prossima volta", planEmpty:"Nessuna sessione pianificata. Prepara una lista di esercizi per la prossima volta.",
    addSession:"Aggiungi sessione", addToPlan:"Aggiungi al tuo piano", startNext:"Inizia", nextInPlan:"Prossima nel tuo piano",
    focusRec:"Raccomandazione", focus:"Da migliorare", strong:"Forte", noStatsYet:"Completa una sessione o un giro per vedere le statistiche.",
    getStarted:"Inizia", getStartedSub:"Allena un'abilita o registra un giro per iniziare a monitorare i tuoi progressi.",
    startTrainingCta:"Inizia allenamento", logRoundCta:"Registra un giro", unlockStatsHint:"Registra FIR, GIR, putt e direzione degli errori per ogni buca per sbloccare statistiche detagliate.",
    sessionsCount:"sessione", sessionsCount2:"sessioni", clearAll:"Cancella tutto", noHistory:"Le tue sessioni appariranno qui.",
    confirmClear:"Cancellare tutta la cronologia?", deleteThis:"Eliminare questa voce?", delete:"Elimina",
    roundSummary:"Riepilogo del giro", tapToView:"Tocca per vedere",
    profile:"Profilo", settings:"Impostazioni", personalInfo:"Informazioni personali", yourName:"Il tuo nome",
    homeClub:"Club", homeClubPh:"es: Pebble Beach", location:"Posizione", locationPh:"Citta, Paese",
    typicalScore:"Punteggio tipico", dominantHand:"Mano dominante", right:"Destra", left:"Sinistra", select:"Seleziona...",
    mainGoal:"Obiettivo principale", weaknesses:"Punti debole", saveProfile:"Salva profilo", profileSaved:"Profilo salvato",
    signOut:"Esci", defaultHoles:"Buche predefinite", settingsAuto:"Le impostazioni si salvano automaticamente",
    streakDay:"giorno consecutivo", streakDays:"giorni consecutivi", keepItUp:"Continua cosi!",
    feel_focused:"Concentrato", feel_relaxed:"Rilassato", feel_neutral:"Neutro", feel_tired:"Stanco", feel_pumped:"Carico", feel_anxious:"Ansioso",
    freq_everyday:"Tutti i giorni", freq_f45:"4-5x/settimana", freq_f23:"2-3x/settimana", freq_weekly:"Una volta/settimana", freq_monthly:"Mensile", freq_occasional:"Occasionale",
    score_under70:"Sotto 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Abbassare il mio handicap", goal_break90:"Scendere sotto 90", goal_break80:"Scendere sotto 80", goal_break70:"Scendere sotto 70", goal_shortGame:"Migliorare il gioco corto", goal_management:"Gestione del campo", goal_enjoy:"Divertirmi", goal_compete:"Competere",
    weak_driver:"Driver", weak_irons:"Ferri", weak_wedges:"Wedge", weak_putting:"Putt", weak_bunker:"Bunker", weak_mental:"Mentale", weak_shortGame2:"Gioco corto", weak_strategy:"Strategia",
    diff_Beginner:"Principiante", diff_Intermediate:"Intermedio", diff_Advanced:"Avanzato",
    left_dir:"Sinistra", right_dir:"Destra", short_dir:"Corto", long_dir:"Lungo",
  },
  pt: {
    appTagline:"Treine melhor. Jogue com menos tacadas.", createAccount:"Criar conta", signIn:"Entrar",
    welcomeBack:"Bem-vindo de volta", signInSub:"Entre para continuar treinando", email:"Email", password:"Senha",
    noAccount:"Nao tem conta? Crie uma", notYou:"Nao e voce? Use outra conta", createAcct:"Criar conta", step1:"Passo 1 de 2", step2:"Passo 2 de 2",
    finisherGames:"Jogos Finisher", players:"Jogadores", addPlayer:"Adicionar jogador", localMultiplayerNote:"Multiplayer local: passe o celular entre os jogadores em cada estacao.",
    startFinisher:"Comecar", station:"Estacao", scoreForStation:"Pontuacao para esta estacao", prevStation:"Anterior", nextStation:"Proxima estacao", finishGame:"Terminar jogo",
    handPhoneTo:"Passe o celular para", nextPlayer:"Proximo jogador", byStation:"Por estacao", yourEvolution:"Sua evolucao", runningTotal:"Total acumulado", today:"Hoje", bestPrevious:"Melhor anterior",
    exportImage:"Exportar como imagem", exporting:"Exportando", exported:"Salvo", exportFailed:"Falha ao exportar — tente uma captura de tela", tapToExpand:"Toque para expandir",
    copied:"Copiado para a area de transferencia", shareResult:"Compartilhar resultado", howWhy:"Como e por que",
    noSessionsYetTap:"Ainda sem sessoes — toque para ver", noSessionsYet:"Ainda sem sessoes", noSessionsYetDesc:"Treine esta area para comecar a registrar seu progresso aqui.",
    avgScore:"Pontuacao media", worst:"Mais baixo", evolution:"Evolucao", sinceStart:"desde o inicio", needMoreSessions:"Complete mais uma sessao para ver sua tendencia.",
    exercisesPracticed:"Exercicios praticados", allSessions:"Todas as sessoes", upMeansImproving:"Linha subindo = melhorando (pontuacoes mais baixas)",
    createSub:"Seu treino pessoal comeca aqui", fullName:"Nome completo", choosePass:"Escolha uma senha",
    continue:"Continuar", haveAccount:"Ja tem conta? Entrar", golfProfile:"Perfil de golfe",
    golfProfileSub:"Personaliza seu plano de treino", handicapIndex:"Indice de handicap", handicapHelp:"Use + para handicap positivo (ex: +2.4)",
    selectHcp:"Selecione handicap", playFreq:"Com que frequencia voce joga?", selectFreq:"Selecione frequencia", measurement:"Unidade de medida",
    yardsFeet:"Jardas / Pes", metres:"Metros", language:"Idioma", startTraining:"Comecar a treinar",
    fillAll:"Preencha todos os campos.", wrongLogin:"Email ou senha incorretos.", emailTaken:"Este email ja esta registrado.",
    back:"Voltar",
    train:"Treinar", scorecard:"Cartao", stats:"Estatisticas", history:"Historico", player:"Jogador",
    chooseFocus:"Escolha sua area de foco", start:"Comecar", sessions:"sessoes",
    howLong:"Quanto tempo voce tem?", min:"min", hour:"hora", chooseExercise:"Escolher exercicio", drillsAvail:"exercicios disponiveis",
    last:"Ultimo", purpose:"Proposito", yourHistory:"Seu historico", first:"Primeiro", best:"Melhor",
    outOf:"de", saveResult:"Salvar resultado", excellent:"Excelente!", goodWork:"Bom trabalho", keepGoing:"Continue assim",
    yourScore:"Sua pontuacao", vsLast:"vs ultima sessao", whyMatters:"Por que isso importa", newSession:"Nova sessao",
    trackRound:"Registre sua rodada, buraco por buraco", holes:"buracos", startRound:"Comecar rodada",
    golfCourse:"Campo de golfe", coursePh:"ex: Pebble Beach...", feelToday:"Como voce esta se sentindo hoje?",
    notesOptional:"Notas (opcional)", notesPh:"Ventoso nos ultimos buracos, bons putts...",
    cancel:"Cancelar", saveRound:"Salvar rodada", hole:"Buraco", par:"Par", score:"Pontuacao", putts:"Putts", miss:"Erro",
    roundSaved:"Rodada salva!", roundSavedSub:"Bom trabalho la fora", viewSummary:"Ver resumo", done:"Concluido",
    gameGlance:"Seu jogo em um relance", onCourse:"No campo", avgPutts:"Putts media", perHole:"por buraco",
    girPct:"GIR %", greens:"greens", firPct:"FIR %", fairways:"fairways", topMiss:"Erro principal", common:"comum",
    scoreVsPar:"Pontuacao vs Par", lastRounds:"Ultimas", rounds:"rodadas", trainingProgress:"Progresso de treino",
    hdcpVsActual:"Handicap vs Real", declaredHdcp:"Seu handicap", actualAvg:"Media real (vs par)",
    playingAbove:"Jogando acima do seu handicap", playingBelow:"Jogando abaixo do seu handicap", playingOnTarget:"Bem na meta",
    playingAboveDesc:"Suas ultimas rodadas tem media de {n} tacadas acima do que seu handicap sugere. Vale verificar as estatisticas por area para ver onde as tacadas estao escapando.",
    playingBelowDesc:"Suas ultimas rodadas tem media de {n} tacadas melhor do que seu handicap sugere — bom trabalho, seu indice pode precisar de atualizacao.",
    playingOnTargetDesc:"Sua pontuacao real corresponde bem ao seu handicap declarado. Boa consistencia.",
    hdcpDisclaimer:"Estimativa simplificada — nao considera o rating ou slope do campo.",
    myPlan:"Meu Plano", planSub:"Sessoes na fila para a proxima vez", planEmpty:"Nenhuma sessao planejada ainda. Monte uma lista de exercicios para a proxima vez.",
    addSession:"Adicionar sessao", addToPlan:"Adicionar ao seu plano", startNext:"Comecar", nextInPlan:"Proxima no seu plano",
    focusRec:"Recomendacao", focus:"Foco", strong:"Forte", noStatsYet:"Complete uma sessao ou rodada para ver suas estatisticas.",
    getStarted:"Comecar", getStartedSub:"Treine uma habilidade ou registre uma rodada para acompanhar seu progresso.",
    startTrainingCta:"Comecar a treinar", logRoundCta:"Registrar uma rodada", unlockStatsHint:"Registre FIR, GIR, putts e direcao de erros em cada buraco para desbloquear estatisticas detalhadas.",
    sessionsCount:"sessao", sessionsCount2:"sessoes", clearAll:"Limpar tudo", noHistory:"Suas sessoes aparecerao aqui.",
    confirmClear:"Limpar todo o historico?", deleteThis:"Excluir esta entrada?", delete:"Excluir",
    roundSummary:"Resumo da rodada", tapToView:"Toque para ver",
    profile:"Perfil", settings:"Configuracoes", personalInfo:"Informacoes pessoais", yourName:"Seu nome",
    homeClub:"Clube", homeClubPh:"ex: Pebble Beach", location:"Localizacao", locationPh:"Cidade, Pais",
    typicalScore:"Pontuacao tipica", dominantHand:"Mao dominante", right:"Direita", left:"Esquerda", select:"Selecionar...",
    mainGoal:"Objetivo principal", weaknesses:"Pontos fracos", saveProfile:"Salvar perfil", profileSaved:"Perfil salvo",
    signOut:"Sair", defaultHoles:"Buracos padrao", settingsAuto:"As configuracoes salvam automaticamente",
    streakDay:"dia consecutivo", streakDays:"dias consecutivos", keepItUp:"Continue assim!",
    feel_focused:"Focado", feel_relaxed:"Relaxado", feel_neutral:"Neutro", feel_tired:"Cansado", feel_pumped:"Animado", feel_anxious:"Ansioso",
    freq_everyday:"Todos os dias", freq_f45:"4-5x/semana", freq_f23:"2-3x/semana", freq_weekly:"Uma vez/semana", freq_monthly:"Mensal", freq_occasional:"Ocasional",
    score_under70:"Abaixo de 70", score_70_74:"70-74", score_75_79:"75-79", score_80_84:"80-84", score_85_89:"85-89", score_90_94:"90-94", score_95_99:"95-99", score_100plus:"100+",
    goal_lowerHcp:"Reduzir meu handicap", goal_break90:"Quebrar 90", goal_break80:"Quebrar 80", goal_break70:"Quebrar 70", goal_shortGame:"Melhorar jogo curto", goal_management:"Gestao de campo", goal_enjoy:"Aproveitar o jogo", goal_compete:"Competir",
    weak_driver:"Driver", weak_irons:"Ferros", weak_wedges:"Wedges", weak_putting:"Putt", weak_bunker:"Bunker", weak_mental:"Mental", weak_shortGame2:"Jogo curto", weak_strategy:"Estrategia",
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
function badge(d){
  if(d==="Beginner") return [GREEN_BG, GREEN];
  if(d==="Intermediate") return ["#fff8e6", AMBER];
  return ["#fef0f0", RED];
}
function fmt(ts){return new Date(ts).toLocaleDateString("en-CA",{month:"short",day:"numeric",year:"numeric"});}
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
// Validates and normalizes a handicap string: allows "+2.4", "14.2", "-1.0" etc.
function normalizeHcp(raw){
  if(!raw) return "";
  let s = raw.trim().replace(",", ".");
  // allow leading + or - then digits/decimal
  if(!/^[+-]?\d*\.?\d*$/.test(s)) return null; // invalid
  return s;
}

function Sparkline({data, color, h=36, invert=false, fixedScale=false}){
  if(!data||data.length<2) return null;
  // For "lower is better" series (e.g. score vs par), invert so improvement
  // reads as an upward line, matching how golfers actually think about it.
  const plotData = invert ? data.map(v=>-v) : data;
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
  const W=320, H=150, padL=4, padB=18, padT=6;
  const groupW = (W-padL*2)/stations.length;
  const barGap = 2;
  const barW = Math.max(4, (groupW-8)/Math.max(1,players.length) - barGap);
  return (
    <div>
    <svg viewBox={"0 0 "+W+" "+H} style={{width:"100%",height:"auto",display:"block"}}>
      <line x1={padL} y1={H-padB} x2={W-padL} y2={H-padB} stroke={BORDER} strokeWidth="1"/>
      {stations.map((st,si)=>{
        const groupX = padL + si*groupW + 4;
        const max = maxPerStation[si]||1;
        return (
          <g key={st.id}>
            {players.map((p,pi)=>{
              const val = Number(p.scores[st.id])||0;
              const barH = (val/max)*(H-padB-padT);
              const x = groupX + pi*(barW+barGap);
              const y = H-padB-barH;
              return (
                <g key={pi}>
                  <rect x={x} y={y} width={barW} height={Math.max(barH,1.5)} rx="2" fill={colors[pi%colors.length]}/>
                  {barH>12&&(
                    <text x={x+barW/2} y={y-3} fontSize="7" fill={TEXT_S} textAnchor="middle" fontWeight="700">{val}</text>
                  )}
                </g>
              );
            })}
            <text x={groupX + (barW+barGap)*players.length/2 - barGap/2} y={H-padB+11} fontSize="7" fill={SLATE_L} textAnchor="middle">{st.emoji}</text>
          </g>
        );
      })}
    </svg>
    <div style={{display:"grid",gridTemplateColumns:"repeat("+stations.length+",1fr)",gap:2,marginTop:4}}>
      {stations.map(st=>(
        <div key={st.id} style={{color:SLATE_L,fontSize:8,textAlign:"center",lineHeight:1.2,fontWeight:600}}>{txFin(lang,st.id,"name",st.name)}</div>
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
          <text x={padL-5} y={padT+plotH*f+3} fontSize="7" fill={SLATE_L} textAnchor="end">{Math.round(gameMax*(1-f))}</text>
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
  const [raw,setRaw]=useState(value||"");
  useEffect(()=>setRaw(value||""),[value]);
  function handle(v){
    setRaw(v);
    const norm = normalizeHcp(v);
    if(norm!==null) onChange(norm);
  }
  const base = dark
    ? {width:"100%",background:"rgba(255,255,255,0.13)",border:"1.5px solid rgba(255,255,255,0.28)",borderRadius:12,color:WHITE,padding:"13px 15px",boxSizing:"border-box",fontSize:15,outline:"none",fontFamily:"inherit"}
    : {width:"100%",background:OFF,border:"1.5px solid "+BORDER,borderRadius:12,color:TEXT,padding:"11px 14px",boxSizing:"border-box",fontSize:14,outline:"none",fontFamily:"inherit"};
  return (
    <input type="text" inputMode="decimal" value={raw} onChange={e=>handle(e.target.value)} placeholder="e.g. 14.2 or +2.4" style={base}/>
  );
}

function AuthScreen({onLogin}){
  // If someone has registered on this device before, skip the splash entirely
  // and go straight to a "Welcome back" sign-in screen with email pre-filled.
  const knownUsers = stor("caddy_users",[]);
  const lastEmail = stor("caddy_last_email","");
  const returningUser = knownUsers.length>0
    ? (knownUsers.find(u=>u.email===lastEmail) || knownUsers[knownUsers.length-1])
    : null;

  const [view,setView] = useState(returningUser ? "signin" : "splash");
  const [step,setStep] = useState(1);
  const [err,setErr] = useState("");
  const [f,setF] = useState({
    name:"", email:returningUser?returningUser.email:"", pass:"",
    hdcp:"", freq:"", units:"imperial", lang:returningUser?(stor("caddy_settings_"+returningUser.id,DEF_SETTINGS).language||"en"):"en"
  });
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const L = f.lang;

  function doSignIn(){
    const users=stor("caddy_users",[]);
    const found=users.find(x=>x.email.toLowerCase()===f.email.toLowerCase()&&x.pass===f.pass);
    if(!found){setErr(t(L,"wrongLogin"));return;}
    save("caddy_cur",found);
    save("caddy_last_email",found.email);
    onLogin(found);
  }
  function doSignUp(){
    if(!f.name.trim()||!f.email.trim()||!f.pass.trim()){setErr(t(L,"fillAll"));return;}
    const users=stor("caddy_users",[]);
    if(users.find(x=>x.email.toLowerCase()===f.email.toLowerCase())){setErr(t(L,"emailTaken"));return;}
    const user={id:"u"+Date.now(),name:f.name.trim(),email:f.email.trim(),pass:f.pass,hdcp:f.hdcp,freq:f.freq,photo:"",goal:"",weaknesses:[],homeClub:"",location:"",typicalScore:"",hand:"Right"};
    const settings={...DEF_SETTINGS,units:f.units,language:f.lang};
    users.push(user);
    save("caddy_users",users);
    save("caddy_settings_"+user.id,settings);
    save("caddy_cur",user);
    save("caddy_last_email",user.email);
    onLogin(user);
  }
  function switchAccount(){
    setF(p=>({...p,email:"",pass:""}));
    setErr("");
    setView("signin");
  }

  const inp={
    width:"100%",background:"rgba(255,255,255,0.13)",border:"1.5px solid rgba(255,255,255,0.28)",
    borderRadius:12,color:WHITE,padding:"13px 15px",boxSizing:"border-box",fontSize:15,outline:"none",fontFamily:"inherit"
  };
  const lbl={color:"rgba(255,255,255,0.7)",fontSize:12,fontWeight:600,marginBottom:5,display:"block"};
  const back={background:"none",border:"none",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:14,padding:"0 0 22px",display:"flex",alignItems:"center",gap:6,fontWeight:600};

  // ── Returning-user quick sign-in (skips splash) ──────────────────────────
  if(view==="signin"&&returningUser&&f.email===returningUser.email) return (
    <div style={{minHeight:"100vh",background:DAWN_BG,display:"flex",flexDirection:"column",padding:"0",maxWidth:500,margin:"0 auto"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 28px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(255,255,255,0.13)",border:"2px solid "+GOLD,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",margin:"0 auto 14px"}}>
            {returningUser.photo?<img src={returningUser.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:30}}>👤</span>}
          </div>
          <div style={{color:WHITE,fontFamily:"Georgia,serif",fontSize:24,fontWeight:700}}>{t(L,"welcomeBack")}</div>
          <div style={{color:"rgba(255,255,255,0.55)",fontSize:14,marginTop:4}}>{returningUser.name}</div>
        </div>
        {err&&<div style={{background:"rgba(224,82,82,0.2)",border:"1px solid rgba(224,82,82,0.5)",borderRadius:10,padding:"10px 14px",color:"#ffbbbb",fontSize:13,marginBottom:16}}>{err}</div>}
        <div>
          <label style={lbl}>{t(L,"password")}</label>
          <input type="password" value={f.pass} onChange={e=>u("pass",e.target.value)} placeholder={t(L,"password")} style={inp} autoFocus/>
        </div>
        <button onClick={doSignIn} style={{width:"100%",marginTop:20,padding:16,background:GOLD_BG,border:"none",borderRadius:16,color:NAVY,fontWeight:800,fontSize:16,cursor:"pointer",boxShadow:"0 4px 20px rgba(232,184,75,0.35)"}}>
          {t(L,"signIn")} →
        </button>
        <button onClick={switchAccount} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",fontSize:13,cursor:"pointer",marginTop:20,textAlign:"center"}}>
          {t(L,"notYou")}
        </button>
      </div>
    </div>
  );

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
        <button onClick={()=>{setView("signup");setStep(1);setErr("");}}
          style={{width:"100%",padding:16,background:GOLD_BG,border:"none",borderRadius:16,color:NAVY,fontWeight:800,fontSize:16,cursor:"pointer",boxShadow:"0 4px 20px rgba(232,184,75,0.4)"}}>
          {t(L,"createAccount")}
        </button>
        <button onClick={()=>{setView("signin");setErr("");}}
          style={{width:"100%",padding:16,background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.25)",borderRadius:16,color:WHITE,fontWeight:700,fontSize:16,cursor:"pointer"}}>
          {t(L,"signIn")}
        </button>
      </div>
    </div>
  );

  if(view==="signin") return (
    <div style={{minHeight:"100vh",background:DAWN_BG,display:"flex",flexDirection:"column",padding:"0",maxWidth:500,margin:"0 auto"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 28px"}}>
        <button style={back} onClick={()=>setView("splash")}>← {t(L,"back")}</button>
        <div style={{color:WHITE,fontFamily:"Georgia,serif",fontSize:30,fontWeight:700,marginBottom:4}}>{t(L,"welcomeBack")}</div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:14,marginBottom:28}}>{t(L,"signInSub")}</div>
        {err&&<div style={{background:"rgba(224,82,82,0.2)",border:"1px solid rgba(224,82,82,0.5)",borderRadius:10,padding:"10px 14px",color:"#ffbbbb",fontSize:13,marginBottom:16}}>{err}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={lbl}>{t(L,"email")}</label><input type="email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="you@example.com" style={inp}/></div>
          <div><label style={lbl}>{t(L,"password")}</label><input type="password" value={f.pass} onChange={e=>u("pass",e.target.value)} placeholder={t(L,"password")} style={inp}/></div>
        </div>
        <button onClick={doSignIn} style={{width:"100%",marginTop:24,padding:16,background:GOLD_BG,border:"none",borderRadius:16,color:NAVY,fontWeight:800,fontSize:16,cursor:"pointer",boxShadow:"0 4px 20px rgba(232,184,75,0.35)"}}>
          {t(L,"signIn")} →
        </button>
        <button onClick={()=>{setView("signup");setStep(1);setErr("");}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",fontSize:13,cursor:"pointer",marginTop:20,textAlign:"center"}}>
          {t(L,"noAccount")}
        </button>
      </div>
    </div>
  );

  if(view==="signup"&&step===1) return (
    <div style={{minHeight:"100vh",background:DAWN_BG,display:"flex",flexDirection:"column",maxWidth:500,margin:"0 auto"}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 28px"}}>
        <button style={back} onClick={()=>setView("splash")}>← {t(L,"back")}</button>
        <div style={{color:"rgba(255,255,255,0.45)",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{t(L,"step1")}</div>
        <div style={{color:WHITE,fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,marginBottom:4}}>{t(L,"createAcct")}</div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:14,marginBottom:26}}>{t(L,"createSub")}</div>
        {err&&<div style={{background:"rgba(224,82,82,0.2)",border:"1px solid rgba(224,82,82,0.5)",borderRadius:10,padding:"10px 14px",color:"#ffbbbb",fontSize:13,marginBottom:14}}>{err}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={lbl}>{t(L,"fullName")}</label><input type="text" value={f.name} onChange={e=>u("name",e.target.value)} placeholder={t(L,"yourName")} style={inp}/></div>
          <div><label style={lbl}>{t(L,"email")}</label><input type="email" value={f.email} onChange={e=>u("email",e.target.value)} placeholder="you@example.com" style={inp}/></div>
          <div><label style={lbl}>{t(L,"password")}</label><input type="password" value={f.pass} onChange={e=>u("pass",e.target.value)} placeholder={t(L,"choosePass")} style={inp}/></div>
        </div>
        <button onClick={()=>{if(!f.name.trim()||!f.email.trim()||!f.pass.trim()){setErr(t(L,"fillAll"));return;}setErr("");setStep(2);}}
          style={{width:"100%",marginTop:24,padding:16,background:GOLD_BG,border:"none",borderRadius:16,color:NAVY,fontWeight:800,fontSize:16,cursor:"pointer",boxShadow:"0 4px 20px rgba(232,184,75,0.35)"}}>
          {t(L,"continue")} →
        </button>
        <button onClick={()=>{setView("signin");setErr("");}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",fontSize:13,cursor:"pointer",marginTop:20,textAlign:"center"}}>
          {t(L,"haveAccount")}
        </button>
      </div>
    </div>
  );

  if(view==="signup"&&step===2) return (
    <div style={{minHeight:"100vh",background:DAWN_BG,maxWidth:500,margin:"0 auto",overflowY:"auto"}}>
      <div style={{padding:"44px 28px 60px"}}>
        <button style={back} onClick={()=>{setStep(1);setErr("");}}>← {t(L,"back")}</button>
        <div style={{color:"rgba(255,255,255,0.45)",fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{t(L,"step2")}</div>
        <div style={{color:WHITE,fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,marginBottom:4}}>{t(L,"golfProfile")}</div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:14,marginBottom:26}}>{t(L,"golfProfileSub")}</div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
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
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,20,40,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:WHITE,borderRadius:"24px 24px 0 0",padding:24,width:"100%",maxWidth:500,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
        <div style={{width:36,height:4,background:BORDER,borderRadius:2,margin:"0 auto 18px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700}}>{t(lang,"roundSummary")}</div>
          <button onClick={onClose} style={{background:OFF,border:"none",color:SLATE,fontSize:18,cursor:"pointer",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
        </div>
        {session.courseName&&<div style={{color:GREEN,fontWeight:600,fontSize:13,marginBottom:2}}>📍 {session.courseName}</div>}
        {session.feeling&&<div style={{color:SLATE_L,fontSize:12,marginBottom:12}}>{t(lang,"feel_"+session.feeling)}</div>}
        {session.notes&&<div style={{background:OFF,borderRadius:10,padding:"8px 12px",color:TEXT_S,fontSize:12,marginBottom:12,fontStyle:"italic"}}>"{session.notes}"</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
          {[[t(lang,"score"),tot+" ("+(diff>=0?"+":"")+diff+")"],[t(lang,"putts"),putts],["FIR",fir+"/"+firH.length],["GIR",gir+"/"+holes.length]].map(([l,v])=>(
            <div key={l} style={{background:OFF,borderRadius:12,padding:"11px 13px",textAlign:"center",border:"1px solid "+BORDER}}>
              <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>{l}</div>
              <div style={{color:NAVY,fontSize:20,fontWeight:700,fontFamily:"Georgia,serif"}}>{v}</div>
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

function ScorecardEntry({holeCount, onSave, onCancel, lang}){
  const [course,setCourse]=useState("");
  const [feeling,setFeeling]=useState("");
  const [notes,setNotes]=useState("");
  const [holes,setHoles]=useState(
    Array.from({length:holeCount},(_,i)=>({hole:i+1,par:4,score:4,putts:2,fir:false,gir:false,miss:""}))
  );
  function upd(i,k,v){ setHoles(p=>p.map((h,x)=>x===i?{...h,[k]:v}:h)); }
  const sel={width:"100%",background:OFF,border:"1.5px solid "+BORDER,borderRadius:10,color:TEXT,padding:"7px 8px",boxSizing:"border-box",fontSize:13,outline:"none"};
  return (
    <div>
      <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
        <div style={{marginBottom:12}}>
          <label style={{color:SLATE,fontSize:12,fontWeight:600,display:"block",marginBottom:5}}>{t(lang,"golfCourse")}</label>
          <input value={course} onChange={e=>setCourse(e.target.value)} placeholder={t(lang,"coursePh")} style={{width:"100%",background:OFF,border:"1.5px solid "+BORDER,borderRadius:12,color:TEXT,padding:"11px 14px",boxSizing:"border-box",fontSize:14,outline:"none",fontFamily:"inherit"}}/>
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
      <div style={{maxHeight:"50vh",overflowY:"auto",marginBottom:12}}>
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
        <button onClick={()=>onSave(holes,course,feeling,notes)} style={{flex:2,padding:13,background:GREEN_GRAD,border:"none",borderRadius:14,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:14,boxShadow:"0 3px 12px rgba(58,125,74,0.3)"}}>{t(lang,"saveRound")}</button>
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
    players.forEach(p=>{
      const total=totalFor(p);
      // Save per-station breakdown (in station order) so a future session can
      // reconstruct this attempt's cumulative climb for comparison.
      const stationScores=game.stations.map(st=>Number(p.scores[st.id])||0);
      onSave({type:"finisher", gameId:game.id, gameName:game.name, playerName:p.name, score:total, max:game.max, stationScores, multiplayer:players.length>1, isAccount:!!p.isAccount, ts:Date.now()+Math.random()});
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
                    <div style={{color:NAVY,fontSize:28,fontWeight:700,fontFamily:"Georgia,serif",lineHeight:1}}>{p.total}</div>
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

function TrainTab({sessions, onSave, settings, userId, accountName}){
  const [step,setStep]=useState("focus");
  const [focus,setFocus]=useState(null);
  const [dur,setDur]=useState(null);
  const [list,setList]=useState([]);
  const [ex,setEx]=useState(null);
  const [score,setScore]=useState("");
  const [plan,setPlan]=useState(()=>getPlan(userId));
  const [activeFinisher,setActiveFinisher]=useState(null);
  const units=settings?.units||"imperial";
  const lang=settings?.language||"en";

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
        <button onClick={()=>setStep("pick")} style={{background:"none",border:"none",color:fc.solid,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
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
          <button onClick={()=>{if(score===""||isNaN(+score))return;onSave({type:"train",focusId:focus.id,exId:ex.id,exName:ex.name,exEmoji:ex.emoji,exDiff:ex.difficulty,exPurpose:ex.purpose,exMax:ex.max,exLabel:ex.label,score:+score,ts:Date.now()});setStep("result");}}
            style={{width:"100%",marginTop:16,padding:15,background:GOLD_BG,border:"none",borderRadius:14,color:NAVY,fontWeight:800,cursor:"pointer",fontSize:15,boxShadow:"0 4px 16px rgba(232,184,75,0.4)"}}>
            {t(lang,"saveResult")} →
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
          <div style={{color:NAVY,fontSize:52,fontWeight:700,fontFamily:"Georgia,serif",lineHeight:1.1}}>{score}<span style={{fontSize:18,color:SLATE_L}}>/{ex.max}</span></div>
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
        <div style={{color:NAVY,fontSize:48,fontWeight:700,fontFamily:"Georgia,serif",lineHeight:1.1}}>{summary.tot}</div>
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

function ScoreTab({onSave, settings, sessions}){
  const [step,setStep]=useState("pick");
  const [n,setN]=useState(()=>settings?.holes||18);
  const [lastSaved,setLastSaved]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const lang=settings?.language||"en";
  useEffect(()=>{if(step==="pick")setN(settings?.holes||18);},[settings?.holes]);

  if(step==="saved"&&lastSaved) return (
    <>
      <RoundSavedScreen summary={lastSaved} lang={lang}
        onDone={()=>{setStep("pick");setLastSaved(null);}}
        onView={()=>setShowModal(true)}/>
      {showModal&&<ScorecardModal session={lastSaved.session} lang={lang} onClose={()=>{setShowModal(false);setStep("pick");setLastSaved(null);}}/>}
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
      {sessions.filter(s=>s.type==="round").length===0&&(
        <div style={{marginTop:20,background:GREEN_BG,borderRadius:14,padding:14,fontSize:13,color:GREEN,textAlign:"center"}}>
          {t(lang,"unlockStatsHint")}
        </div>
      )}
    </div>
  );
  return (
    <div>
      <button onClick={()=>setStep("pick")} style={{background:"none",border:"none",color:GREEN,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
      <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,marginBottom:16}}>{n}-{t(lang,"holes")}</div>
      <ScorecardEntry holeCount={n} lang={lang} onCancel={()=>setStep("pick")}
        onSave={(holes,course,feeling,notes)=>{
          const session={type:"round",holes,n,course,feeling,notes,ts:Date.now()};
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
  const ss=focus.sessions||[];
  const pcts=focus.pcts||[];
  const best=pcts.length?Math.max(...pcts):null;
  const worst=pcts.length?Math.min(...pcts):null;
  const recent=pcts.length>=2?pcts.slice(-5):pcts;
  // "Since start" = most recent vs the very first session ever in this area —
  // intentionally different from focus.trend (which is last-vs-previous), since
  // this screen is about overall progress, not just the latest change.
  const sinceStart = pcts.length>=2 ? pcts[pcts.length-1]-pcts[0] : null;

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
          <div style={{color:SLATE_L,fontSize:13,marginTop:2}}>{ss.length} {ss.length===1?t(lang,"sessionsCount"):t(lang,"sessionsCount2")}</div>
        </div>
      </div>

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
            {[[t(lang,"avgScore"),focus.avg+"%",NAVY],[t(lang,"best"),best+"%",GREEN],[t(lang,"worst"),worst+"%",RED]].map(([l,v,c])=>(
              <div key={l} style={{background:WHITE,borderRadius:14,padding:"12px 8px",textAlign:"center",border:"1px solid "+BORDER,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
                <div style={{color:SLATE_L,fontSize:9,textTransform:"uppercase",letterSpacing:1,fontWeight:700,marginBottom:2}}>{l}</div>
                <div style={{color:c,fontSize:20,fontWeight:700,fontFamily:"Georgia,serif"}}>{v}</div>
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

function StatsTab({sessions, lang, hdcp, onGoTrain, onGoScore}){
  const [selectedFocus,setSelectedFocus]=useState(null);
  const trains=sessions.filter(s=>s.type==="train");
  const rounds=sessions.filter(s=>s.type==="round");
  const allH=rounds.flatMap(r=>r.holes||[]);
  const streak=calcStreak(sessions);
  const byFocus=FOCUS_AREAS.map(f=>{
    const ss=trains.filter(s=>s.focusId===f.id).sort((a,b)=>a.ts-b.ts);
    const avg=ss.length?Math.round(ss.reduce((a,s)=>a+(s.score/s.exMax)*100,0)/ss.length):null;
    // Growth = most recent exercise vs the one right before it (not vs the very first ever).
    const lastP=ss.length?Math.round((ss[ss.length-1].score/ss[ss.length-1].exMax)*100):null;
    const prevP=ss.length>=2?Math.round((ss[ss.length-2].score/ss[ss.length-2].exMax)*100):null;
    const trend=(lastP!==null&&prevP!==null)?lastP-prevP:null;
    const pcts=ss.map(s=>Math.round((s.score/s.exMax)*100));
    return {...f,count:ss.length,avg,trend,pcts,sessions:ss};
  });

  if(selectedFocus){
    const f=byFocus.find(x=>x.id===selectedFocus);
    return <FocusAreaDetail focus={f} lang={lang} onBack={()=>setSelectedFocus(null)}/>;
  }
  const avgP=allH.length?(allH.reduce((a,h)=>a+(h.putts||0),0)/allH.length).toFixed(1):null;
  const girPct=allH.length?Math.round(allH.filter(h=>h.gir).length/allH.length*100):null;
  const firH=allH.filter(h=>h.par>3);
  const firPct=firH.length?Math.round(firH.filter(h=>h.fir).length/firH.length*100):null;
  const mc={left:0,right:0,short:0,long:0};
  allH.map(h=>h.miss).filter(Boolean).forEach(m=>{if(mc[m]!==undefined)mc[m]++;});
  const topM=Object.entries(mc).sort((a,b)=>b[1]-a[1])[0];
  const roundsChrono=[...rounds].sort((a,b)=>a.ts-b.ts);
  const scoreTrend=roundsChrono.slice(-6).map(r=>{
    const tot=(r.holes||[]).reduce((a,h)=>a+(h.score||0),0);
    const par=(r.holes||[]).reduce((a,h)=>a+(h.par||0),0);
    return tot-par;
  });

  // ── Handicap vs Actual Performance ───────────────────────────────────────
  // Simplified expected differential = handicap index (no slope/rating available).
  // We only show this once there's a numeric handicap AND at least 3 rounds logged,
  // since 1-2 rounds is too noisy to be a fair comparison.
  const hdcpNum = hdcp ? parseFloat(String(hdcp).replace(",",".")) : null;
  const hasValidHdcp = hdcpNum!==null && !isNaN(hdcpNum);
  const fullRoundDiffs = rounds.filter(r=>(r.holes||[]).length>=9).map(r=>{
    const tot=(r.holes||[]).reduce((a,h)=>a+(h.score||0),0);
    const par=(r.holes||[]).reduce((a,h)=>a+(h.par||0),0);
    return tot-par;
  });
  const actualAvgDiff = fullRoundDiffs.length>=3
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
            <div style={{color:NAVY,fontSize:20,fontWeight:700,fontFamily:"Georgia,serif",lineHeight:1}}>🔥{streak}</div>
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
              <div style={{color:NAVY,fontSize:24,fontWeight:700,fontFamily:"Georgia,serif"}}>{hdcpNum>=0?"+":""}{hdcpNum}</div>
            </div>
            <div style={{background:OFF,borderRadius:12,padding:"12px 14px",textAlign:"center",border:"1px solid "+BORDER}}>
              <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>{t(lang,"actualAvg")}</div>
              <div style={{color:NAVY,fontSize:24,fontWeight:700,fontFamily:"Georgia,serif"}}>{actualAvgDiff>=0?"+":""}{actualAvgDiff}</div>
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
      {rounds.length>0&&(
        <div style={{marginBottom:20}}>
          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"onCourse")}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[[t(lang,"avgPutts"),avgP||"—",t(lang,"perHole"),null],["GIR %",girPct!=null?girPct+"%":"—",t(lang,"greens"),null],["FIR %",firPct!=null?firPct+"%":"—",t(lang,"fairways"),null],[t(lang,"topMiss"),topM&&topM[1]>0?t(lang,topM[0]+"_dir"):"—",t(lang,"common"),topM&&topM[1]>0?RED:null]].map(([l,v,s,a])=>(
              <div key={l} style={{background:WHITE,borderRadius:16,padding:"14px 16px",textAlign:"center",border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
                <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:1,fontWeight:700,marginBottom:2}}>{l}</div>
                <div style={{color:a||NAVY,fontSize:24,fontWeight:700,fontFamily:"Georgia,serif"}}>{v}</div>
                <div style={{color:SLATE_L,fontSize:10,marginTop:1}}>{s}</div>
              </div>
            ))}
          </div>
          {scoreTrend.length>1&&(
            <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:4,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
              <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{t(lang,"scoreVsPar")} — {t(lang,"lastRounds")} {scoreTrend.length} {t(lang,"rounds")}</div>
              <div style={{color:SLATE_L,fontSize:10,marginBottom:10}}>{t(lang,"upMeansImproving")}</div>
              <Sparkline data={scoreTrend} color={NAVY} invert/>
              <div style={{display:"flex",justifyContent:"space-around",marginTop:10}}>
                {scoreTrend.map((v,i)=>(
                  <div key={i} style={{color:v<=0?GREEN:v<=5?AMBER:RED,fontWeight:700,fontSize:12,fontFamily:"Georgia,serif"}}>{v>=0?"+":""}{v}</div>
                ))}
              </div>
            </div>
          )}
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
                  {f.trend!==null&&<span style={{color:f.trend>=0?GREEN:RED,fontSize:12,fontWeight:700,background:f.trend>=0?GREEN_BG:"#fef0f0",borderRadius:8,padding:"2px 7px"}}>{f.trend>=0?"+":"-"}{Math.abs(f.trend)}%</span>}
                  <span style={{color:SLATE_L,fontSize:11}}>{f.count} {t(lang,"sessions")}</span>
                  <span style={{color:SLATE_L,fontSize:14}}>›</span>
                </div>
              </div>
              {f.count>0?(
                <>
                  <div style={{background:OFF,borderRadius:8,height:8,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:f.avg+"%",background:f.avg>=80?fc.grad:f.avg>=60?"linear-gradient(90deg,"+AMBER+",#fbbf24)":"linear-gradient(90deg,"+RED+",#f87171)",borderRadius:8}}/>
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
        {byFocus.some(f=>f.avg!==null)&&(
          <>
            <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,marginTop:4,fontWeight:700}}>{t(lang,"focusRec")}</div>
            <div style={{background:WHITE,borderRadius:16,padding:14,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
              {byFocus.filter(f=>f.avg!==null).sort((a,b)=>a.avg-b.avg).map((f,i,arr)=>(
                <div key={f.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<arr.length-1?"1px solid "+BORDER:"none"}}>
                  <span style={{fontSize:20}}>{f.emoji}</span>
                  <span style={{color:TEXT,flex:1,fontWeight:500,fontSize:13}}>{f.label}</span>
                  <span style={{color:f.avg>=80?GREEN:f.avg>=60?AMBER:RED,fontWeight:700,fontSize:13,fontFamily:"Georgia,serif"}}>{f.avg}%</span>
                  {i===0&&f.avg<80&&<span style={{color:WHITE,fontSize:10,background:RED,borderRadius:8,padding:"2px 8px",fontWeight:700}}>{t(lang,"focus")}</span>}
                  {f.avg>=80&&<span style={{color:WHITE,fontSize:10,background:GREEN,borderRadius:8,padding:"2px 8px",fontWeight:700}}>{t(lang,"strong")}</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {finisherSessions.length>0&&(
        <div style={{marginTop:20}}>
          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"finisherGames")}</div>
          {finisherByGame.filter(g=>g.count>0).map(g=>(
            <div key={g.id} style={{background:"linear-gradient(135deg,#fff8e6,#fef0d8)",borderRadius:16,padding:16,marginBottom:10,border:"1.5px solid "+GOLD+"55",boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{color:NAVY,fontWeight:700,fontSize:14}}>{g.emoji} {txFin(lang,g.id,"name",g.name)}</span>
                <span style={{color:SLATE_L,fontSize:11}}>{g.count} {g.count===1?t(lang,"sessionsCount"):t(lang,"sessionsCount2")}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{color:SLATE_L,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{t(lang,"best")}</div>
                  <div style={{color:GREEN,fontSize:22,fontWeight:700,fontFamily:"Georgia,serif"}}>{g.best}<span style={{fontSize:13,color:SLATE_L}}>/{g.max}</span></div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:SLATE_L,fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{t(lang,"last")}</div>
                  <div style={{color:NAVY,fontSize:22,fontWeight:700,fontFamily:"Georgia,serif"}}>{g.last}<span style={{fontSize:13,color:SLATE_L}}>/{g.max}</span></div>
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
  const [confirmDel,setConfirmDel]=useState(null);
  const sorted=[...sessions].sort((a,b)=>b.ts-a.ts);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:24,fontWeight:700}}>{t(lang,"history")}</div>
          <div style={{color:SLATE_L,fontSize:13,marginTop:3}}>{sessions.length} {sessions.length===1?t(lang,"sessionsCount"):t(lang,"sessionsCount2")}</div>
        </div>
        {sessions.length>0&&(
          <button onClick={()=>{if(window.confirm(t(lang,"confirmClear")))onClear();}}
            style={{background:WHITE,border:"1px solid "+RED+"44",color:RED,borderRadius:10,padding:"6px 12px",fontSize:11,cursor:"pointer",marginTop:4,fontWeight:600}}>
            {t(lang,"clearAll")}
          </button>
        )}
      </div>
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
              <div key={s.ts} style={{background:WHITE,borderRadius:16,padding:"14px 16px",border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{cursor:"pointer",flex:1}} onClick={()=>setModal(s)}>
                    <div style={{color:NAVY,fontWeight:700,fontSize:13,marginBottom:2}}>{s.n}-{t(lang,"holes")}</div>
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
            const pct=Math.round((s.score/s.max)*100);
            const grade=gradeFinisher(pct);
            return (
              <div key={s.ts} style={{background:"linear-gradient(135deg,#fff8e6,#fef0d8)",borderRadius:16,padding:"14px 16px",border:"1.5px solid "+GOLD+"55",boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{color:NAVY,fontWeight:700,fontSize:13,marginBottom:2}}>🏆 {txFin(lang,s.gameId,"name",s.gameName)}{s.multiplayer?" · "+s.playerName:""}</div>
                    <div style={{color:SLATE_L,fontSize:11}}>{fmt(s.ts)} · <span style={{color:grade.color,fontWeight:700}}>{grade.label}</span></div>
                  </div>
                  <div style={{textAlign:"right",display:"flex",alignItems:"center",gap:10}}>
                    <div>
                      <div style={{color:NAVY,fontWeight:700,fontSize:20,fontFamily:"Georgia,serif"}}>{s.score}</div>
                      <div style={{color:SLATE_L,fontSize:10}}>/{s.max} · {pct}%</div>
                    </div>
                    <button onClick={()=>setConfirmDel(s.ts)} style={{background:"none",border:"none",color:SLATE_L,cursor:"pointer",fontSize:16,padding:4}}>🗑</button>
                  </div>
                </div>
                {confirmDel===s.ts&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid "+GOLD+"33",display:"flex",gap:8,alignItems:"center"}}>
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
    </div>
  );
}

function PlayerTab({user, onSave, settings, onSaveSettings, onLogout}){
  const [sec,setSec]=useState("profile");
  const [f,setF]=useState({...user});
  const [saved,setSaved]=useState(false);
  const ref=useRef();
  const lang=settings?.language||"en";
  useEffect(()=>setF(u=>({...u,...user})),[user]);
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const ss=s=>onSaveSettings(s);
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
            <div><label style={lbl}>{t(lang,"email")}</label><input type="email" value={f.email||""} onChange={e=>u("email",e.target.value)} placeholder="you@example.com" style={inp}/></div>
            <div><label style={lbl}>{t(lang,"homeClub")}</label><input type="text" value={f.homeClub||""} onChange={e=>u("homeClub",e.target.value)} placeholder={t(lang,"homeClubPh")} style={inp}/></div>
            <div><label style={lbl}>{t(lang,"location")}</label><input type="text" value={f.location||""} onChange={e=>u("location",e.target.value)} placeholder={t(lang,"locationPh")} style={inp}/></div>
          </div>

          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"golfProfile")}</div>
          <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={lbl}>{t(lang,"handicapIndex")}</label>
              <HcpInput value={f.hdcp} onChange={v=>u("hdcp",v)}/>
              <div style={{color:SLATE_L,fontSize:11,marginTop:5}}>{t(lang,"handicapHelp")}</div>
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

          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"mainGoal")}</div>
          <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {GOAL_KEYS.map(k=>(
                <button key={k} onClick={()=>u("goal",k)}
                  style={{padding:"10px",background:f.goal===k?NAVY:WHITE,border:"1.5px solid "+(f.goal===k?NAVY:BORDER),borderRadius:12,color:f.goal===k?WHITE:TEXT_S,fontSize:12,cursor:"pointer",textAlign:"left",fontWeight:f.goal===k?700:400}}>
                  {f.goal===k?"✓ ":""}{t(lang,"goal_"+k)}
                </button>
              ))}
            </div>
          </div>

          <div style={{color:SLATE_L,fontSize:10,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontWeight:700}}>{t(lang,"weaknesses")}</div>
          <div style={{background:WHITE,borderRadius:16,padding:16,marginBottom:20,border:"1px solid "+BORDER,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {WEAK_KEYS.map(k=>{
                const sel2=(f.weaknesses||[]).includes(k);
                return (
                  <button key={k} onClick={()=>u("weaknesses",sel2?(f.weaknesses||[]).filter(x=>x!==k):[...(f.weaknesses||[]),k])}
                    style={{padding:"7px 14px",background:sel2?NAVY:WHITE,border:"1.5px solid "+(sel2?NAVY:BORDER),borderRadius:20,color:sel2?WHITE:TEXT_S,fontSize:12,cursor:"pointer",fontWeight:sel2?700:400}}>
                    {sel2?"✓ ":""}{t(lang,"weak_"+k)}
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={()=>{onSave({...f});setSaved(true);setTimeout(()=>setSaved(false),2000);}}
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
    case "train": // a flag-on-green target mark — practice, not a generic golfer
      return (<svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill={color}/></svg>);
    case "score": // a simple scorecard / clipboard
      return (<svg {...p}><rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 3.5V2.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="13" y2="13"/><line x1="8" y1="17" x2="11" y2="17"/></svg>);
    case "stats": // ascending bars — progress, not a generic chart emoji
      return (<svg {...p}><line x1="3" y1="20" x2="21" y2="20"/><rect x="6" y="13" width="3" height="7" rx="0.6"/><rect x="11" y="9" width="3" height="11" rx="0.6"/><rect x="16" y="5" width="3" height="15" rx="0.6"/></svg>);
    case "history": // a clock with a subtle backward arc, distinct from a plain emoji clock
      return (<svg {...p}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.5 2"/><path d="M4.5 7.5a8.5 8.5 0 0 1 2-2.6" strokeOpacity="0.5"/></svg>);
    case "player": // a minimalist person mark, not a literal head silhouette
      return (<svg {...p}><circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/></svg>);
    case "flagPin": // logo mark: pin in a circle, golf-specific but not the ⛳ emoji
      return (<svg {...p} strokeWidth={2}><line x1="7" y1="20" x2="7" y2="4"/><path d="M7 4.5 L16 7.5 L7 10.5 Z" fill={color} stroke="none"/></svg>);
    default: return null;
  }
}

const TABS=[
  {id:"train",icon:"train",labelKey:"train"},
  {id:"score",icon:"score",labelKey:"scorecard"},
  {id:"stats",icon:"stats",labelKey:"stats"},
  {id:"history",icon:"history",labelKey:"history"},
  {id:"player",icon:"player",labelKey:"player"},
];

export default function App(){
  const [user,setUser]=useState(()=>stor("caddy_cur",null));
  const [tab,setTab]=useState("train");
  const [sessions,setSessions]=useState(()=>user?stor("caddy_sess_"+user.id,[]):[]);
  const [settings,setSettings]=useState(()=>user?stor("caddy_settings_"+user.id,{...DEF_SETTINGS}):{...DEF_SETTINGS});
  const lang = settings?.language || "en";

  function login(u){ setUser(u); setSessions(stor("caddy_sess_"+u.id,[])); setSettings(stor("caddy_settings_"+u.id,{...DEF_SETTINGS})); }
  function logout(){ save("caddy_cur",null); setUser(null); setSessions([]); setSettings({...DEF_SETTINGS}); }
  function addSession(s){ const ns=[s,...sessions]; setSessions(ns); save("caddy_sess_"+user.id,ns); }
  function clearSessions(){ setSessions([]); save("caddy_sess_"+user.id,[]); }
  function deleteOne(ts){ const ns=sessions.filter(s=>s.ts!==ts); setSessions(ns); save("caddy_sess_"+user.id,ns); }
  function saveUser(u){ const users=stor("caddy_users",[]); const idx=users.findIndex(x=>x.id===u.id); if(idx>=0){users[idx]={...users[idx],...u};save("caddy_users",users);} setUser(u); save("caddy_cur",u); }
  function saveSettings(s){ setSettings(s); save("caddy_settings_"+user.id,s); }

  if(!user) return <AuthScreen onLogin={login}/>;

  return (
    <div style={{minHeight:"100vh",background:OFF,fontFamily:"'Inter',system-ui,sans-serif",color:TEXT,display:"flex",flexDirection:"column",maxWidth:500,margin:"0 auto"}}>
      <div style={{background:HEADER_BG,padding:"14px 20px 0",position:"sticky",top:0,zIndex:50,boxShadow:"0 2px 20px rgba(15,25,40,0.25)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,background:GOLD_BG,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(232,184,75,0.4)"}}>
              <Icon name="flagPin" size={19} color={NAVY}/>
            </div>
            <div>
              <div style={{color:WHITE,fontFamily:"Georgia,serif",fontWeight:700,fontSize:20,lineHeight:1}}>Caddy</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:9,letterSpacing:2.5,textTransform:"uppercase",marginTop:1}}>Golf Trainer</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setTab("player")}>
            <div style={{textAlign:"right"}}>
              <div style={{color:WHITE,fontSize:12,fontWeight:600}}>{(user.name||"Player").split(" ")[0]}</div>
              {user.hdcp&&<div style={{color:"rgba(255,255,255,0.4)",fontSize:10}}>HCP {user.hdcp}</div>}
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
        {tab==="train"&&<TrainTab sessions={sessions} onSave={addSession} settings={settings} userId={user.id} accountName={user.name}/>}
        {tab==="score"&&<ScoreTab onSave={addSession} settings={settings} sessions={sessions}/>}
        {tab==="stats"&&<StatsTab sessions={sessions} lang={lang} hdcp={user.hdcp} onGoTrain={()=>setTab("train")} onGoScore={()=>setTab("score")}/>}
        {tab==="history"&&<HistoryTab sessions={sessions} onClear={clearSessions} onDeleteOne={deleteOne} lang={lang}/>}
        {tab==="player"&&<PlayerTab user={user} onSave={saveUser} settings={settings} onSaveSettings={saveSettings} onLogout={logout}/>}
      </div>
    </div>
  );
}
