import "./style.css";

/*
===========================================================
DRAGON 7 SYSTEM B ANALYZER
TypeScript / Vite / Browser Application
===========================================================

SYSTEM B:

4,5,6,7  = -1
8,9       = +2
Everything else = 0

8 decks = 416 cards

Group 1 = 128 cards
Group 2 = 64 cards
Group 3 = 224 cards

Balanced IRC:

128(-1) + 64(+2) + 224(0) = 0

===========================================================
*/

type Group = "g1" | "g2" | "g3";

const INITIAL = {
  g1: 128,
  g2: 64,
  g3: 224
};

interface ShoeState {

  shoeNumber: number;

  handNumber: number;

  cutCard: number;

  rem: {
    g1: number;
    g2: number;
    g3: number;
  };

  rc: number;

  highestTC: number;

  lowestTC: number;

  d7Hits: number;

  triggerOpps: number;

  bets: number;

  wins: number;

  losses: number;
}


/*
===========================================================
CREATE NEW SHOE
===========================================================
*/

let state: ShoeState =
  newShoe(1);


function newShoe(
  shoeNumber: number
): ShoeState {

  return {

    shoeNumber,

    handNumber: 1,

    cutCard:
      randInt(60, 75),

    rem: {
      ...INITIAL
    },

    rc: 0,

    highestTC: 0,

    lowestTC: 0,

    d7Hits: 0,

    triggerOpps: 0,

    bets: 0,

    wins: 0,

    losses: 0

  };
}


/*
===========================================================
UTILITY
===========================================================
*/

function randInt(
  min: number,
  max: number
): number {

  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;
}


function $<T extends HTMLElement>(
  id: string
): T {

  return document.getElementById(
    id
  ) as T;
}


/*
===========================================================
SHOE CALCULATIONS
===========================================================
*/

function totalCards(
  s: ShoeState
): number {

  return (
    s.rem.g1 +
    s.rem.g2 +
    s.rem.g3
  );
}


function decksRemaining(
  s: ShoeState
): number {

  return Math.max(
    0.1,

    Math.round(
      (totalCards(s) / 52) * 100
    ) / 100
  );
}


function trueCount(
  s: ShoeState
): number {

  return Math.round(
    (
      s.rc /
      decksRemaining(s)
    ) * 100
  ) / 100;
}


function penetration(
  s: ShoeState
): number {

  return Math.round(
    (
      ((416 - totalCards(s)) / 416) *
      100
    ) * 10
  ) / 10;
}


/*
===========================================================
SYSTEM B ACTION ZONE
===========================================================
*/

function zone(
  tc: number
): string {

  if (tc < 4) {

    return "No Bet";

  }

  if (tc < 5) {

    return "Break-even (+4)";

  }

  if (tc < 6) {

    return "Small Bet (+5)";

  }

  if (tc < 7) {

    return "Primary Trigger (+6)";

  }

  if (tc < 8) {

    return "Strong Trigger (+7)";

  }

  return "Max Bet (+8+)";
}


/*
===========================================================
LIVE CARD TRACKING
===========================================================
*/

function track(
  group: Group
): void {

  if (
    state.rem[group] <= 0
  ) {

    return;

  }

  state.rem[group]--;

  if (group === "g1") {

    state.rc--;

  }

  else if (group === "g2") {

    state.rc += 2;

  }

  /*
  Group 3 = tag zero.
  */

  update();
}


/*
===========================================================
LIVE HAND RESOLUTION
===========================================================
*/

