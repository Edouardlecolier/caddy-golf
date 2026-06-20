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
      {id:"sg1", name:"Tight Lie", emoji:"🪨", pattern:"bunker", desc:"From a tight, hardpan-style lie just off the green. 10 balls.", attempts:10, why:"Tight lies punish anyone who scoops at the ball — this station tests clean, ball-first contact under the least forgiving conditions."},
      {id:"sg2", name:"Rough", emoji:"🌿", pattern:"trouble", desc:"From thick rough around the green. 10 balls.", attempts:10, why:"Grass grabs the clubface in rough, so distance control here depends on reading the lie correctly before you commit to the shot."},
      {id:"sg3", name:"Bunker", emoji:"🏖️", pattern:"bunker", desc:"From a greenside bunker. 10 balls.", attempts:10, why:"Sand technique is about hitting the sand, not the ball — this station isolates that one skill under real scoring pressure."},
      {id:"sg4", name:"Long Pitch", emoji:"📡", pattern:"wedge", desc:"A longer pitch shot, roughly 25-30m to the green. 10 balls.", attempts:10, why:"A longer pitch demands full tempo at a controlled length — most misses here come from rushing rather than poor technique."},
      {id:"sg5", name:"Short Chip", emoji:"📌", pattern:"towel", desc:"A short chip from just off the green, under 10m. 10 balls.", attempts:10, why:"Short chips are the highest-frequency shot in real rounds — small errors here cost the most strokes over a season."},
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
  const [img,setImg]=useState(null);
  const [failed,setFailed]=useState(false);
  const [loading,setLoading]=useState(true);
  const cacheKey="caddy_photo_v1_"+exercise.id;

  useEffect(()=>{
    let cancelled=false;
    try{
      const cached=sessionStorage.getItem(cacheKey);
      if(cached){ setImg(cached); setLoading(false); return; }
    }catch(e){}

    // The AI image endpoint is only reachable inside Claude's artifact sandbox,
    // which proxies the request. In a standalone deployment (Vercel, etc.) there
    // is no proxy and no API key exposed client-side — calling it would just
    // fail every time after a network round trip. Skip straight to the diagram.
    const hasArtifactProxy = typeof window!=="undefined" && window.location.hostname.includes("claude");
    if(!hasArtifactProxy){
      setFailed(true);
      setLoading(false);
      return;
    }

    (async()=>{
      try{
        const prompt = "A photo-realistic image of a golf training drill setup: \""+exercise.name+"\". "+exercise.desc+" "+
          "Show the actual physical setup on a real golf course or practice green — golf balls, tees, flag, or terrain as needed. "+
          "Bright natural daylight, shot from a player's eye-level perspective looking down the target line. No text, no overlays, no people's faces. Clean, instructional, magazine-quality golf photography.";
        const res=await fetch("https://api.anthropic.com/v1/messages",{
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            model:"claude-sonnet-4-6", max_tokens:1024,
            messages:[{role:"user", content:prompt}]
          })
        });
        if(!res.ok) throw new Error("bad response");
        const data=await res.json();
        // Look for an image block in the response; if the model/tooling here can't
        // produce one, this will simply not find image content and we fall back.
        const imgBlock = data?.content?.find(b=>b.type==="image");
        if(!imgBlock || !imgBlock.source?.data){ throw new Error("no image returned"); }
        const dataUrl = "data:"+(imgBlock.source.media_type||"image/png")+";base64,"+imgBlock.source.data;
        if(!cancelled){
          try{ sessionStorage.setItem(cacheKey, dataUrl); }catch(e){}
          setImg(dataUrl);
        }
      }catch(e){
        if(!cancelled) setFailed(true);
      }finally{
        if(!cancelled) setLoading(false);
      }
    })();
    return ()=>{ cancelled=true; };
  },[exercise.id]);

  if(loading) return (
    <div style={{height:180,background:"linear-gradient(135deg,#eef3ea,#e4ece6)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+BORDER}}>
      <div style={{width:28,height:28,border:"3px solid "+BORDER,borderTopColor:GREEN,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
  if(img && !failed) return (
    <img src={img} alt={exercise.name} style={{width:"100%",height:180,objectFit:"cover",display:"block",borderRadius:16}}/>
  );
  // Reliable fallback — never show a broken state to the user.
  return <ExerciseDiagram pattern={pattern}/>;
}

function ExerciseDiagram({pattern}){
  const common = {viewBox:"0 0 320 160", style:{width:"100%",height:"auto",display:"block"}};
  const ball = (cx,cy,r=6) => <circle cx={cx} cy={cy} r={r} fill={WHITE} stroke={NAVY} strokeWidth="1.5"/>;
  const tee = (x,y) => <rect x={x-1.5} y={y-10} width="3" height="14" fill={NAVY} rx="1"/>;
  const flag = (x,y) => (<g><line x1={x} y1={y} x2={x} y2={y-30} stroke={NAVY} strokeWidth="2"/><path d={"M"+x+" "+(y-30)+" L"+(x+18)+" "+(y-24)+" L"+x+" "+(y-18)+" Z"} fill={GOLD}/></g>);
  const green = <ellipse cx="160" cy="120" rx="140" ry="32" fill="#cfe8d8"/>;

  if(pattern==="gate"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#f0f7f2"/>
        {green}
        {ball(60,120)}
        {tee(95,118)}{tee(95,130)}
        <path d="M70 120 Q 130 90 230 60" stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" fill="none"/>
        {flag(250,55)}
      </svg>
    );
  }
  if(pattern==="circle"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#f0f7f2"/>
        {green}
        {flag(160,90)}
        {[0,1,2,3,4,5,6,7].map(i=>{
          const a=(i/8)*2*Math.PI;
          return <g key={i}>{ball(160+Math.cos(a)*36, 95+Math.sin(a)*14)}</g>;
        })}
      </svg>
    );
  }
  if(pattern==="ladder"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#f0f7f2"/>
        {green}
        {ball(40,130)}
        {[1,2,3,4].map(i=>(
          <g key={i}>
            <circle cx={70+i*55} cy={118-i*4} r="5" fill="none" stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 2"/>
          </g>
        ))}
        <path d="M48 128 L 280 90" stroke={NAVY} strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.4"/>
      </svg>
    );
  }
  if(pattern==="towel"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#f0f7f2"/>
        {green}
        {ball(50,128)}
        <rect x="190" y="100" width="36" height="20" fill={GOLD} opacity="0.35" rx="3"/>
        <rect x="190" y="100" width="36" height="20" fill="none" stroke={GOLD} strokeWidth="1.5" rx="3"/>
        <path d="M58 126 Q 140 70 208 105" stroke={NAVY} strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.5"/>
      </svg>
    );
  }
  if(pattern==="bunker"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#f0f7f2"/>
        {green}
        <ellipse cx="70" cy="130" rx="46" ry="20" fill="#e8dcb8"/>
        {ball(70,128,5)}
        {flag(220,95)}
        <path d="M75 122 Q 140 60 210 90" stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" fill="none"/>
      </svg>
    );
  }
  if(pattern==="fairway"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#eaf3ec"/>
        <path d="M120 10 L200 10 L260 150 L60 150 Z" fill="#cfe8d8"/>
        {tee(160,140)}
        <path d="M160 138 L 170 20" stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" fill="none"/>
        <circle cx="170" cy="20" r="6" fill={WHITE} stroke={NAVY} strokeWidth="1.5"/>
      </svg>
    );
  }
  if(pattern==="grid"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#f0f7f2"/>
        {green}
        {flag(230,60)}
        {[[-18,-10],[14,-4],[-6,10],[20,14],[-22,4],[8,-16]].map((d,i)=>(
          <g key={i}>{ball(230+d[0],60+d[1]+30,4)}</g>
        ))}
      </svg>
    );
  }
  if(pattern==="pressure"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#f0f7f2"/>
        {green}
        {ball(110,118)}
        {flag(165,108)}
        <circle cx="165" cy="120" r="22" fill="none" stroke={RED} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
        <path d="M118 117 Q 140 100 158 113" stroke={NAVY} strokeWidth="1.5" strokeDasharray="3 3" fill="none"/>
      </svg>
    );
  }
  if(pattern==="balance"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#eaf3ec"/>
        <ellipse cx="160" cy="135" rx="60" ry="14" fill="#cfe8d8"/>
        <circle cx="140" cy="125" r="4" fill={NAVY}/>
        <circle cx="180" cy="125" r="4" fill={NAVY}/>
        {ball(160,108,6)}
        <line x1="160" y1="60" x2="160" y2="100" stroke={NAVY} strokeWidth="2"/>
      </svg>
    );
  }
  if(pattern==="wedge"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#eaf3ec"/>
        <ellipse cx="270" cy="130" rx="40" ry="18" fill="#cfe8d8"/>
        {tee(60,135)}
        {[0.5,0.75,1].map((s,i)=>(
          <path key={i} d={"M60 130 Q "+(120+i*40)+" "+(40-i*10)+" "+(180+i*60)+" 120"} stroke={GOLD} strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity={0.4+i*0.3}/>
        ))}
      </svg>
    );
  }
  if(pattern==="trouble"){
    return (
      <svg {...common}>
        <rect width="320" height="160" fill="#eaf3ec"/>
        <ellipse cx="250" cy="130" rx="50" ry="18" fill="#cfe8d8"/>
        <circle cx="140" cy="70" r="22" fill="#3a7d4a" opacity="0.25"/>
        <circle cx="150" cy="60" r="16" fill="#3a7d4a" opacity="0.3"/>
        {tee(70,135)}
        <path d="M70 130 Q 110 90 250 120" stroke={GOLD} strokeWidth="2" strokeDasharray="4 4" fill="none"/>
      </svg>
    );
  }
  // routine / mental / generic fallback
  return (
    <svg {...common}>
      <rect width="320" height="160" fill="#f4f0fa"/>
      <circle cx="160" cy="80" r="36" fill={PURPLE} opacity="0.12"/>
      <circle cx="160" cy="80" r="20" fill={PURPLE} opacity="0.22"/>
      <circle cx="160" cy="80" r="6" fill={PURPLE}/>
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
    copied:"Copied to clipboard", shareResult:"Share Result", howWhy:"How & Why",
    noSessionsYetTap:"No sessions yet — tap to see what's here", noSessionsYet:"No sessions yet", noSessionsYetDesc:"Train this area to start building your progress history here.",
    avgScore:"Avg Score", worst:"Lowest", evolution:"Evolution", sinceStart:"since start", needMoreSessions:"Complete one more session to see your trend.",
    exercisesPracticed:"Exercises Practiced", allSessions:"All Sessions",
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
    copied:"Copie dans le presse-papiers", shareResult:"Partager le resultat", howWhy:"Comment et pourquoi",
    noSessionsYetTap:"Aucune session encore — touchez pour voir", noSessionsYet:"Aucune session encore", noSessionsYetDesc:"Entrainez ce domaine pour commencer a suivre vos progres ici.",
    avgScore:"Score moyen", worst:"Plus bas", evolution:"Evolution", sinceStart:"depuis le debut", needMoreSessions:"Completez une session de plus pour voir votre tendance.",
    exercisesPracticed:"Exercices pratiques", allSessions:"Toutes les sessions",
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
    copied:"Copiado al portapapeles", shareResult:"Compartir resultado", howWhy:"Como y por que",
    noSessionsYetTap:"Sin sesiones aun — toca para ver", noSessionsYet:"Sin sesiones aun", noSessionsYetDesc:"Entrena esta area para empezar a registrar tu progreso aqui.",
    avgScore:"Puntuacion media", worst:"Mas bajo", evolution:"Evolucion", sinceStart:"desde el inicio", needMoreSessions:"Completa una sesion mas para ver tu tendencia.",
    exercisesPracticed:"Ejercicios practicados", allSessions:"Todas las sesiones",
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
    copied:"In die Zwischenablage kopiert", shareResult:"Ergebnis teilen", howWhy:"Wie & Warum",
    noSessionsYetTap:"Noch keine Einheiten — tippen zum Ansehen", noSessionsYet:"Noch keine Einheiten", noSessionsYetDesc:"Trainiere diesen Bereich, um hier deinen Fortschritt aufzubauen.",
    avgScore:"Durchschnitt", worst:"Niedrigster", evolution:"Entwicklung", sinceStart:"seit Beginn", needMoreSessions:"Schliesse eine weitere Einheit ab, um deinen Trend zu sehen.",
    exercisesPracticed:"Geuebte Uebungen", allSessions:"Alle Einheiten",
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
    copied:"Copiato negli appunti", shareResult:"Condividi risultato", howWhy:"Come e perche",
    noSessionsYetTap:"Nessuna sessione ancora — tocca per vedere", noSessionsYet:"Nessuna sessione ancora", noSessionsYetDesc:"Allena quest'area per iniziare a costruire i tuoi progressi qui.",
    avgScore:"Punteggio medio", worst:"Piu basso", evolution:"Evoluzione", sinceStart:"dall'inizio", needMoreSessions:"Completa un'altra sessione per vedere il tuo andamento.",
    exercisesPracticed:"Esercizi praticati", allSessions:"Tutte le sessioni",
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
    copied:"Copiado para a area de transferencia", shareResult:"Compartilhar resultado", howWhy:"Como e por que",
    noSessionsYetTap:"Ainda sem sessoes — toque para ver", noSessionsYet:"Ainda sem sessoes", noSessionsYetDesc:"Treine esta area para comecar a registrar seu progresso aqui.",
    avgScore:"Pontuacao media", worst:"Mais baixo", evolution:"Evolucao", sinceStart:"desde o inicio", needMoreSessions:"Complete mais uma sessao para ver sua tendencia.",
    exercisesPracticed:"Exercicios praticados", allSessions:"Todas as sessoes",
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

function Sparkline({data, color, h=36}){
  if(!data||data.length<2) return null;
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const W=180, H=h;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*W},${H-((v-mn)/rng)*(H-6)+3}`).join(" ");
  return (
    <svg viewBox={"0 0 "+W+" "+H} style={{width:"100%",height:h,display:"block"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((v,i)=>(
        <circle key={i} cx={(i/(data.length-1))*W} cy={H-((v-mn)/rng)*(H-6)+3} r="3" fill={color} stroke={WHITE} strokeWidth="1.5"/>
      ))}
    </svg>
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
function FinisherGame({game, onSave, onExit, lang, accountName}){
  const [mode,setMode]=useState("setup"); // setup | playing | results
  const [players,setPlayers]=useState([{name:accountName||"Player 1", scores:{}, isAccount:true}]);
  const [activePlayer,setActivePlayer]=useState(0);
  const [stationIdx,setStationIdx]=useState(0);

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
      onSave({type:"finisher", gameId:game.id, gameName:game.name, playerName:p.name, score:total, max:game.max, multiplayer:players.length>1, isAccount:!!p.isAccount, ts:Date.now()+Math.random()});
    });
    setMode("results");
  }

  const station = game.stations[stationIdx];
  const isMulti = players.length>1;

  if(mode==="setup") return (
    <div>
      <button onClick={onExit} style={{background:"none",border:"none",color:GREEN,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
        <div style={{fontSize:30}}>{game.emoji}</div>
        <div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:20,fontWeight:700}}>{game.name}</div>
          <div style={{color:SLATE_L,fontSize:12}}>{t(lang,"outOf")} {game.max}</div>
        </div>
      </div>
      <p style={{color:TEXT_S,fontSize:13,lineHeight:1.6,margin:"10px 0 18px"}}>{game.intro}</p>

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
        <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
          {players.map((p,i)=>(
            <button key={i} onClick={()=>setActivePlayer(i)}
              style={{padding:"7px 13px",background:activePlayer===i?NAVY:WHITE,border:"1.5px solid "+(activePlayer===i?NAVY:BORDER),borderRadius:20,color:activePlayer===i?WHITE:TEXT_S,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {game.stations.map((s,i)=>(
          <div key={s.id} onClick={()=>setStationIdx(i)}
            style={{flex:1,height:6,borderRadius:4,background:i===stationIdx?GOLD:(players[activePlayer].scores[s.id]!==undefined?GREEN:BORDER),cursor:"pointer"}}/>
        ))}
      </div>

      <div style={{borderRadius:16,marginBottom:14,border:"1px solid "+BORDER,overflow:"hidden"}}>
        <ExercisePhoto exercise={{id:"finisher_"+game.id+"_"+station.id, name:station.name, desc:station.desc}} pattern={station.pattern||"generic"}/>
      </div>
      <div style={{background:WHITE,borderRadius:18,padding:18,marginBottom:14,border:"1px solid "+BORDER,boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:42,height:42,background:GREEN_BG,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{station.emoji}</div>
          <div>
            <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:17,fontWeight:700}}>{station.name}</div>
            <div style={{color:SLATE_L,fontSize:11}}>{t(lang,"station")} {stationIdx+1} {t(lang,"outOf")} {game.stations.length}</div>
          </div>
        </div>
        <p style={{color:TEXT_S,fontSize:13,lineHeight:1.6,margin:"0 0 10px"}}>{station.desc}</p>
        {station.why&&(
          <div style={{background:OFF,borderRadius:12,padding:"10px 14px",marginBottom:10,border:"1px solid "+BORDER}}>
            <div style={{color:SLATE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{t(lang,"howWhy")}</div>
            <div style={{color:TEXT_S,fontSize:12,lineHeight:1.6}}>{station.why}</div>
          </div>
        )}
        {game.scoringNote&&<div style={{color:SLATE_L,fontSize:11,fontStyle:"italic",marginBottom:4}}>{game.scoringNote}</div>}
      </div>

      <div style={{background:HEADER_BG,borderRadius:18,padding:18}}>
        <label style={{color:"rgba(255,255,255,0.6)",fontSize:12,display:"block",marginBottom:10,fontWeight:600}}>
          {isMulti?players[activePlayer].name+" — ":""}{t(lang,"scoreForStation")} ({t(lang,"outOf")} {station.max})
        </label>
        <ScoreStepper value={String(players[activePlayer].scores[station.id]??"")} max={station.max}
          onChange={v=>setScore(activePlayer,station.id,v)}/>
        <div style={{display:"flex",gap:10,marginTop:14}}>
          {stationIdx>0&&(
            <button onClick={()=>setStationIdx(stationIdx-1)} style={{flex:1,padding:13,background:"rgba(255,255,255,0.12)",border:"1.5px solid rgba(255,255,255,0.25)",borderRadius:12,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:13}}>
            ← {t(lang,"prevStation")}
            </button>
          )}
          {stationIdx<game.stations.length-1?(
            <button onClick={()=>setStationIdx(stationIdx+1)} style={{flex:2,padding:13,background:GOLD_BG,border:"none",borderRadius:12,color:NAVY,fontWeight:800,cursor:"pointer",fontSize:13}}>
              {t(lang,"nextStation")} →
            </button>
          ):(
            <button onClick={finishGame} style={{flex:2,padding:13,background:GOLD_BG,border:"none",borderRadius:12,color:NAVY,fontWeight:800,cursor:"pointer",fontSize:13}}>
              {t(lang,"finishGame")} 🏆
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if(mode==="results"){
    const ranked=[...players].map(p=>({...p,total:totalFor(p)})).sort((a,b)=>b.total-a.total);
    return (
      <div>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:48,marginBottom:8}}>{game.emoji}</div>
          <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>{game.name}</div>
          <div style={{color:SLATE_L,fontSize:12,marginTop:2}}>{game.resultLabel}</div>
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
        <ShareResultButton lang={lang} title={game.name}
          text={ranked.map((p,i)=>(i+1)+". "+p.name+" — "+p.total+"/"+game.max).join("\n")}/>
        <button onClick={onExit} style={{width:"100%",marginTop:10,padding:14,background:HEADER_BG,border:"none",borderRadius:14,color:WHITE,fontWeight:700,cursor:"pointer",fontSize:14}}>
          {t(lang,"done")}
        </button>
      </div>
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
                <span style={{color:NAVY,fontWeight:700,fontSize:13}}>{ex.emoji} {ex.name}</span>
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
                    <div style={{color:NAVY,fontWeight:700,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.exName}</div>
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

  function pastFor(id){ return sessions.filter(s=>s.type==="train"&&s.exId===id); }

  if(step==="plan") return (
    <PlanBuilder plan={plan} onSavePlan={updatePlan} lang={lang} onClose={()=>setStep("focus")} onStartItem={startPlanItem}/>
  );

  if(step==="finisherPlay"&&activeFinisher) return (
    <FinisherGame game={activeFinisher} lang={lang} accountName={accountName}
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
            <div style={{color:WHITE,fontWeight:700,fontSize:14}}>{plan[0].exName}</div>
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
            <div style={{color:NAVY,fontWeight:700,fontSize:11,lineHeight:1.3}}>{g.name.replace(" Finisher","")}</div>
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
            <button key={f.id} onClick={()=>{setFocus(f);setStep("dur");}}
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

  if(step==="dur") {
    const fc=focusColors(focus.id);
    return (
    <div>
      <button onClick={()=>setStep("focus")} style={{background:"none",border:"none",color:fc.solid,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
      <div style={{marginBottom:18}}>
        <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:22,fontWeight:700}}>{focus.emoji} {focus.label}</div>
        <div style={{color:SLATE_L,fontSize:13,marginTop:3}}>{t(lang,"howLong")}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {DURATIONS.filter(d=>EXERCISES[focus.id].some(e=>e.duration<=d)).map(d=>(
          <button key={d} onClick={()=>{setDur(d);const p=EXERCISES[focus.id].filter(e=>e.duration<=d);setList(p.length?p:EXERCISES[focus.id]);setStep("pick");}}
            style={{padding:"16px 8px",background:WHITE,border:"1.5px solid "+BORDER,borderRadius:14,color:NAVY,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
            {d<60?d:d/60+"h"}
            <div style={{color:SLATE_L,fontSize:10,fontWeight:400,marginTop:2,fontFamily:"inherit"}}>{d<60?t(lang,"min"):t(lang,"hour")}</div>
          </button>
        ))}
      </div>
    </div>
  );}

  if(step==="pick") {
    const fc=focusColors(focus.id);
    return (
    <div>
      <button onClick={()=>setStep("dur")} style={{background:"none",border:"none",color:fc.solid,cursor:"pointer",fontSize:13,padding:"0 0 14px",fontWeight:700}}>← {t(lang,"back")}</button>
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
                <span style={{color:NAVY,fontWeight:700,fontSize:14}}>{e.emoji} {e.name}</span>
                <span style={{background:bgD,color:txD,fontSize:10,fontWeight:700,borderRadius:20,padding:"2px 9px",marginLeft:8,whiteSpace:"nowrap"}}>{t(lang,"diff_"+e.difficulty)}</span>
              </div>
              <div style={{color:fc.solid,fontSize:12,marginBottom:4,fontWeight:500}}>💡 {e.purpose}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:SLATE_L,fontSize:11}}>⏱ {e.duration} {t(lang,"min")}</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {trend!==null&&(
                    <span style={{color:trend>=0?GREEN:RED,fontSize:11,fontWeight:700}}>{trend>=0?"▲":"▼"}{Math.abs(trend)}%</span>
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
            <div style={{color:NAVY,fontFamily:"Georgia,serif",fontSize:19,fontWeight:700,flex:1}}>{ex.name}</div>
            <span style={{background:bgD,color:txD,fontSize:11,fontWeight:700,borderRadius:20,padding:"3px 10px",marginLeft:10,whiteSpace:"nowrap"}}>{t(lang,"diff_"+ex.difficulty)}</span>
          </div>
          <div style={{background:fc.bg,borderRadius:12,padding:"10px 14px",marginBottom:10,border:"1px solid "+BORDER}}>
            <div style={{color:fc.solid,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{t(lang,"purpose")}</div>
            <div style={{color:NAVY,fontSize:13,fontWeight:600}}>{ex.purpose}</div>
          </div>
          <p style={{color:TEXT_S,fontSize:13,lineHeight:1.65,margin:"0 0 10px"}}>{cvt(ex.desc,units)}</p>
          {guide.why&&(
            <div style={{background:OFF,borderRadius:12,padding:"10px 14px",marginBottom:10,border:"1px solid "+BORDER}}>
              <div style={{color:SLATE,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{t(lang,"howWhy")}</div>
              <div style={{color:TEXT_S,fontSize:12,lineHeight:1.6}}>{guide.why}</div>
            </div>
          )}
          <div style={{color:SLATE_L,fontSize:12}}>⏱ {ex.duration} {t(lang,"min")}</div>
        </div>
        {pcts.length>1&&(
          <div style={{background:WHITE,borderRadius:16,padding:14,marginBottom:14,border:"1px solid "+BORDER}}>
            <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{t(lang,"yourHistory")}</div>
            <Sparkline data={pcts} color={fc.solid}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <span style={{color:SLATE_L,fontSize:11}}>{t(lang,"first")}: {pcts[0]}%</span>
              <span style={{color:fc.solid,fontSize:11,fontWeight:700}}>{t(lang,"best")}: {Math.max(...pcts)}%</span>
              <span style={{color:NAVY,fontSize:11,fontWeight:700}}>{t(lang,"last")}: {pcts[pcts.length-1]}%</span>
            </div>
          </div>
        )}
        <div style={{background:HEADER_BG,borderRadius:20,padding:20,boxShadow:"0 4px 20px rgba(26,47,74,0.2)"}}>
          <label style={{color:"rgba(255,255,255,0.6)",fontSize:12,display:"block",marginBottom:10,fontWeight:600}}>
            {ex.label} ({t(lang,"outOf")} {ex.max})
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
        <div style={{color:SLATE_L,fontSize:13,marginBottom:20}}>{ex.name}</div>
        <div style={{background:WHITE,borderRadius:20,padding:22,marginBottom:16,border:"1px solid "+BORDER,boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
          <div style={{color:SLATE_L,fontSize:11,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>{t(lang,"yourScore")}</div>
          <div style={{color:NAVY,fontSize:52,fontWeight:700,fontFamily:"Georgia,serif",lineHeight:1.1}}>{score}<span style={{fontSize:18,color:SLATE_L}}>/{ex.max}</span></div>
          <div style={{color:gColor,fontSize:20,fontWeight:700,marginBottom:6}}>{pct}%</div>
          {trend!==null&&(
            <div style={{color:trend>=0?GREEN:RED,fontSize:13,fontWeight:600,background:trend>=0?GREEN_BG:"#fef0f0",borderRadius:8,padding:"4px 12px",display:"inline-block"}}>
              {trend>=0?"▲":"▼"} {Math.abs(trend)}% {t(lang,"vsLast")}
            </div>
          )}
        </div>
        <div style={{background:"linear-gradient(135deg,#e8f5ec,#f0f7f2)",borderRadius:14,padding:14,marginBottom:14,border:"1px solid #d4edda",textAlign:"left"}}>
          <div style={{color:GREEN,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{t(lang,"whyMatters")}</div>
          <div style={{color:NAVY,fontSize:13,fontWeight:500}}>{ex.purpose}</div>
        </div>
        <div style={{marginBottom:10}}>
          <ShareResultButton lang={lang} title={ex.name} text={"Caddy — "+ex.name+": "+score+"/"+ex.max+" ("+pct+"%)"}/>
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

  // Group sessions by exercise to show which drills were practiced most
  const byExercise={};
  ss.forEach(s=>{
    if(!byExercise[s.exId]) byExercise[s.exId]={name:s.exName, emoji:s.exEmoji, count:0, scores:[]};
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
              {focus.trend!==null&&(
                <span style={{color:focus.trend>=0?GREEN:RED,fontSize:12,fontWeight:700,background:focus.trend>=0?GREEN_BG:"#fef0f0",borderRadius:8,padding:"3px 9px"}}>
                  {focus.trend>=0?"▲":"▼"} {Math.abs(focus.trend)}% {t(lang,"sinceStart")}
                </span>
              )}
            </div>
            {pcts.length>1 ? (
              <>
                <Sparkline data={pcts} color={fc.solid} h={70}/>
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
                      <span style={{color:TEXT,flex:1,fontWeight:500,fontSize:13}}>{e.name}</span>
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
                      <span style={{color:NAVY,fontWeight:700,fontSize:13}}>{s.exEmoji} {s.exName}</span>
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
    const ss=trains.filter(s=>s.focusId===f.id);
    const avg=ss.length?Math.round(ss.reduce((a,s)=>a+(s.score/s.exMax)*100,0)/ss.length):null;
    const trend=ss.length>=2?Math.round((ss[ss.length-1].score/ss[ss.length-1].exMax)*100)-Math.round((ss[0].score/ss[0].exMax)*100):null;
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
  const scoreTrend=rounds.slice(-6).map(r=>{
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
              <div style={{color:NAVY,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>{t(lang,"scoreVsPar")} — {t(lang,"lastRounds")} {scoreTrend.length} {t(lang,"rounds")}</div>
              <Sparkline data={scoreTrend} color={NAVY}/>
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
                  {f.trend!==null&&<span style={{color:f.trend>=0?GREEN:RED,fontSize:12,fontWeight:700,background:f.trend>=0?GREEN_BG:"#fef0f0",borderRadius:8,padding:"2px 7px"}}>{f.trend>=0?"▲":"▼"}{Math.abs(f.trend)}%</span>}
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
                    {f.pcts.length>1&&<div style={{width:80}}><Sparkline data={f.pcts} color={fc.solid} h={20}/></div>}
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
                <span style={{color:NAVY,fontWeight:700,fontSize:14}}>{g.emoji} {g.name}</span>
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
                {g.pcts.length>1&&<div style={{width:90}}><Sparkline data={g.pcts} color="#b8860a" h={26}/></div>}
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
                      <span style={{color:NAVY,fontWeight:700,fontSize:13}}>{s.exEmoji} {s.exName}</span>
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
                    <div style={{color:NAVY,fontWeight:700,fontSize:13,marginBottom:2}}>🏆 {s.gameName}{s.multiplayer?" · "+s.playerName:""}</div>
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
