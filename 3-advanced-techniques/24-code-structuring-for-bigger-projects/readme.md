# 24-code-structuring-for-bigger-projects

An example of structuring code in three.js with native typescript.

The structure is like a tree : everything starts from the [`Experience`](src/experience/Experience.ts).

Then, *node after node*, classes are instantiated,
starting from the most general and going down to the most specific ones.

With this architecture, we respect the **Single Responsibility Principle** by splitting each feature
into different classes.

I think the [`EventEmitter`](src/experience/utils/EventEmitter.ts) class is interesting to look at.
