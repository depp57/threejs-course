import { useState, useEffect } from "react";

export default function People() {
  const [people, setPeople] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchPeople = async () => {
      const request = await fetch("https://jsonplaceholder.typicode.com/users");
      return await request.json();
    };

    fetchPeople().then((people) => setPeople(people));
  }, []);

  return (
    <div>
      <h2>People</h2>

      <ul>
        <>
          {people.map((person) => (
            <li key={person.id}>{person.name}</li>
          ))}
        </>
      </ul>
    </div>
  );
}