function resolveHand(
  isD7: boolean
): void {

  const tc =
    trueCount(state);


  /*
  Opportunity threshold
  */

  if (tc >= 4) {

    state.triggerOpps++;

  }


  /*
  Primary betting threshold
  */

  if (tc >= 6) {

    state.bets++;

    if (isD7) {

      state.wins++;

    }

    else {

      state.losses++;

    }

  }


  if (isD7) {

    state.d7Hits++;

  }


  state.handNumber++;


  /*
  Cut-card condition
  */

  if (
    totalCards(state) <=
    state.cutCard
  ) {

    alert(
      `Cut card reached at ` +
      `${totalCards(state)} cards remaining.\n\n` +
      `Starting a new shoe.`
    );

    state =
      newShoe(
        state.shoeNumber + 1
      );

  }


  update();
}


/*
===========================================================
RESET SHOE
===========================================================
*/

function resetShoe(): void {

  state =
    newShoe(
      state.shoeNumber + 1
    );

  update();
}


/*
===========================================================
EXPECTED EOR
===========================================================
*/

function expected(
  group: Group
): number {

  return Math.round(

    INITIAL[group] *
    (
      totalCards(state) /
      416
    ) *
    10

  ) / 10;
}


function deviationText(
  group: Group
): string {

  const dev =
    state.rem[group] -
    expected(group);

  const sign =
    dev >= 0
      ? "+"
      : "";

  let status =
    "Neutral";

  if (dev > 0) {

    status = "Surplus";

  }

  else if (dev < 0) {

    status = "Deficit";

  }

  return (
    `${sign}${dev.toFixed(1)} ` +
    `${status}`
  );
}


/*
===========================================================
UPDATE LIVE DASHBOARD
===========================================================
*/

function update(): void {

  const tc =
    trueCount(state);


  /*
  Basic shoe information
  */

  $("shoe").textContent =
    String(state.shoeNumber);

  $("hand").textContent =
    String(state.handNumber);

  $("cards").textContent =
    String(totalCards(state));

  $("decks").textContent =
    decksRemaining(state)
      .toFixed(2);

  $("pen").textContent =
    `${penetration(state).toFixed(1)}%`;

  /*
  Count
  */

  $("rc").textContent =
    String(state.rc);

  $("tc").textContent =
    tc.toFixed(2);

  state.highestTC =
    Math.max(
      state.highestTC,
      tc
    );

  state.lowestTC =
    Math.min(
      state.lowestTC,
      tc
    );

  $("highTC").textContent =
    state.highestTC
      .toFixed(2);

  $("lowTC").textContent =
    state.lowestTC
      .toFixed(2);


  /*
  EV Zone
  */

  $("zone").textContent =
    `Dragon 7 EV Zone: ${zone(tc)}`;


  /*
  Dragon 7
  */

  $("d7").textContent =
    String(state.d7Hits);


  const resolvedHands =
    Math.max(
      1,
      state.handNumber - 1
    );


  $("d7freq").textContent =
    (
      state.d7Hits /
      resolvedHands *
      100
    ).toFixed(2) + "%";


  $("triggers").textContent =
    String(
      state.triggerOpps
    );


  $("bets").textContent =
    `${state.bets} / ` +
    `${state.wins} / ` +
    `${state.losses}`;


  /*
  EOR
  */

  const rows = [

    [
      "4-7 (Tag -1)",
      state.rem.g1,
      expected("g1"),
      deviationText("g1")
    ],

    [
      "8-9 (Tag +2)",
      state.rem.g2,
      expected("g2"),
      deviationText("g2")
    ],

    [
      "A,2,3,10,J,Q,K (Tag 0)",
      state.rem.g3,
      expected("g3"),
      deviationText("g3")
    ]

  ];


  $("eorBody").innerHTML =
    rows
      .map(row => `

        <tr>

          <td>${row[0]}</td>

          <td>${row[1]}</td>

          <td>
            ${Number(row[2]).toFixed(1)}
          </td>

          <td>${row[3]}</td>

        </tr>

      `)
      .join("");
}


/*
===========================================================
CREATE 8-DECK SHOE
===========================================================
*/

