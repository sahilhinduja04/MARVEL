import { CharacterId, MARVEL_CHARACTERS } from '@/types/marvel';

/**
 * Intelligent in-character AI response generator for Marvel heroes.
 * Provides deep, lore-accurate, context-aware responses matching each hero's personality.
 */
export function generateCharacterFallbackResponse(characterId: CharacterId, userQuery: string): string {
  const query = userQuery.toLowerCase().trim();

  switch (characterId) {
    // ----------------------------------------------------
    // HAWKEYE (Clint Barton)
    // ----------------------------------------------------
    case 'hawkeye': {
      if (query.includes('bestie') || query.includes('best friend') || query.includes('friend') || query.includes('close')) {
        return "That's easy—Natasha. Black Widow. We've been through Budapest, S.H.I.E.L.D., and every crazy mission in between. Though if you ask Tony, he'll claim it's him just because he upgraded my trick arrows.";
      }
      if (query.includes('natasha') || query.includes('widow') || query.includes('budapest')) {
        return "Budapest... you and I remember it very differently! Nat is the sister I never had. We've got each other's backs no matter what universe we're in.";
      }
      if (query.includes('arrow') || query.includes('bow') || query.includes('weapon') || query.includes('trick')) {
        return "I've got explosive arrows, grappling arrows, EMP arrows, thermite arrows, and USB hack arrows. No powers needed when your aim is 100%.";
      }
      if (query.includes('superpower') || query.includes('power') || query.includes('god')) {
        return "Look, I fight alongside a guy with a magic hammer, a giant green rage monster, and a billionaire in a flying tin suit. I'm just a guy with a bow. But guess what? I don't miss.";
      }
      if (query.includes('advice') || query.includes('life') || query.includes('focus') || query.includes('help')) {
        return "Here's Clint Barton's advice: when everything around you is chaotic, zero in on the one target you can control. Take a breath, pull back, and release. Don't let the noise get to your head.";
      }
      if (query.includes('joke') || query.includes('funny')) {
        return "Why did I bring a bow to an alien invasion? Because throwing knives was too heavy for my quivers! Hey, you try aiming while flying on a S.H.I.E.L.D. speeder.";
      }
      if (query.includes('love') || query.includes('family') || query.includes('wife')) {
        return "My family is my world. Laura and the kids keep me grounded. The Avengers are my team, but my family is what I fight to get home to every single night.";
      }
      return `Look, when you ask me about "${userQuery}", my answer is simple: keep your head down, trust your training, and stay practical. What else is on your mind?`;
    }

    // ----------------------------------------------------
    // SPIDER-MAN (Peter Parker)
    // ----------------------------------------------------
    case 'spiderman': {
      if (query.includes('bestie') || query.includes('best friend') || query.includes('friend')) {
        return "Outside the Avengers? Definitely Ned Leeds—my guy in the chair! Inside the Avengers? Probably Mr. Stark... though he'd pretend he was just my mentor. Or Johnny Storm if we count our rooftop pizza hangouts!";
      }
      if (query.includes('stark') || query.includes('iron man') || query.includes('tony')) {
        return "Mr. Stark was a legend. He gave me my first real suit, believed in a kid from Queens, and taught me what it truly means to be a hero.";
      }
      if (query.includes('jean grey') || query.includes('crush') || query.includes('love') || query.includes('dating')) {
        return "Woah, hold on! Jean Grey? That's Cyclops' domain! Telepaths who can throw skyscrapers with their mind are WAY out of my league. I'm strictly a MJ or Gwen Stacy guy!";
      }
      if (query.includes('web') || query.includes('suit') || query.includes('power')) {
        return "Radioactive spider bite gave me spider-sense, wall-crawling, and super strength! But the web-shooters? Total high-school chemistry lab invention. Tensile strength of steel!";
      }
      if (query.includes('advice') || query.includes('life') || query.includes('responsibility')) {
        return "Uncle Ben always said: 'With great power comes great responsibility.' If you have the ability to help someone or fix a problem, you can't just look away. You got this!";
      }
      if (query.includes('joke') || query.includes('funny')) {
        return "Why did Spider-Man join the computer class? To improve his web design skills! Ba-dum-tss! Okay, okay, my quips are better mid-fight.";
      }
      return `Hey! Peter Parker here. You're asking about "${userQuery}"? As your friendly neighborhood Spider-Man, I say tackle it head-on, stay optimistic, and never stop swinging!`;
    }

    // ----------------------------------------------------
    // IRON MAN (Tony Stark)
    // ----------------------------------------------------
    case 'ironman': {
      if (query.includes('bestie') || query.includes('best friend') || query.includes('friend')) {
        return "Rhodey—War Machine—is my day one. We've been through military contractors, rogue armor, and cosmic threats. Banner is a close second for science bro status. And Cap... well, we have an understanding.";
      }
      if (query.includes('cap') || query.includes('steve') || query.includes('rogers')) {
        return "Cap? High-minded, capsicle, indestructible shield. We fight, we argue, but when Thanos showed up, he's the guy you want holding the line.";
      }
      if (query.includes('suit') || query.includes('armor') || query.includes('mark') || query.includes('tech')) {
        return "From the Mark 1 built in a cave with a box of scraps to the Mark 85 Nanotech suit with arc reactor energy dispersion—I don't just build armor, I revolutionize technology.";
      }
      if (query.includes('advice') || query.includes('invent') || query.includes('idea')) {
        return "Here is Tony Stark's golden rule: don't settle for 'good enough.' Out-think the problem. Build it 300% better, add a gold-titanium finish, and never be afraid to break the rules.";
      }
      if (query.includes('money') || query.includes('billionaire') || query.includes('rich')) {
        return "Genius, billionaire, playboy, philanthropist. But remember: all the money in the world couldn't buy one second of time. Spend it on what matters.";
      }
      return `Tony Stark here. Regarding "${userQuery}" — simple diagnostic: genius requires bold action. If it doesn't violate the laws of physics (or if we can bend them), let's build it.`;
    }

    // ----------------------------------------------------
    // HULK (Bruce Banner / Hulk)
    // ----------------------------------------------------
    case 'hulk': {
      if (query.includes('bestie') || query.includes('best friend') || query.includes('friend')) {
        return "Banner like Tony Stark—Science Bros! But Hulk like Valkyrie and Thor from Sakaar. We smash big monster together! Thor call Hulk 'raging fire'!";
      }
      if (query.includes('thor') || query.includes('sakaar') || query.includes('smash')) {
        return "Thor is friend, but Hulk is strongest Avenger! Thor call himself God of Thunder, but Hulk smash Thor into floor like ragdoll!";
      }
      if (query.includes('banner') || query.includes('bruce') || query.includes('gamma') || query.includes('science')) {
        return "Dr. Banner is seven PhDs nuclear physicist. Hulk is raw strength. Together in Smart Hulk form, we have brains AND brawn!";
      }
      if (query.includes('angry') || query.includes('calm') || query.includes('mad')) {
        return "Banner secret: always angry! But learn to control gamma fire. When you mad, take deep breath. Don't smash unless bad guy deserve it!";
      }
      return `Hulk hear you ask about "${userQuery}". Hulk say: stay strong, stand up for weak friends, and don't let anything break your spirit!`;
    }

    // ----------------------------------------------------
    // CAPTAIN AMERICA (Steve Rogers)
    // ----------------------------------------------------
    case 'cap': {
      if (query.includes('frozen') || query.includes('ice') || query.includes('years') || query.includes('sleep')) {
        return "I was frozen in the ice for nearly 70 years—from 1945 until S.H.I.E.L.D. pulled me out in 2011. Waking up in 21st-century Times Square was quite the adjustment!";
      }
      if (query.includes('bestie') || query.includes('best friend') || query.includes('friend')) {
        return "Bucky Barnes. We've been brothers since the streets of Brooklyn in the 1930s. Through WWII, Hydra, and the Winter Soldier—I'm with him to the end of the line. Sam Wilson is family too.";
      }
      if (query.includes('bucky') || query.includes('sam') || query.includes('shield')) {
        return "Bucky is my oldest friend. And Sam Wilson has the heart and courage of a true leader. The shield represents freedom, and it belongs in good hands.";
      }
      if (query.includes('leadership') || query.includes('advice') || query.includes('discipline')) {
        return "Compromise where you can. Where you can't, don't. Even if everyone is telling you that something wrong is something right... plant yourself like a tree beside the river of truth.";
      }
      if (query.includes('avengers') || query.includes('assemble')) {
        return "Avengers Assemble! When a threat comes for the innocent, we stand together as one line of defense.";
      }
      return `Captain Rogers here. On "${userQuery}": maintain your integrity, honor your teammates, and stand firm in your convictions.`;
    }

    // ----------------------------------------------------
    // BLACK WIDOW (Natasha Romanoff)
    // ----------------------------------------------------
    case 'blackwidow': {
      if (query.includes('bestie') || query.includes('best friend') || query.includes('friend')) {
        return "Clint Barton. Hawkeye. We have a debt and a bond forged in S.H.I.E.L.D. and Budapest. Steve Rogers is also one of the few people in this world I trust completely.";
      }
      if (query.includes('clint') || query.includes('hawkeye') || query.includes('budapest')) {
        return "Clint gave me a chance when S.H.I.E.L.D. sent him to take me out. He saw who I could be instead of who I was. I'll always protect him.";
      }
      if (query.includes('spy') || query.includes('strategy') || query.includes('people') || query.includes('secret')) {
        return "In my line of work, information is everything. Pay attention to body language, what people omit, and what they fear. Always keep your true motives concealed until you strike.";
      }
      if (query.includes('red in my ledger') || query.includes('ledger') || query.includes('past')) {
        return "I have red in my ledger, and I'd like to wipe it out. Everything I do with the Avengers is about making right what I once did wrong.";
      }
      return `Natasha here. Regarding "${userQuery}": stay tactical, observe quietly, and never underestimate your opponent. What is your next move?`;
    }

    // ----------------------------------------------------
    // BLACK PANTHER (T'Challa)
    // ----------------------------------------------------
    case 'blackpanther': {
      if (query.includes('bestie') || query.includes('best friend') || query.includes('friend')) {
        return "My sister, Princess Shuri, is my closest confidante and brilliant chief innovator. Okoye and the Dora Milaje guard my back, and Captain Rogers has earned Wakanda's deepest respect.";
      }
      if (query.includes('shuri') || query.includes('wakanda') || query.includes('vibranium')) {
        return "Wakanda's technology is powered by Vibranium, crafted with genius by Shuri. But our true power lies in our culture, wisdom, and duty to protect our people.";
      }
      if (query.includes('leadership') || query.includes('king') || query.includes('wisdom')) {
        return "In times of crisis, the wise build bridges, while the foolish build barriers. A true king listens to his people and leads with courage and humility.";
      }
      return `Greetings from Wakanda. On "${userQuery}": let honor dictate your path, and wisdom guide your strength. Wakanda Forever!`;
    }

    default: {
      const heroName = (MARVEL_CHARACTERS as Record<string, { name: string }>)[characterId as string]?.name || 'Avenger';
      return `Greetings! I am ${heroName} AI. Regarding "${userQuery}", let us approach this with heroic focus and teamwork!`;
    }
  }
}
