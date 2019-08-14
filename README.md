# DOM Size Analyzer

Simple Google Chrome devtool to analyze a page's DOM size.

### Motivation ###
According to https://developers.google.com/web/tools/lighthouse/audits/dom-size, an optimal DOM tree has the following properties:
* Has less than 1500 nodes total.
* Has a maximum depth of 32 nodes.
* Has no parent node with more than 60 child nodes.

We can use this devtool to analyze a page's DOM to easily find out which parts of the page are adding weight to it.

### TODO ###
* Highlighting the hovered element on page

### Known Issues ###
* Background and Contenscript are not getting injected into existing tabs after installation. Please reload the required tabs after installation for the extension to properly.

### Install dependencies ###

```
$ yarn
```

### Build ###

```
$ yarn run build
```

### Install into your Google Chrome browser ###

* Navigate to the extensions page [chrome://extensions/](chrome://extensions/)
* Activate `Developer mode` by selecting appropriate checkbox in top right corner of the page (once it was selected you will see additional buttons right under that checkbox).
* You need to click `Load unpacked extension...` button and navigate to `./build` folder in your filesystem.