function makeShoe(): number[] {

  const ranks: number[] = [];


  for (
    let deck = 0;
    deck < 8;
    deck++
  ) {

    for (
      let suit = 0;
      suit < 4;
      suit++
    ) {

      for (
        let rank = 1;
        rank <= 13;
        rank++
      ) {

        ranks.push(rank);

      }

    }

  }


  /*
  Fisher-Yates shuffle
  */

  for (
    let i = ranks.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      ranks[i],
      ranks[j]
    ] = [
      ranks[j],
      ranks[i]
    ];

  }


  return ranks;
}


/*
===========================================================
SYSTEM B CARD TAG
===========================================================
*/

function tag(
  card: number
): number {

  if (
    [4, 5, 6, 7]
      .includes(card)
  ) {

    return -1;

  }


  if (
    [8, 9]
      .includes(card)
  ) {

    return +2;

  }


  return 0;
}


/*
===========================================================
BACCARAT CARD VALUE
===========================================================
*/

function value(
  card: number
): number {

  if (card >= 10) {

    return 0;

  }

  return card;
}


/*
===========================================================
DRAW CARD
===========================================================
*/

function draw(
  deck: number[],
  rcRef: {
    value: number
  }
): number {

  const card =
    deck.pop();


  if (
    card === undefined
  ) {

    return 0;

  }


  rcRef.value +=
    tag(card);


  return value(card);
}


/*
===========================================================
SIMULATE ONE FINITE SHOE
===========================================================
*/

function simulateOneShoe() {

  const deck =
    makeShoe();


  const cutCard =
    randInt(60, 75);


  const rcRef = {
    value: 0
  };


  let hands = 0;

  let d7 = 0;

  let trigger = 0;

  let bets = 0;

  let wins = 0;

  let losses = 0;


  let maxTC =
    -Infinity;

  let minTC =
    Infinity;


  const penHands =
    [0, 0, 0, 0, 0];

  const penTriggers =
    [0, 0, 0, 0, 0];


  /*
  =========================================================
  DEAL SHOE
  =========================================================
  */

  while (
    deck.length >
    cutCard
  ) {

    /*
    True count BEFORE hand
    */

    const remDecks =
      Math.max(
        0.1,

        Math.round(
          deck.length /
          52 *
          100
        ) / 100
      );


    const tc =
      Math.round(
        (
          rcRef.value /
          remDecks
        ) * 100
      ) / 100;


    maxTC =
      Math.max(
        maxTC,
        tc
      );

    minTC =
      Math.min(
        minTC,
        tc
      );


    /*
    Penetration
    */

    const pen =
      (
        (416 - deck.length) /
        416
      ) * 100;


    let penIndex = -1;


    if (pen < 20) {

      penIndex = 0;

    }

    else if (pen < 40) {

      penIndex = 1;

    }

    else if (pen < 60) {

      penIndex = 2;

    }

    else if (pen < 80) {

      penIndex = 3;

    }

    else if (pen <= 95) {

      penIndex = 4;

    }


    if (
      penIndex >= 0
    ) {

      penHands[penIndex]++;


      if (tc >= 6) {

        penTriggers[penIndex]++;

      }

    }


    /*
    Opportunity
    */

    if (tc >= 4) {

      trigger++;

    }


    /*
    Primary trigger
    */

    const active =
      tc >= 6;


    if (active) {

      bets++;

    }


    /*
    =======================================================
    BACCARAT DEAL
    =======================================================
    */

    const p1 =
      draw(
        deck,
        rcRef
      );

    const b1 =
      draw(
        deck,
        rcRef
      );

    const p2 =
      draw(
        deck,
        rcRef
      );

    const b2 =
      draw(
        deck,
        rcRef
      );


    let pTotal =
      (p1 + p2) % 10;


    let bTotal =
      (b1 + b2) % 10;


    let playerThird:
      number | null = null;


    let bankerThird:
      number | null = null;


    /*
    Natural
    */

    if (
      pTotal >= 8 ||
      bTotal >= 8
    ) {

      /*
      No third card.
      */

    }

    else {

      /*
      Player rule
      */

      if (
        pTotal <= 5
      ) {

        playerThird =
          draw(
            deck,
            rcRef
          );


        pTotal =
          (
            pTotal +
            playerThird
          ) % 10;

      }


      /*
      Banker rule
      */

      let bankerDraw =
        false;


      /*
      Player stood
      */

      if (
        playerThird === null
      ) {

        bankerDraw =
          bTotal <= 5;

      }


      /*
      Player drew
      */

      else {

        const p3 =
          playerThird;


        if (
          bTotal <= 2
        ) {

          bankerDraw = true;

        }

        else if (
          bTotal === 3 &&
          p3 !== 8
        ) {

          bankerDraw = true;

        }

        else if (
          bTotal === 4 &&
          [2,3,4,5,6,7]
            .includes(p3)
        ) {

          bankerDraw = true;

        }

        else if (
          bTotal === 5 &&
          [4,5,6,7]
            .includes(p3)
        ) {

          bankerDraw = true;

        }

        else if (
          bTotal === 6 &&
          [6,7]
            .includes(p3)
        ) {

          bankerDraw = true;

        }

      }


      /*
      Banker draws
      */

      if (bankerDraw) {

        bankerThird =
          draw(
            deck,
            rcRef
          );


        bTotal =
          (
            bTotal +
            bankerThird
          ) % 10;

      }

    }


    /*
    =======================================================
    DRAGON 7
    =======================================================

    Banker must:

    1. Receive third card
    2. Finish on 7
    */

    const isD7 =
      bankerThird !== null &&
      bTotal === 7;


    hands++;


    if (isD7) {

      d7++;

    }


    /*
    Betting result
    */

    if (active) {

      if (isD7) {

        wins++;

      }

      else {

        losses++;

      }

    }

  }


  return {

    hands,

    d7,

    trigger,

    bets,

    wins,

    losses,

    maxTC,

    minTC,

    penHands,

    penTriggers

  };

}


