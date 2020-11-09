# Covidology

A simple static HTML project which tries to summarize quotes about corona pandemic that didn't age well. The idea came from [this FB post](https://www.facebook.com/utheraptor/photos/a.238176063377369/914537269074575)). The page is deployed [here](http://covidology.granci.com/)).

## Technology
 * Bootstrap 4
 * jQuery 3

## Embeding to your website
The chart can be embeded to your website as a iframe:

`<iframe src="http://covidology.granci.com/chart/?country=sr&lang=sk" ></iframe>`

In the src you can use these parameters:
 * `country` - allowed values: `us`, `sr`, `cr` (default `sr`)
 * `lang` - allowed values: `en`, `sk`, `cz` (default `sk`)
 * `filter` - comma-separated tag of the quote type as defined in [quotes folder](https://github.com/granci/proroci-korony/tree/main/chart/quotes) (default displays all the quotes)
 * `overlap` - boolean, if false, some quotes will be hidden to prevent overlapping (default is true, so all the quotes are displayed regardless overlapping)

## Additional development
As you can see, the project is not very advanced yet. You can help to make it better:
1. add more relevant quotes by adding more objects to the files in [quotes folder](https://github.com/granci/proroci-korony/tree/main/chart/quotes)
2. connect to live corona data (I've failed with CORS on the static website)
3. tune up UX (chart, menu, etc.)
