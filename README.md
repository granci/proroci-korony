# Corona prophets

A simple static HTML project which tries to summarize quotes about corona pandemic that didn't age well. The idea came from [this FB post](https://www.facebook.com/utheraptor/photos/a.238176063377369/914537269074575)).

## Embeding to your website
The chart can be embeded to your website as a iframe:

`<iframe rc="https://granci.github.io/proroci-korony/chart/?country=sr&lang=sk" ></iframe>`

In the src you can use these parameters:
 * country - allowed values: 'us', sr', 'cr' (default 'sr')
 * lang - allowed values: 'en', 'sk', 'cz' (default 'sk')
 * filter - comma-separated tag of the quote type as defined in 'quotes' folder (default displays all the quotes)

## Additional development
As you can see, the project is not very advanced yet. You can help to make it better:
1. add more relevant quotes by adding more objects to the files in 'quotes' folder (such as 'quotes-sk.js')
2. connect to live corona data (I've failed with CORS on the static website)
3. tune up UX (chart, menu, etc.)
