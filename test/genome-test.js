var tap  = require('tap'),
	test = tap.test,
	plan = tap.plan,
	gen,
	ga;

test('load genome', function(t){
	gen = require('../lib/genome.js');
	t.ok(gen, 'genome loaded');
	ga = require('../lib/ga.js');
	t.ok(ga, 'ga loaded');
	t.end();
});

test('create genome', function(t){
	var genome = new gen.Genome(23);
	t.ok(genome, 'create genome by passing data');
	t.equal(genome.data, 23, 'data should have the passed value');
	gen.Genome.prototype.generate = function(){
		return 42;
	};

	genome = new gen.Genome();
	t.ok(genome, 'create genome by using the generate function');
	t.equal(genome.data, 42,
		'data should be the return value from the generate function');
	t.end();
});

test('muate genome', function(t){
	var genome = new gen.Genome(23);
	t.equal(genome.data, 23,
		'genome was created with data');

	gen.Genome.prototype.mutateData = function(data, pmut){
		return 15;
	};
	genome.mutate(1);
	t.equal(genome.data, 15,
		'genome was muated by simple mutator');

	genome = new gen.Genome('foobar');
	t.equal(genome.data, 'foobar',
		'another genome was created with data');
	gen.Genome.prototype.mutateData = ga.defaultMutator;
	genome.mutate(1);
	t.ok(genome.data, 'muation data is ok');
	t.end();
});

test('cross genome using default crossover', function(t){
	var mom = new gen.Genome('foobar');
	var dad = new gen.Genome('barfoo');
	t.equal(mom.data, 'foobar',
		'mom was created with data');
	t.equal(dad.data, 'barfoo',
		'dad was created with data');

	gen.Genome.prototype.crossoverData = ga.defaultCrossover;

	var children = mom.cross(dad);
	t.equal(children[0].data, 'foofoo',
		'child one has predicted data');
	t.equal(children[1].data, 'barbar',
		'child two has predicted data');
	t.end();
});

test('genome score', function(t){
	var genome = new gen.Genome(42);
	gen.Genome.prototype.objective = function(data){
		return 123;
	};
	t.equal(genome.score(), 123,
		'a valid score was returned');
	t.end();
});