/*
===========================================================
SIMULATE MANY SHOES
===========================================================
*/

function simulate(
  shoes: number
) {

  let hands = 0;

  let d7 = 0;

  let trigger = 0;

  let bets = 0;

  let wins = 0;

  let losses = 0;


  let maxTC =
    -Infinity;

  let minTC =
    Infinity;


  const penHands =
    [0,0,0,0,0];

  const penTriggers =
    [0,0,0,0,0];


  /*
  =========================================================
  RUN SHOES
  =========================================================
  */

  for (
    let i = 0;
    i < shoes;
    i++
  ) {

    const result =
      simulateOneShoe();


    hands +=
      result.hands;

    d7 +=
      result.d7;

    trigger +=
      result.trigger;

    bets +=
      result.bets;

    wins +=
      result.wins;

    losses +=
      result.losses;


    maxTC =
      Math.max(
        maxTC,
        result.maxTC
      );


    minTC =
      Math.min(
        minTC,
        result.minTC
      );


    result.penHands
      .forEach(
        (value, index) => {

          penHands[index] +=
            value;

        }
      );


    result.penTriggers
      .forEach(
        (value, index) => {

          penTriggers[index] +=
            value;

        }
      );

  }


  const density =
    penHands.map(
      (hands, index) => {

        if (!hands) {

          return 0;

        }

        return (
          penTriggers[index] /
          hands
        ) * 100;

      }
    );


  return {

    shoes,

    hands,

    d7,

    trigger,

    bets,

    wins,

    losses,

    maxTC,

    minTC,

    penHands,

    penTriggers,

    density

  };

}


/*
===========================================================
GENERATE SIMULATION REPORT
===========================================================
*/

