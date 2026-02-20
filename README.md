## a docker container for streamlinig the verification of JSON of youtube channel URL's by means of human in the loop

takes a JSON of [unverified] youtube channels pops the channel open in pupeteer (headlessly) screenshots and saves as ``` $artist ```.jpeg for visual ID/verification

<hr>

<br>
<br>



I was having architecture issues on mac with pupeteer's official docker image so it was done like this....

```

```



pass the "-v" flag to bind its volume to your local machine, otherwise you'll lose everything on exit, something like this
```

docker build -t screenshot .
docker run -v ~/Downloads/screenshots:/app/screenshots screenshot
````

bring your own json (its expecting some nulls and at least a artist field and channel)

