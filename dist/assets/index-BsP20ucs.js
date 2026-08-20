(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const d of o)if(d.type==="childList")for(const l of d.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function s(o){const d={};return o.integrity&&(d.integrity=o.integrity),o.referrerPolicy&&(d.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?d.credentials="include":o.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function a(o){if(o.ep)return;o.ep=!0;const d=s(o);fetch(o.href,d)}})();const k={g1:128,g2:64,g3:224};let e=R(1);function R(t){return{shoeNumber:t,handNumber:1,cutCard:A(60,75),rem:{...k},rc:0,highestTC:0,lowestTC:0,d7Hits:0,triggerOpps:0,bets:0,wins:0,losses:0}}function A(t,n){return Math.floor(Math.random()*(n-t+1))+t}function i(t){return document.getElementById(t)}function S(t){return t.rem.g1+t.rem.g2+t.rem.g3}function D(t){return Math.max(.1,Math.round(S(t)/52*100)/100)}function B(t){return Math.round(t.rc/D(t)*100)/100}function U(t){return Math.round((416-S(t))/416*100*10)/10}function V(t){return t<4?"No Bet":t<5?"Break-even (+4)":t<6?"Small Bet (+5)":t<7?"Primary Trigger (+6)":t<8?"Strong Trigger (+7)":"Max Bet (+8+)"}function N(t){e.rem[t]<=0||(e.rem[t]--,t==="g1"?e.rc--:t==="g2"&&(e.rc+=2),I())}function F(t){const n=B(e);n>=4&&e.triggerOpps++,n>=6&&(e.bets++,t?e.wins++:e.losses++),t&&e.d7Hits++,e.handNumber++,S(e)<=e.cutCard&&(alert(`Cut card reached at ${S(e)} cards remaining.

Starting a new shoe.`),e=R(e.shoeNumber+1)),I()}function W(){e=R(e.shoeNumber+1),I()}function $(t){return Math.round(k[t]*(S(e)/416)*10)/10}function w(t){const n=e.rem[t]-$(t),s=n>=0?"+":"";let a="Neutral";return n>0?a="Surplus":n<0&&(a="Deficit"),`${s}${n.toFixed(1)} ${a}`}function I(){const t=B(e);i("shoe").textContent=String(e.shoeNumber),i("hand").textContent=String(e.handNumber),i("cards").textContent=String(S(e)),i("decks").textContent=D(e).toFixed(2),i("pen").textContent=`${U(e).toFixed(1)}%`,i("rc").textContent=String(e.rc),i("tc").textContent=t.toFixed(2),e.highestTC=Math.max(e.highestTC,t),e.lowestTC=Math.min(e.lowestTC,t),i("highTC").textContent=e.highestTC.toFixed(2),i("lowTC").textContent=e.lowestTC.toFixed(2),i("zone").textContent=`Dragon 7 EV Zone: ${V(t)}`,i("d7").textContent=String(e.d7Hits);const n=Math.max(1,e.handNumber-1);i("d7freq").textContent=(e.d7Hits/n*100).toFixed(2)+"%",i("triggers").textContent=String(e.triggerOpps),i("bets").textContent=`${e.bets} / ${e.wins} / ${e.losses}`;const s=[["4-7 (Tag -1)",e.rem.g1,$("g1"),w("g1")],["8-9 (Tag +2)",e.rem.g2,$("g2"),w("g2")],["A,2,3,10,J,Q,K (Tag 0)",e.rem.g3,$("g3"),w("g3")]];i("eorBody").innerHTML=s.map(a=>`

        <tr>

          <td>${a[0]}</td>

          <td>${a[1]}</td>

          <td>
            ${Number(a[2]).toFixed(1)}
          </td>

          <td>${a[3]}</td>

        </tr>

      `).join("")}function Y(){const t=[];for(let n=0;n<8;n++)for(let s=0;s<4;s++)for(let a=1;a<=13;a++)t.push(a);for(let n=t.length-1;n>0;n--){const s=Math.floor(Math.random()*(n+1));[t[n],t[s]]=[t[s],t[n]]}return t}function K(t){return[4,5,6,7].includes(t)?-1:[8,9].includes(t)?2:0}function J(t){return t>=10?0:t}function C(t,n){const s=t.pop();return s===void 0?0:(n.value+=K(s),J(s))}function Q(){const t=Y(),n=A(60,75),s={value:0};let a=0,o=0,d=0,l=0,g=0,h=0,p=-1/0,b=1/0;const y=[0,0,0,0,0],m=[0,0,0,0,0];for(;t.length>n;){const r=Math.max(.1,Math.round(t.length/52*100)/100),u=Math.round(s.value/r*100)/100;p=Math.max(p,u),b=Math.min(b,u);const v=(416-t.length)/416*100;let f=-1;v<20?f=0:v<40?f=1:v<60?f=2:v<80?f=3:v<=95&&(f=4),f>=0&&(y[f]++,u>=6&&m[f]++),u>=4&&d++;const H=u>=6;H&&l++;const P=C(t,s),q=C(t,s),z=C(t,s),G=C(t,s);let x=(P+z)%10,c=(q+G)%10,L=null,M=null;if(!(x>=8||c>=8)){x<=5&&(L=C(t,s),x=(x+L)%10);let T=!1;if(L===null)T=c<=5;else{const E=L;(c<=2||c===3&&E!==8||c===4&&[2,3,4,5,6,7].includes(E)||c===5&&[4,5,6,7].includes(E)||c===6&&[6,7].includes(E))&&(T=!0)}T&&(M=C(t,s),c=(c+M)%10)}const O=M!==null&&c===7;a++,O&&o++,H&&(O?g++:h++)}return{hands:a,d7:o,trigger:d,bets:l,wins:g,losses:h,maxTC:p,minTC:b,penHands:y,penTriggers:m}}function j(t){let n=0,s=0,a=0,o=0,d=0,l=0,g=-1/0,h=1/0;const p=[0,0,0,0,0],b=[0,0,0,0,0];for(let m=0;m<t;m++){const r=Q();n+=r.hands,s+=r.d7,a+=r.trigger,o+=r.bets,d+=r.wins,l+=r.losses,g=Math.max(g,r.maxTC),h=Math.min(h,r.minTC),r.penHands.forEach((u,v)=>{p[v]+=u}),r.penTriggers.forEach((u,v)=>{b[v]+=u})}const y=p.map((m,r)=>m?b[r]/m*100:0);return{shoes:t,hands:n,d7:s,trigger:a,bets:o,wins:d,losses:l,maxTC:g,minTC:h,penHands:p,penTriggers:b,density:y}}function Z(t){const n=t.d7/t.hands*100,s=t.bets/t.hands*100,a=t.bets?t.wins/t.bets*100:0,o=t.d7?t.wins/t.d7*100:0,d=t.trigger/t.hands*100,l=["0-20%","20-40%","40-60%","60-80%","80-95%"],g=t.density.indexOf(Math.max(...t.density)),h=t.density.indexOf(Math.min(...t.density));return`

=======================================================================
SYSTEM B MASTER ENGINE FINITE SIMULATION REPORT
=======================================================================

[Shoe Sample]

Total Shoes Simulated
: ${t.shoes.toLocaleString()}

Total Valid Hands
: ${t.hands.toLocaleString()}

Average Hands / Shoe
: ${(t.hands/t.shoes).toFixed(1)}


[Dragon 7 Structural Event]

Total Dragon 7 Hits
: ${t.d7.toLocaleString()}

Observed Dragon 7 Frequency
: ${n.toFixed(3)}%


[System B Count]

Initial Running Count
: 0

Maximum True Count
: ${t.maxTC.toFixed(2)}

Minimum True Count
: ${t.minTC.toFixed(2)}


[Opportunity Trigger]

TC >= +4 Hands
: ${t.trigger.toLocaleString()}

Opportunity Frequency
: ${d.toFixed(2)}%


[Primary Betting Trigger]

TC >= +6 Hands
: ${t.bets.toLocaleString()}

Bet Frequency
: ${s.toFixed(2)}%


[Strategy Performance]

Dragon 7 Wins
: ${t.wins.toLocaleString()}

Losses
: ${t.losses.toLocaleString()}

Strategy Win Rate
: ${a.toFixed(2)}%

D7 Capture Accuracy
: ${o.toFixed(2)}%


=======================================================================
SHOE PENETRATION ANALYSIS
=======================================================================

Range       | Hands              | TC >= +6
-----------------------------------------------------------------------
0-20%       | ${t.penHands[0].toLocaleString().padEnd(18)} | ${t.density[0].toFixed(2)}%

20-40%      | ${t.penHands[1].toLocaleString().padEnd(18)} | ${t.density[1].toFixed(2)}%

40-60%      | ${t.penHands[2].toLocaleString().padEnd(18)} | ${t.density[2].toFixed(2)}%

60-80%      | ${t.penHands[3].toLocaleString().padEnd(18)} | ${t.density[3].toFixed(2)}%

80-95%      | ${t.penHands[4].toLocaleString().padEnd(18)} | ${t.density[4].toFixed(2)}%


Highest Trigger Density
: ${l[g]}

Lowest Trigger Density
: ${l[h]}


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
`}function X(){i("app").innerHTML=`

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

`}function _(){i("g1").onclick=()=>N("g1"),i("g2").onclick=()=>N("g2"),i("g3").onclick=()=>N("g3"),i("d7win").onclick=()=>{F(!0)},i("d7loss").onclick=()=>{F(!1)},i("normal").onclick=()=>{F(!1)},i("reset").onclick=W,i("liveTab").onclick=()=>{i("livePanel").classList.remove("hidden"),i("simPanel").classList.add("hidden"),i("liveTab").classList.add("active"),i("simTab").classList.remove("active")},i("simTab").onclick=()=>{i("livePanel").classList.add("hidden"),i("simPanel").classList.remove("hidden"),i("simTab").classList.add("active"),i("liveTab").classList.remove("active")},i("runSim").onclick=()=>{const t=i("simCount"),n=Number(t.value),s=i("runSim"),a=i("status");s.disabled=!0,a.textContent=`Running ${n.toLocaleString()} shoes...`,setTimeout(()=>{const o=j(n);i("report").textContent=Z(o),a.textContent="Simulation Analysis Complete",s.disabled=!1},20)}}X();_();I();
