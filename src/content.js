const clue = (question, answer, note = '') => ({ question, answer, note });
export const DECK_REVISION = 2;
export const defaultDeck = {
  title: 'Faith in the spotlight',
  subtitle: 'The Ten Commandments & the Parts of the Mass',
  categories: [
    { name: 'Love of God', topic: 'commandments', clues: [
      clue('The first three commandments teach us to love him.', 'Who is God?'),
      clue('The second commandment tells us to use God’s name with this kind of care.', 'What is respect?', 'Accept “reverence.” We do not use God’s name as an insult or swear word.'),
      clue('Catholics keep the Lord’s Day holy by going to Mass on this day.', 'What is Sunday?', 'The third commandment is about keeping the Lord’s Day holy. Saturday evening Mass can also fulfill the Sunday obligation.'),
      clue('Putting God first in our lives follows this commandment.', 'What is the first commandment?'),
      clue('You thank God for a good day instead of praying only when you need help. Name one reason to thank God.', 'What is showing love for God or being grateful for his gifts?', 'Accept a simple example of gratitude, such as thanking God for family, friends, or creation.')
    ]},
    { name: 'Gather & Begin', topic: 'mass', clues: [
      clue('At the start of Mass, we touch our forehead, chest, and shoulders to make this sign.', 'What is the Sign of the Cross?'),
      clue('At the beginning of Mass, we ask God to forgive these wrong choices.', 'What are our sins?', 'This happens during the Penitential Act.'),
      clue('This song of praise at Mass is called the Gloria. Its name means this word.', 'What is glory?', 'The Gloria praises God. It is omitted on Sundays of Advent and Lent.'),
      clue('The priest says “Let us pray.” The opening prayer that follows is called this.', 'What is the Collect?', 'Accept “the opening prayer.” It ends the Introductory Rites.'),
      clue('Which comes first at Mass: the opening prayers or the Bible readings?', 'What are the opening prayers?', 'The Introductory Rites come before the Liturgy of the Word.')
    ]},
    { name: 'Love of Neighbor', topic: 'commandments', clues: [
      clue('The fourth commandment tells us to honor these two people in our family.', 'Who are our father and mother?', 'Accept “our parents.”'),
      clue('The fifth commandment tells us to protect this precious gift from God.', 'What is human life?', 'Accept “life.”'),
      clue('The sixth commandment teaches a husband and wife to be faithful in this relationship.', 'What is marriage?'),
      clue('The ninth commandment tells us not to covet another person’s husband or wife. What does “covet” mean?', 'What is wanting someone who belongs in another person’s marriage?', 'Accept “wanting another person’s spouse for yourself.” Keep the explanation focused on respecting marriage.'),
      clue('Your team loses. Name one kind thing you can say to the winners.', 'What is “good game,” “well done,” or “congratulations”?', 'Accept another kind response. Respecting people and avoiding hurtful words helps us live the fifth commandment.')
    ]},
    { name: 'Hear the Word', topic: 'mass', clues: [
      clue('The readings at Mass come from this holy book.', 'What is the Bible?'),
      clue('The Liturgy of the Word helps us listen to God. Does it come before or after the Liturgy of the Eucharist?', 'What is before?'),
      clue('We stand to hear this reading about Jesus’ life and teaching.', 'What is the Gospel?'),
      clue('After the Gospel, the priest or deacon explains the readings in this talk.', 'What is the homily?'),
      clue('During the Prayer of the Faithful, name one person or group we might pray for.', 'Who are people who are sick, people in need, the Church, or world leaders?', 'Accept any fitting prayer intention. This prayer is also called the Universal Prayer.')
    ]},
    { name: 'Live It Out', topic: 'commandments', clues: [
      clue('You return a classmate’s lost pencil. Which commandment tells us not to steal?', 'What is the seventh commandment?'),
      clue('You tell the truth instead of spreading a lie. Which commandment are you following?', 'What is the eighth commandment?'),
      clue('The tenth commandment tells us not to covet someone else’s things. Name one way to practice being grateful.', 'What is saying thank you or appreciating what we already have?', 'Accept a simple example, such as thanking someone for a gift or caring for your own belongings.'),
      clue('You break a friend’s ruler. Name one honest thing you should do next.', 'What is telling the truth and offering to replace or repair it?', 'Accept telling your friend or a trusted adult what happened. This connects truthfulness with respect for others’ belongings.'),
      clue('Jesus taught two great commandments: love God and love this person as yourself.', 'Who is your neighbor?', 'A neighbor is anyone we are called to love and care for, not just someone who lives nearby.')
    ]},
    { name: 'Table & Sending', topic: 'mass', clues: [
      clue('These two gifts are brought to the altar before the Eucharistic Prayer.', 'What are bread and wine?'),
      clue('We pray this prayer that Jesus taught us before receiving Communion.', 'What is the Our Father?', 'Accept “the Lord’s Prayer.”'),
      clue('At Mass, the bread and wine become the Body and Blood of this person.', 'Who is Jesus Christ?', 'Catholics believe this happens at the consecration. The appearances of bread and wine remain.'),
      clue('The word “Eucharist” means this: a way of showing we are grateful.', 'What is thanksgiving?'),
      clue('At the end of Mass, we are sent to live our faith. Name one way to help someone at school.', 'What is helping a classmate, including someone, or speaking kindly?', 'Accept a specific, kind action. The dismissal sends us to love and serve others.')
    ]}
  ],
  final: { category: 'Faith in action', question: 'You go to Sunday Mass and tell the truth at school. Which two commandments are you following?', answer: 'What are the third and eighth commandments?', note: 'Third: keeping the Lord’s Day holy. Eighth: telling the truth.' }
};
export const sources = [
  { title: 'USCCB · Order of Mass', url: 'https://www.usccb.org/prayer-and-worship/the-mass/order-of-mass' },
  { title: 'USCCB · General Instruction, Chapter II', url: 'https://www.usccb.org/prayer-and-worship/the-mass/general-instruction-of-the-roman-missal/girm-chapter-2' },
  { title: 'Catechism · Ten Commandments', url: 'https://www.vatican.va/content/catechism/en/part_three/section_two.html' }
];
