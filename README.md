# Data Portal	

## Using your own data

Simply modify the index.html file in docs and change the file path 

```javascript
<script src="assets/js/lib/d3.min.js"></script>
<script src="assets/js/lib/d3-tip.js"></script>
<script src="assets/js/lib/crossfilter.min.js"></script>
<script src="assets/js/lib/dc.min.js"></script>
<script src="assets/js/data-portal.js"></script>
<script type="text/javascript">
	 // Change this to your data file.
    dataPortal.render('data/zooout merged.csv');
</script>
```

## Adding more parameters

See [my tutorial](https://thor-project.github.io/dashboard-tutorial/) on creating dashboards with dc.js and crossfilter.js to learn how to modify the code to fit different data.