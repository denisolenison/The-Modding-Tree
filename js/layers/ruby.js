addLayer("r", {
    name: "rubies", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 8, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        best: new Decimal(0),
    }},
    effect() {
        eff = player[this.layer].points.add(1).log2().add(1).pow(5);
        if (hasUpgrade("r", 13)) {
            eff = eff.times(Decimal.max(Decimal.times(player.r.best, player.r.best), new Decimal(1)));
        }
        if (hasMilestone("r", 3)) {
            eff = eff.pow(2);
        }
        if (hasMilestone("r", 5)) {
            eff = eff.pow(2);
        }
        eff = eff.pow(layers.q.challenges[13].rewardEffect());
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "Rubies make you richer! Gold gain and level gain are multiplied by "+format(eff)+
        "x.";
    },
    color: "#FF335B",
    requires() {
        let baseVal = new Decimal(2e20);
        baseVal = baseVal.div(layers.q.challenges[14].rewardEffect());
        return baseVal;
    }, // Can be a function that takes requirement increases into account
    resource: "rubies", // Name of prestige currency
    baseResource: "gold", // Name of resource prestige is based on
    softcap: new Decimal("1e1000"),
    baseAmount() {return player.g.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let baseExp = new Decimal(2.7);
        baseExp = baseExp.plus(player.g.points.plus(1).log(10).plus(1).log(10).div(10000));
        if (hasMilestone("r", 3)) {
            baseExp = baseExp.times(0.8);
        }
        if (hasUpgrade("r", 13)) {
            baseExp = baseExp.times(0.99);
        }
        if (hasUpgrade("xp", 55)) {
            baseExp = baseExp.times(0.5);
        }
        baseExp = baseExp.div(layers.q.challenges[18].rewardEffect());
        baseExp = baseExp.div(layers["s"].effect());

        return baseExp;
    }, // Prestige currency exponent
    base: 2500,
    canBuyMax: true,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1.5);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let expon = new Decimal(1.25);
        return expon;
    },
    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title: "Make it easier",
            description: "Multiplies gold gain by 1,000",
            cost: new Decimal(1),
            unlocked() { return player[this.layer].unlocked },
            effect() {
                let eff = new Decimal(1000);
                return eff;
            },
        },
        12: {
            title: "I think this mult is close to previous now",
            description: "Multiplies gold gain by (lvl+1)^1.34",
            cost: new Decimal(2),
            unlocked() { return (hasUpgrade(this.layer, 11)) },
            effect() {
                let eff = player.points.plus(1).pow(1.34);
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" }, // Add formatting to the effect
        },
        13: {
            title: "Era of Adventures",
            description: "Decreases ruby and level exponent by 1%. Ruby bonus is multiplied by square of your best rubies. Unlocks new layer.",
            cost: new Decimal(3),
            unlocked() { return ((hasUpgrade(this.layer, 12) && hasUpgrade("xp", 45)) || hasUpgrade(this.layer, 13)) },
        },
        14: {
            title: "Bonus Bonus",
            description: "Loot effect is also multiplied by the sqrt value of ruby effect",
            cost: new Decimal(6),
            unlocked() { return ((hasUpgrade(this.layer, 13) && player.r.points.gte(6)) || hasUpgrade(this.layer, 14)) },
        },
        15: {
            title: "Is it cheating?",
            description: "Multiplies level/xp/gold gain by 2 AND it does not depend on your current challenge!",
            cost: new Decimal("1e15"),
            unlocked() { return ((hasUpgrade(this.layer, 14) && hasUpgrade("l", 55)) || hasUpgrade(this.layer, 15)) },
        },
        21: {
            title: "Now for the gold!",
            description: "All gold upgrades costs are powered to ^0.05",
            cost: new Decimal("1e22"),
            unlocked() { return ((hasUpgrade(this.layer, 15) && hasUpgrade("l", 55)) || hasUpgrade(this.layer, 21)) },
        },
        22: {
            title: "Stop Clicking Loot!",
            description: "Autobuys 10 loot upgrades/tick. Also it's effect is powered to 2 now.",
            cost: new Decimal("1e40"),
            unlocked() { return ((hasUpgrade(this.layer, 21) && hasUpgrade("l", 55)) || hasUpgrade(this.layer, 22)) },
        },
        23: {
            title: "Go further!",
            description: "Base Level Gain exponent is powered to ^0.4",
            cost: new Decimal("1e45"),
            unlocked() { return ((hasUpgrade(this.layer, 22) && hasUpgrade("l", 55)) || hasUpgrade(this.layer, 23)) },
        },
        24: {
            title: "Better rewards!",
            description: "Last challenge reward now is powered to 1.1",
            cost: new Decimal("1e60"),
            unlocked() { return ((hasUpgrade(this.layer, 23) && hasUpgrade("l", 55)) || hasUpgrade(this.layer, 24)) },
        },
        25: {
            title: "You are close!!!",
            description: "Unlocks second ruby buyable",
            cost: new Decimal("1e75"),
            unlocked() { return ((hasUpgrade(this.layer, 24) && hasUpgrade("l", 55)) || hasUpgrade(this.layer, 25)) },
        },
    },

    milestones: {
        0: {requirementDescription: "Get 1 max ruby",
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: "Adds additional 100% to passive gold and xp gain. Keeps gold layer unlocked.",
        },
        1: {requirementDescription: "Get 2 max rubies",
            unlocked() {return hasMilestone("r", 0)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: "Passive upgrades doesn't cost anything. Also they are 1.5x times more efficient and are bought automatically.",
        },
        2: {requirementDescription: "Get 3 max rubies",
            unlocked() {return hasMilestone("r", 1)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription: "Base level exponent is decreased by 10 percent.",
        },
        3: {requirementDescription: "Get 4 max rubies",
            unlocked() {return hasMilestone("r", 2)},
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription: "Ruby exponent is decreased by 20 percent. Ruby bonus is squared.",
        },
        4: {requirementDescription: "Get 10 max rubies",
            unlocked() {return hasMilestone("r", 3)},
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription: "Loot base requirement is divided by 5,000",
        },
        5: {requirementDescription: "Get 300 max rubies",
            unlocked() {return hasMilestone("r", 4)},
            done() {return player[this.layer].best.gte(300)}, // Used to determine when to give the milestone
            effectDescription: "Ruby effect is squared. Again.",
        },
        6: {requirementDescription: "Get 1e200 max rubies",
            unlocked() {return hasMilestone("r", 5)},
            done() {return player[this.layer].best.gte("1e200")}, // Used to determine when to give the milestone
            effectDescription: "Ruby buyables cost nothing. Automatically buy 10 of them/tick.",
        },
    },
    buyables: {
        rows: 1,
        cols: 2,
        showRespec: false,
        11: {
            title: "Better Exponents", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(new Decimal(1.1), x.pow(2));
                cost = cost.times("1e12");
                return cost.floor()
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                let eff = new Decimal(x*0.05 + 1);
                if (hasMilestone("s", 23)) eff = eff.pow(2);
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "Cost: " + format(data.cost) + " rubies\n\
                Amount: " + format(player[this.layer].buyables[this.id]) + "\n\
                XP and gold base exponents are powered to ^" + (data.effect < 10 ? Math.round(data.effect*100)/100 : format(data.effect));
            },
            unlocked() { return (hasUpgrade("l", 55)) },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},

            buy() {
                let ticks = player[this.layer].ticks;
                cost = tmp[this.layer].buyables[this.id].cost

                let x = new Decimal(player[this.layer].buyables[this.id].plus(ticks).sub(1));
                console.log(format(x));
                let newCost = Decimal.pow(new Decimal(1.1), x.pow(2));
                newCost = newCost.times("1e12");
                newCost = newCost.floor();


                if (player[this.layer].points.gte(newCost) && ticks.gte(1)) {
                    if (!hasMilestone('r', 6) && !hasMilestone("s", 4)) {
                        player[this.layer].points = player[this.layer].points.sub(cost)
                    }
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(ticks)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                }
                else {
                    player[this.layer].ticks = player[this.layer].ticks.div(2);
                    ticks = player[this.layer].ticks;
                    if (ticks.gte(new Decimal(1))) layers.r.buyables[11].buy();
                }
            },
        },
        12: {
            title: "Faster Leveling in Challenge", // Optional, displayed at the top in a larger font
            cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(new Decimal(1.05), x.pow(1.4));
                cost = cost.times("1e75");
                return cost.floor()
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                let eff = new Decimal(0.99).pow(x);
                if (hasMilestone("s", 23)) eff = eff.pow(2);
                return eff;
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                if (data.effect >= 0.000001) {
                    return "Cost: " + format(data.cost) + " rubies\n\
                    Amount: " + format(player[this.layer].buyables[this.id]) + "\n\
                    Base lvl gain exponent is powered to ^" + format(data.effect.times(1000000).round().div(1000000));
                }
                else {
                    return "Cost: " + format(data.cost) + " rubies\n\
                    Amount: " + format(player[this.layer].buyables[this.id]) + "\n\
                    Base lvl gain exponent is powered to ^(1/" + format(new Decimal(1).div(data.effect)) + ")";
                }
            },
            unlocked() { return (hasUpgrade("r", 25)) },
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                let ticks = new Decimal(player[this.layer].ticks2);
                cost = tmp[this.layer].buyables[this.id].cost
                let x = new Decimal(player[this.layer].buyables[this.id].plus(ticks).sub(1));
                let newCost = Decimal.pow(new Decimal(1.05), x.pow(1.4));
                newCost = newCost.times("1e75");
                newCost = newCost.floor();

                if (player[this.layer].points.gte(newCost) && ticks.gte(1)) {
                    if (!hasMilestone('r', 6) && !hasMilestone("s", 4)) {
                        player[this.layer].points = player[this.layer].points.sub(cost)
                    }
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(ticks)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                }
                else {
                    player[this.layer].ticks2 = player[this.layer].ticks2.div(2);
                    ticks = player[this.layer].ticks2;
                    if (ticks.gte(new Decimal(1))) layers.r.buyables[12].buy();
                }
            },
        },
    },

    update(diff) {
        player[this.layer].ticks =  new Decimal(1);
        player[this.layer].ticks2 =  new Decimal(1);
        if (hasMilestone('r', 6) || hasMilestone("s", 4)) {
            player[this.layer].ticks = (hasMilestone('r', 6) * 10) + (hasMilestone("s", 4) * 10) + (hasMilestone("s", 16) * 1000)
            + (hasMilestone("s", 18) * 1000) + (hasMilestone("s", 21) * 1e9) + (hasMilestone("s", 22) * 1e90);

            player[this.layer].ticks = new Decimal(player[this.layer].ticks);
            if (hasMilestone("s", 23)) {
                player[this.layer].ticks = player[this.layer].ticks.plus("1e100");
            }


            player[this.layer].ticks2 = (hasMilestone('r', 6) * 10) + (hasMilestone("s", 4) * 10) + (hasMilestone("s", 6) * 1000)
             + (hasMilestone("s", 9) * 2000) + (hasMilestone("s", 16) * 10000) + (hasMilestone("s", 18) * 100000)
             + (hasMilestone("s", 21) * 1e9) + (hasMilestone("s", 22) * 1e90);

             player[this.layer].ticks2 = new Decimal(player[this.layer].ticks2);
             if (hasMilestone("s", 23)) {
                player[this.layer].ticks2 = player[this.layer].ticks2.plus("1e100");
             }

            if (layers.r.buyables[11].unlocked() && layers.r.buyables[11].canAfford()) {
                layers.r.buyables[11].buy();
            }
            if (layers.r.buyables[12].unlocked() && layers.r.buyables[12].canAfford()) {
                layers.r.buyables[12].buy();
            }
        }
        if (hasMilestone('s', 7)) {
            generatePoints("r", diff);
        }
    },

    automate() {
        if (player["s"].autoBuyAll2) {
            for (let x = 10; x <= 20; x += 10){
                for (let y = 1; y <= 5; y++) {
                    let z = x + y;
                    if (!hasUpgrade("r", z) && canAffordUpgrade("r", z) && (hasMilestone("s", 4))
                      && layers["r"].upgrades[z].unlocked()===true) {
                        buyUpg("r", z);
                    }
                }
            }
        }
    },

    row: 1, // Row the layer is in on the tree (0 is the first row)

    hotkeys: [
    ],
    branches: [["g", 3], ["xp", 3]],

    tabFormat: ["main-display",
    ["prestige-button", "", function (){ return hasMilestone("s", 26) ? {'display': 'none'} : {}}]
    , "buyables", "upgrades", "milestones"],

    layerShown(){return (hasUpgrade("g", 35) || player.r.best.gte(1))},
})