function generateReport(
  r: ReturnType<
    typeof simulate
  >
): string {

  const d7Freq =
    r.d7 /
    r.hands *
    100;


  const betFreq =
    r.bets /
    r.hands *
    100;


  const winRate =
    r.bets
      ? r.wins /
        r.bets *
        100
      : 0;


  const accuracy =
    r.d7
      ? r.wins /
        r.d7 *
        100
      : 0;


  const positiveFreq =
    r.trigger /
    r.hands *
    100;


  const zones = [

    "0-20%",

    "20-40%",

    "40-60%",

    "60-80%",

    "80-95%"

  ];


  const bestIndex =
    r.density.indexOf(
      Math.max(
        ...r.density
      )
    );


  const worstIndex =
    r.density.indexOf(
      Math.min(
        ...r.density
      )
    );


  return `

=======================================================================
SYSTEM B MASTER ENGINE FINITE SIMULATION REPORT
=======================================================================

[Shoe Sample]

Total Shoes Simulated
: ${r.shoes.toLocaleString()}

Total Valid Hands
: ${r.hands.toLocaleString()}

Average Hands / Shoe
: ${(r.hands / r.shoes).toFixed(1)}


[Dragon 7 Structural Event]

Total Dragon 7 Hits
: ${r.d7.toLocaleString()}

Observed Dragon 7 Frequency
: ${d7Freq.toFixed(3)}%


[System B Count]

Initial Running Count
: 0

Maximum True Count
: ${r.maxTC.toFixed(2)}

Minimum True Count
: ${r.minTC.toFixed(2)}


[Opportunity Trigger]

TC >= +4 Hands
: ${r.trigger.toLocaleString()}

Opportunity Frequency
: ${positiveFreq.toFixed(2)}%


[Primary Betting Trigger]

TC >= +6 Hands
: ${r.bets.toLocaleString()}

Bet Frequency
: ${betFreq.toFixed(2)}%


[Strategy Performance]

Dragon 7 Wins
: ${r.wins.toLocaleString()}

Losses
: ${r.losses.toLocaleString()}

Strategy Win Rate
: ${winRate.toFixed(2)}%

D7 Capture Accuracy
: ${accuracy.toFixed(2)}%


=======================================================================
SHOE PENETRATION ANALYSIS
=======================================================================

Range       | Hands              | TC >= +6
-----------------------------------------------------------------------
0-20%       | ${r.penHands[0]
    .toLocaleString()
    .padEnd(18)} | ${r.density[0].toFixed(2)}%

20-40%      | ${r.penHands[1]
    .toLocaleString()
    .padEnd(18)} | ${r.density[1].toFixed(2)}%

40-60%      | ${r.penHands[2]
    .toLocaleString()
    .padEnd(18)} | ${r.density[2].toFixed(2)}%

60-80%      | ${r.penHands[3]
    .toLocaleString()
    .padEnd(18)} | ${r.density[3].toFixed(2)}%

80-95%      | ${r.penHands[4]
    .toLocaleString()
    .padEnd(18)} | ${r.density[4].toFixed(2)}%


Highest Trigger Density
: ${zones[bestIndex]}

Lowest Trigger Density
: ${zones[worstIndex]}


=======================================================================
SYSTEM B MATHEMATICAL STRUCTURE
=======================================================================

Group 1:
4,5,6,7 = -1
128 cards

Group 2:
8,9 = +2
64 cards

Group 3:
A,2,3,10,J,Q,K = 0
224 cards


Balanced IRC:

128(-1) + 64(+2) + 224(0)
= 0


True Count:

TC = Running Count / Decks Remaining


Primary Trigger:

TC >= +6


Opportunity Trigger:

TC >= +4


=======================================================================
IMPORTANT
=======================================================================

This program performs finite random-shoe simulation.

It does NOT guarantee positive expected value.

A positive count or structural deviation does not automatically
mean that Dragon 7 has a positive betting EV.

Actual conditional EV should be calculated from the remaining
card composition and the exact Dragon 7 payoff/rules.

=======================================================================
END SYSTEM B REPORT
=======================================================================
`;
}


