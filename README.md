# MakoCoder

Discord bot that lets people run code. Written in DiscordJS. Currently hard-tailored to my system, will make customizable later.

# Changelog

### 1.0.1

-   Added STDIN support
-   Got around to writing part of the README

### 1.0.2

-   Promise chaining in src/commands/run.js in language process
-   Return buffer containing "Interpreted" if language needn't be compiled

### 1.0.2-1

-   Removed `src/tmp.js`, was a redundant file I forgot to .gitignore

### 1.1.0

-   Added argv support, add args after /run command on same line
