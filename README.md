# binary-palette

This is a project I made a little while ago for my mother. She does art stuff, and one of the types of works she makes are binary palettes. They are a 12x12 grid where the each row is a single color, determined by what boxes in that row are "ticked". [You can see the work here](https://hansonbruel.com/binary-palettes/).

This program allows one to design a layout by toggling squares. It is designed to both aid my mother in planning and visualizing the works, but also to allow other people to interactively create their own ideas on her website. [The program is on the bottom of this page](https://hansonbruel.com/binary-palettes/)

![Alt text](https://github.com/charles-bruel/binary-palette/blob/master/pictures/before.PNG?raw=True)

Before

![Alt text](https://github.com/charles-bruel/binary-palette/blob/master/pictures/result.PNG?raw=True)

Result

The program is structured as a standalone website which can be loaded with an iframe tag into whatever page desired. The website is made using wordpress, which preseneted an additional problem. Wordpress redirects all HTML requests to their own system, which generates the pages on demand, AIUI. I had to create a custom rule in the redirections file to send requests to the actual file.

Each html file represents a different set of avaliable palettes to select. There is an element of technical debt in the code. Recently, to facilitate easier introduction of new template buttons, I switched from descriptor strings in JS to descriptor strings in HTML, so both systems exist and are used.