/*
===========================================================
BUILD HTML APPLICATION
===========================================================
*/

function renderApp(): void {

  $("app").innerHTML = `

<div class="app">

<header>

<h1>
Dragon 7 System B Analyzer
</h1>

<p>
Finite 8-deck shoe • System B Count • Cross-Platform Web Application
<br><br>
Developed by: Long Nguyen 
</p>

</header>


<div class="tabs">

<button
class="tab active"
id="liveTab">

Live Shoe Dashboard

</button>


<button
class="tab"
id="simTab">

Simulation Engine

</button>

</div>



<!-- =====================================================
LIVE PANEL
===================================================== -->

<section
class="panel"
id="livePanel">

<div class="dashboard">


<!-- LEFT -->

<div class="left">


<div class="card">

<h2>
Card Input — System B
</h2>


<div class="button-stack">


<button
class="tag-g1"
id="g1">

Track Card:

4, 5, 6, 7

(Tag -1)

</button>


<button
class="tag-g2"
id="g2">

Track Card:

8, 9

(Tag +2)

</button>


<button
class="tag-g3"
id="g3">

Track Card:

A, 2, 3, 10, J, Q, K

(Tag 0)

</button>


</div>

</div>



<div class="card">

<h2>
Live Hand Outcome
</h2>


<div class="button-stack">


<button
class="outcome-win"
id="d7win">

Register Dragon 7 WIN

</button>


<button
class="outcome-loss"
id="d7loss">

Register Dragon 7 LOSS

</button>


<button
class="outcome-normal"
id="normal">

Normal Hand

</button>


</div>

</div>



<div class="card">

<h2>
Shoe Controls
</h2>


<button
id="reset">

Reset / New Shoe

</button>

</div>



<div class="notice">

<strong>Training / Educational Tool</strong>
<br><br>

This software is intended for TRAINING and EDUCATIONAL 
purposes ONLY.
<br><br>
It MUST NOT be used at real casino tables, 
in live gambling environments
or in any way that violates local laws, regulations,
or casino rules.
<br><br>
Users must take responsibility for their own risks.
<br><br>
This application simulates finite shoe 
composition and System B counting.

It does not guarantee a positive casino
edge or future results.

</div>


</div>



<!-- RIGHT -->

<div class="right">


<div class="card">

<h2>
Shoe Information
</h2>


<div class="stats">


<div class="stat">

<div class="label">
Shoe
</div>

<div
class="value"
id="shoe">

1

</div>

</div>



<div class="stat">

<div class="label">
Hand
</div>

<div
class="value"
id="hand">

1

</div>

</div>



<div class="stat">

<div class="label">
Cards Remaining
</div>

<div
class="value"
id="cards">

416

</div>

</div>



<div class="stat">

<div class="label">
Decks Remaining
</div>

<div
class="value"
id="decks">

8.00

</div>

</div>



<div class="stat">

<div class="label">
Penetration
</div>

<div
class="value"
id="pen">

0.0%

</div>

</div>


</div>

</div>



<div class="card">

<h2>
Count Statistics
</h2>


<div class="stats">


<div class="stat">

<div class="label">
Running Count
</div>

<div
class="value"
id="rc">

0

</div>

</div>



<div class="stat">

<div class="label">
True Count
</div>

<div
class="value tc"
id="tc">

0.00

</div>

</div>



<div class="stat">

<div class="label">
Highest TC
</div>

<div
class="value"
id="highTC">

0.00

</div>

</div>



<div class="stat">

<div class="label">
Lowest TC
</div>

<div
class="value"
id="lowTC">

0.00

</div>

</div>


</div>


<div
class="zone"
id="zone">

Dragon 7 EV Zone:
No Bet

</div>


</div>



<div class="card">

<h2>
Real-Time EOR Composition
</h2>


<table>

<thead>

<tr>

<th>
Card Group
</th>

<th>
Remaining
</th>

<th>
Expected
</th>

<th>
Deviation
</th>

</tr>

</thead>


<tbody
id="eorBody">

</tbody>

</table>


</div>



<div class="card">

<h2>
Dragon 7 Statistics
</h2>


<div class="stats">


<div class="stat">

<div class="label">
Dragon 7 Hits
</div>

<div
class="value"
id="d7">

0

</div>

</div>



<div class="stat">

<div class="label">
D7 Frequency
</div>

<div
class="value"
id="d7freq">

0.00%

</div>

</div>



<div class="stat">

<div class="label">
TC >= +4 Opportunities
</div>

<div
class="value"
id="triggers">

0

</div>

</div>



<div class="stat">

<div class="label">
Bets / Wins / Losses
</div>

<div
class="value"
id="bets">

0 / 0 / 0

</div>

</div>


</div>

</div>


</div>

</div>

</section>



<!-- =====================================================
SIMULATION PANEL
===================================================== -->

<section
class="panel hidden"
id="simPanel">


<div class="card">

<h2>
Finite Simulation Engine
</h2>


<div class="sim-controls">


<label>
Shoes:
</label>


<select
id="simCount">

<option>
100
</option>

<option>
500
</option>

<option selected>
1000
</option>

<option>
5000
</option>

<option>
10000
</option>

<option>
100000
</option>

</select>


<button
class="primary"
id="runSim">

Run System B Shoe Engine

</button>


<span
id="status">

Status: Idle

</span>


</div>


<pre
class="report"
id="report">

System B Finite Engine Master Log Framework.

Select the number of shoes and run the simulation.

</pre>


</div>

</section>


<div class="footer-note">

Dragon 7 System B Analyzer •
TypeScript •
Finite 8-Deck Simulation

</div>


</div>

`;

}


