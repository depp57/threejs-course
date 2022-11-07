# 41-first-react-application

## JSX

JSX is a tag-based language very close to HTML, with more features.

### Fragment

The `render` function in React must only contain one element.

```jsx
root.render(
	<div>
		<h1>Hello React!</h1>
		<p>I love three.js</p>
	</div>
);
```
We can use a *fragment* `<>` to have multiple elements without having one main parent.
```jsx
root.render(
	<> // < --- This won't be rendered in the DOM
		<h1>Hello React!</h1>
		<p>I love three.js</p>
	</>
);
```

### Reserved keywords

Some keywords like `class`or `for` are reserved for typescript. This means that we can't have a tag or an attribute with similar names.

They are simply replaced :
- `class` becomes `className`
- `for` becomes `htmlFor`

There are many other reserved keywords.

### Injection

We can inject variables and execute Typescript inside `{...}` :

```jsx
const toto = 'tata;

root.render(
	<>
		<h1 className='title'>Hello { toto } ! </h1>
		<p>Some random content : { Math.random() }</p>
	</>
);
```

It must be an **expression** which can be evaluated.

## Style

### With an attribute

```jsx
<h1 style={ {color: 'coral', backgroundColor: 'white'} }></h1>
```

### With a CSS file

*style.css*
```css
.cute-paragraph {
	color: coral;
	backgroundColor: white;
}
```
Add the class with `className` to the paragraph.
```jsx
<h1 className="cute-paragraph">Hello React!</h1>
```
Import the style in the component.

`import './style.css';`

## Components

Like Angular, React is a component-based framework.

In React, a component is simply a function which returns JSX.

*MyComponent.tsx* <--- Note the extension **.tsx**
```jsx
export default function MyComponent() {
	return <h1>Hello from my cool component</h1>;
}
```
*index.tsx*
```jsx
import MyComponent from './MyComponent';
...
root.render(
	<MyComponent/>
);
```

The whole function will be called **every time** React renders our component. It happens mostly when data changes. It doesn't mean that all DOM elements corresponding to the JSX will be re-rendered. React keep the previous structure in memory and only re-render what needs to be by using the [Virtual DOM](#virtual-dom).

### Events

We can simply add an `eventListener` in React.
```jsx
export default function Clicker() {
    const buttonClick = () => {
        console.log('The button has been clicked');
    };

	return(
	<div>
        <div>Clicks count: { count }</div>
        <button onClick={ buttonClick }>Click me</button>
    </div>);
}
```

### Hooks

`useState` is what we call a **hook**. It is a function that we call inside a component to do specific tasks related to that component.

There are a bunch of hooks that do different things.

Here, the task of  `useState`  is to provide us a variable and a function. When we want to change the variable, instead of re-assigning it, we will be using the function.

The function won’t just change the variable, it’ll also alert React that the component needs to be re-rendered and we should see the new value appear magically.

```jsx
export default function Clicker()
{
    const [ count, setCount ] = useState(0);
    
    const buttonClick = () => setCount(count => count + 1); // increments count and tells React to re-render the component

    return(
	<div>
        <div>Clicks count: { count }</div>
        <button onClick={ buttonClick }>Click me</button>
    </div>);
}
```

There are many other **hooks** listed in the official documentation.

### Props

Props are properties of a component and can be set using JSX attributes. You can use whatever attribute you want, as long as it’s not a reserved keyword.

*MyComponent.tsx*
```jsx
export default function Clicker(props) {
    console.log(props.keyName);
}
```
Or with javascript object destructuring and typescript static types :
```jsx
export default function Clicker({keyName}: {keyName: string}) { // or with a type/interface
    console.log(keyName);
}
```

Then, we can simply assign this props :
```jsx
<Clicker keyName='clickerA'/>
```

### Full example which illustrates how to fetch data from an API an render it

```jsx
import { useState, useEffect } from "react";

export default function People() {
	const [people, setPeople] = useState<{ id: number; name: string }[]>([]);
	
	useEffect(() => {
		const fetchPeople = async () => {
			const request = await fetch("https://jsonplaceholder.typicode.com/users");
			return await request.json();
		};
		
		fetchPeople().then((people) => setPeople(people));
	}, []); // useEffect let us doing a side effect whenever a data (dependency) changes
	// Here the array of dependencies is empty, so it will be called only once at the first render.

	return (
		<div>
			<h2>People</h2>
			<ul>
				{people.map(person => <li key={person.id}>{person.name}</li>)}
			</ul>
		</div>
	);
}
```

## Performances

Well, yes and no. When data changes, the component is being re-rendered and if you are using function components (like we did), you can see that everything happening in the function seems to be called again. But that doesn’t mean that the whole component is going to be re-rendered and especially not what’s visible to the user. In fact, only the part that has changed is going to be re-rendered.

To do that, React is using what we call a Virtual DOM. The Virtual DOM is a structural representation of your application. It’s not displayed on screen and its purpose is to be compared to its previous state when data changes. If some parts of it did change, then the real DOM (the one we see) corresponding to those parts will be re-rendered.

Still, those instructions in the component will be called, right? Yes, but React provides a bunch of tools to optimise this part. Let’s say you are doing heavy instructions on a huge array and it takes a few milliseconds to do it. Let’s also say that you have a state that changes a lot. Then our component will be re-rendered a lot and our heavy instructions will be done every time.

In this case, we can use one of the many tools provided by React and we have already used them before. As an example, we can set the value in a  `useState`  so that it’s only calculated on the first render. And if those instructions need to be done again in case some parameters change, then we can use  `useMemo`  instead and specify which variables should trigger the re-calculation in the dependencies array.

This is just an example and we are going to put that into practice in the next lessons.
