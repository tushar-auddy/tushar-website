export type Category = 'Politics' | 'Lifestyle' | 'Entertainment' | 'Personal notes';
export type Article = { slug: string; title: string; excerpt: string; category: Category; image: string; date: string; readTime: string; body: string; sample?: boolean; status?: 'draft' | 'published' };
export const categories: Category[] = ['Politics', 'Lifestyle', 'Entertainment', 'Personal notes'];
export const articles: Article[] = [
  {
    slug: 'beyond-the-headlines', title: 'Beyond the headlines: the stories we forget to tell', excerpt: 'The most important part of a news story is often what happens after the cameras leave.', category: 'Politics', image: '/images/politics.jpg', date: '2026-10-18', readTime: '4 min read', sample: true,
    body: `A headline is a doorway. It tells us where to look, but it cannot tell us everything that waits on the other side. In the rush of a news cycle, it is easy to mistake the doorway for the whole house.

## What happens next?

Public life is often reported as a series of moments: a speech, an election, a decision. But the consequences of those moments unfold slowly. They live in the routines of people whose names rarely become headlines.

A change in policy might be announced in a crowded room. Its meaning becomes clearer somewhere quieter: at a kitchen table, in a school corridor, or on a bus ride to work. Those are places a good story should be willing to follow.

## Listening is part of the work

There is a particular discipline in asking a question and allowing the answer to be complicated. A person is more than a useful quotation. A community is more than a backdrop.

Careful reporting means checking a claim, understanding its context, and resisting the temptation to turn uncertainty into certainty. Precision is not just a matter of choosing the correct word. It is a way of respecting the reader.

## Staying with the story

Attention moves quickly. Understanding takes a little longer. The follow-up may never be as dramatic as the breaking news alert, but it often contains the information that matters most.

Perhaps a better question to ask of a headline is not only “What happened?” but “Whose experience will help us understand what happens next?”

The story does not end when we stop looking. Sometimes that is exactly where it begins.`
  },
  {
    slug: 'the-art-of-slow-mornings', title: 'The quiet art of doing a little less', excerpt: 'A cup of coffee, an unhurried morning, and a small case for making room in our days.', category: 'Lifestyle', image: '/images/coffee.jpg', date: '2026-10-14', readTime: '3 min read', sample: true,
    body: `The first cup of coffee can be a small kind of ceremony. Water warming, a spoon against a cup, light gradually finding its way across the table. Nothing extraordinary has happened. That is part of the appeal.

## An unscheduled moment

So much of a day arrives already accounted for. There are messages to answer and tasks to finish. Even our breaks can begin to resemble appointments with ourselves.

Doing a little less does not require a perfect morning routine. It might mean reading two pages without checking a screen, or taking a familiar walk without giving it a purpose.

## Attention, rather than achievement

There is a difference between having free time and feeling present in it. The first is a space on a calendar. The second is a habit of noticing.

Notice the temperature of the cup. The conversation at the next table. The same tree looking different after rain. These things are not a cure for a busy life, but they can remind us that a life is being lived inside the busyness.

## Leaving a little room

An unhurried moment does not need to be productive to be worthwhile. It can simply be a moment we were there for.

Tomorrow will have its own demands. For now, the coffee is still warm.`
  },
  {
    slug: 'what-anime-teaches-us', title: 'A little anime, a lot of life', excerpt: 'On finding very human lessons in beautifully imaginary worlds.', category: 'Entertainment', image: '/images/anime.jpg', date: '2026-10-10', readTime: '5 min read', sample: true,
    body: `Some of the most recognisable feelings arrive in the least realistic settings. A fantastical landscape. An impossible journey. A character discovering that courage is not quite what they imagined.

That is one of the pleasures of anime: the distance between its worlds and ours can make the things we share easier to see.

## Progress is rarely a straight line

The training arc is a familiar shape. Someone starts with an ambition, meets a limit, and keeps going. The interesting part is often not the eventual achievement, but the ordinary work in between.

Outside a story, progress is harder to edit into a montage. It looks like returning to a drawing, rewriting a paragraph, or trying a conversation again with more patience.

## The people along the way

Many memorable stories give friendship as much weight as individual strength. A supporting character does more than offer encouragement. They change what the main character understands about the journey itself.

Everyday life contains quieter versions of this: the person who notices an effort, asks a useful question, or shows up when the answer is not obvious.

## Bringing something back

The best part of an imaginary world is not always the escape. Sometimes it is the small idea we bring back to our own.

Keep practising. Make room for your friends. Pay attention to the person you are becoming. These are simple ideas, but a good story can make them feel new again.`
  },
  {
    slug: 'language-between-the-lines', title: 'What lives between the lines', excerpt: 'How the words we choose shape the stories we understand.', category: 'Personal notes', image: '/images/writing.jpg', date: '2026-10-06', readTime: '4 min read', sample: true,
    body: `Two sentences can describe the same event and leave entirely different impressions. A word moved, a verb changed, a detail brought to the front: language is never just a container for meaning.

## The weight of a word

Studying language invites a particular kind of attention. We begin to notice not only what a sentence says, but what it assumes the reader already knows. We notice which person gets to act and which person is only acted upon.

These are useful questions for a writer. A clear sentence is not always a short one. Sometimes clarity requires another line of context, or an honest acknowledgement of what remains unknown.

## Reading with curiosity

The same attention changes reading. A familiar phrase becomes a choice to examine. A difficult paragraph becomes an invitation to slow down.

There is no final, perfect vocabulary for the world. There is only the continuing work of being more precise, more thoughtful, and more willing to revise.

## A practice of care

Writing is often described as finding your voice. Perhaps it is also learning how that voice reaches someone else.

A sentence is a small bridge. It deserves to be built carefully.`
  },
  {
    slug: 'why-we-still-go-to-the-movies', title: 'Why the big screen still feels like magic', excerpt: 'In an age of endless streaming, a love letter to the shared experience of cinema.', category: 'Entertainment', image: '/images/cinema.jpg', date: '2026-10-02', readTime: '3 min read', sample: true,
    body: `The lights dim, a conversation falls quiet, and for a moment a room full of strangers agrees to pay attention to the same thing. The ritual is familiar. It still feels special.

## A room made for a story

At home, a film competes with the rest of the room. In a cinema, the room has been arranged around the film. The screen is larger, but the more interesting change is in our attention.

There is nowhere else we are expected to be for the next couple of hours. That permission can feel surprisingly rare.

## The audience is part of it

A laugh travels. A silence deepens. Sometimes an entire audience seems to take the same breath. These are small experiences that cannot be added to a streaming menu.

Not every screening is perfect, and not every film needs a theatre. But the possibility of a shared response is one reason to return.

## After the credits

The conversation on the way out is part of the film too: an ending debated, a scene recalled, a detail someone else noticed.

We went in together. We come out carrying slightly different stories. There is something wonderful about that.`
  },
  {
    slug: 'taking-the-long-way-home', title: 'Taking the long way home', excerpt: 'A familiar city, a different turning, and the things we notice when we wander.', category: 'Lifestyle', image: '/images/city.jpg', date: '2026-09-27', readTime: '3 min read', sample: true,
    body: `A familiar route is useful precisely because we can stop thinking about it. We know where to turn, how long it takes, which side of the road catches the afternoon sun.

Every so often, it is worth making a different choice.

## A small detour

A street we have never needed to walk down can make a familiar neighbourhood feel new. There is a shop sign painted by hand, a balcony full of plants, a conversation drifting out of an open doorway.

Nothing needs to be collected or photographed. It is enough to notice.

## The city at walking pace

Places have different rhythms. A junction that feels hurried from a bus window can be surprisingly gentle one street away. A wall we usually pass without seeing can hold the best light of the evening.

Walking gives these details a little more time to reach us.

## Coming back differently

The destination has not changed. There are still things to do when we get home. But the journey has acquired a few more details, and perhaps that makes the day a little larger.

Sometimes the long way is simply the way that reminds us to look around.`
  }
];
export const storageKey = 'tushar-writing-room-v1';
export function getLocalArticles(): Article[] {
  try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(value) ? value.filter((v: Article) => v && typeof v.slug === 'string' && typeof v.title === 'string' && typeof v.body === 'string' && categories.includes(v.category)) : []; } catch { return []; }
}
export function formatDate(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