/*
===========================================================
EVENT HANDLERS
===========================================================
*/

function setupEvents(): void {


  /*
  Card buttons
  */

  $("g1").onclick =
    () => track("g1");


  $("g2").onclick =
    () => track("g2");


  $("g3").onclick =
    () => track("g3");


  /*
  D7 WIN
  */

  $("d7win").onclick =
    () => {

      resolveHand(true);

    };


  /*
  D7 LOSS
  */

  $("d7loss").onclick =
    () => {

      resolveHand(false);

    };


  /*
  Normal hand
  */

  $("normal").onclick =
    () => {

      resolveHand(false);

    };


  /*
  Reset
  */

  $("reset").onclick =
    resetShoe;


  /*
  Live tab
  */

  $("liveTab").onclick =
    () => {

      $("livePanel")
        .classList
        .remove("hidden");


      $("simPanel")
        .classList
        .add("hidden");


      $("liveTab")
        .classList
        .add("active");


      $("simTab")
        .classList
        .remove("active");

    };


  /*
  Simulation tab
  */

  $("simTab").onclick =
    () => {

      $("livePanel")
        .classList
        .add("hidden");


      $("simPanel")
        .classList
        .remove("hidden");


      $("simTab")
        .classList
        .add("active");


      $("liveTab")
        .classList
        .remove("active");

    };


  /*
  Run simulation
  */

  $("runSim").onclick = () => {

      const select = $("simCount") as HTMLSelectElement;

      const shoes = Number(select.value);

      const button = $("runSim") as HTMLButtonElement;

      const status = $("status");

      button.disabled = true;


      status.textContent =
        `Running ${
          shoes.toLocaleString()
        } shoes...`;


      /*
      Give browser UI time to update
      */

      setTimeout(
        () => {

          const result =
            simulate(shoes);


          $("report")
            .textContent =
            generateReport(
              result
            );


          status.textContent =
            "Simulation Analysis Complete";


          button.disabled =
            false;

        },

        20

      );

    };

}


/*
===========================================================
START APPLICATION
===========================================================
*/

renderApp();

setupEvents();

update();
