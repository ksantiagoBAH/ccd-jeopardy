// Original question text identifies unchanged clues in existing saved games.
const previousDeck = {
  "title": "Faith in the spotlight",
  "subtitle": "The Ten Commandments & the Parts of the Mass",
  "categories": [
    {
      "name": "Love of God",
      "topic": "commandments",
      "clues": [
        {
          "question": "The first three commandments teach us how to love this person.",
          "answer": "Who is God?",
          "note": ""
        },
        {
          "question": "The second commandment asks us to treat this name with reverence.",
          "answer": "What is God’s name?",
          "note": "Accept “the name of the Lord.”"
        },
        {
          "question": "The third commandment calls us to keep this day holy.",
          "answer": "What is the Lord’s Day?",
          "note": "Accept “Sunday” in Catholic practice; the biblical commandment refers to the Sabbath."
        },
        {
          "question": "Treating money, popularity, or possessions as more important than God goes against this commandment.",
          "answer": "What is the first commandment?",
          "note": "We give God first place in our lives."
        },
        {
          "question": "A friend says prayer is only for emergencies. Explain one way regular prayer helps us live the first commandment.",
          "answer": "What is building a relationship with God and putting trust in him?",
          "note": "Accept a thoughtful example of worship, gratitude, or trust in God. The host judges the explanation."
        }
      ]
    },
    {
      "name": "Gather & Begin",
      "topic": "mass",
      "clues": [
        {
          "question": "We begin Mass by making this familiar gesture.",
          "answer": "What is the Sign of the Cross?",
          "note": ""
        },
        {
          "question": "At the beginning of Mass, we acknowledge our sins during this act.",
          "answer": "What is the Penitential Act?",
          "note": ""
        },
        {
          "question": "This prayer of praise begins with words about glory to God in heaven.",
          "answer": "What is the Gloria?",
          "note": "It is not used at every Mass; for example, it is omitted on Sundays of Advent and Lent."
        },
        {
          "question": "The opening prayer that concludes the Introductory Rites has this special name.",
          "answer": "What is the Collect?",
          "note": ""
        },
        {
          "question": "Before we hear Scripture, the Introductory Rites help us become one worshiping community. Name two things we do in these rites.",
          "answer": "What are the entrance, greeting, Penitential Act, Kyrie, Gloria, or Collect?",
          "note": "Accept any two. Some elements vary by the celebration."
        }
      ]
    },
    {
      "name": "Love of Neighbor",
      "topic": "commandments",
      "clues": [
        {
          "question": "This commandment asks us to honor our father and mother.",
          "answer": "What is the fourth commandment?",
          "note": ""
        },
        {
          "question": "Protecting human life and refusing to hurt others are ways to live this commandment.",
          "answer": "What is the fifth commandment?",
          "note": ""
        },
        {
          "question": "The sixth commandment protects faithfulness in this lifelong relationship.",
          "answer": "What is marriage?",
          "note": "The sixth commandment forbids adultery and calls us to chastity."
        },
        {
          "question": "These two commandments address coveting: one concerns another person’s spouse, and the other their possessions.",
          "answer": "What are the ninth and tenth commandments?",
          "note": "Catholic numbering: ninth, another’s spouse; tenth, another’s goods."
        },
        {
          "question": "Your team loses, and you want to insult the winners. Explain a better response that honors the fifth commandment.",
          "answer": "What is treating them with dignity, congratulating them, or choosing peaceful words?",
          "note": "Accept an example that respects the person and avoids cruelty. The host judges the explanation."
        }
      ]
    },
    {
      "name": "Hear the Word",
      "topic": "mass",
      "clues": [
        {
          "question": "This part of Mass is when we listen to readings from the Bible.",
          "answer": "What is the Liturgy of the Word?",
          "note": ""
        },
        {
          "question": "This song or prayer from the Book of Psalms usually follows the first reading.",
          "answer": "What is the Responsorial Psalm?",
          "note": ""
        },
        {
          "question": "The high point of the Liturgy of the Word is the reading from one of these four books.",
          "answer": "What are the Gospels?",
          "note": "Accept Matthew, Mark, Luke, and John."
        },
        {
          "question": "After the Gospel, the priest or deacon explains the readings in this reflection.",
          "answer": "What is the homily?",
          "note": ""
        },
        {
          "question": "On Sundays, we profess our faith in the Creed, then pray for the Church and the world in these prayers.",
          "answer": "What is the Universal Prayer?",
          "note": "Accept “Prayer of the Faithful” or “General Intercessions.”"
        }
      ]
    },
    {
      "name": "Live It Out",
      "topic": "commandments",
      "clues": [
        {
          "question": "You find a classmate’s headphones. Returning them respects this commandment.",
          "answer": "What is the seventh commandment?",
          "note": ""
        },
        {
          "question": "A group chat shares a false rumor. Refusing to spread it honors this commandment.",
          "answer": "What is the eighth commandment?",
          "note": ""
        },
        {
          "question": "You feel jealous of a friend’s new phone. Practicing gratitude helps you live this commandment.",
          "answer": "What is the tenth commandment?",
          "note": ""
        },
        {
          "question": "You copied someone’s homework and claimed it was yours. Name two commandments connected to this choice.",
          "answer": "What are the seventh and eighth commandments?",
          "note": "Taking credit for another’s work involves dishonesty and taking what belongs to someone else."
        },
        {
          "question": "Jesus summarized our duties in two great commands. Name both.",
          "answer": "What are loving God and loving our neighbor?",
          "note": "Accept “love God with all your heart” and “love your neighbor as yourself.”"
        }
      ]
    },
    {
      "name": "Table & Sending",
      "topic": "mass",
      "clues": [
        {
          "question": "Bread and wine are brought to the altar during this part of Mass.",
          "answer": "What is the Preparation of the Gifts?",
          "note": "Accept “offertory.”"
        },
        {
          "question": "This great prayer of thanksgiving is the heart of the Liturgy of the Eucharist.",
          "answer": "What is the Eucharistic Prayer?",
          "note": ""
        },
        {
          "question": "Catholics believe that, at the consecration, the bread and wine become these.",
          "answer": "What are the Body and Blood of Jesus Christ?",
          "note": "Their appearances remain those of bread and wine."
        },
        {
          "question": "Before Communion, we pray the prayer Jesus taught us. Name it.",
          "answer": "What is the Lord’s Prayer?",
          "note": "Accept “the Our Father.”"
        },
        {
          "question": "The dismissal sends us out to live our faith. Give one example that connects Mass with a commandment.",
          "answer": "What is caring for others, speaking truthfully, respecting parents, or returning what is borrowed?",
          "note": "Accept a specific action and a matching commandment. The host judges the explanation."
        }
      ]
    }
  ],
  "final": {
    "category": "Faith in action",
    "question": "A student attends Sunday Mass, then refuses to spread a hurtful rumor at school. Which two commandments are especially reflected in these choices?",
    "answer": "What are the third and eighth commandments?",
    "note": "Third: keeping the Lord’s Day holy. Eighth: respecting truth and the good name of others."
  }
};

export function migrateDeck(saved, current) {
  const deck = JSON.parse(JSON.stringify(saved));
  const update = (target, previous, next) => {
    for (const field of ['question', 'answer', 'note']) {
      if (target[field] === previous[field]) target[field] = next[field];
    }
  };
  deck.categories.forEach((category, c) => category.clues.forEach((clue, r) => update(clue, previousDeck.categories[c].clues[r], current.categories[c].clues[r])));
  update(deck.final, previousDeck.final, current.final);
  return deck;
}
