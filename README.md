# QMemcached

  [QPromises](https://github.com/kriskowal/q)  wrapper for node-memcached [node-memcached](https://github.com/3rd-Eden/node-memcached)

## Example:

### Memcached set

```Javascript

qmemcached = new qMemcached("localhost:11211");

qmemcached
.set("foo", "bar", 1000)
.then(function(res){
  console.log("Memcached updated:", res);
})
.fail(function(e){
  throw e;
});

```

### Memcache get

```Javascript
qmemcached = new qMemcached("localhost:11211");

qmemcached
.get("foo")
.then(function(value){
  console.log(value);
})
.fail(function(e){
  throw e;
});

```