# Fix for "Objects are not valid as a React child" Error

## Problem

In Promotion.jsx line 581-582, the university select dropdown has:

```jsx
{
  Universities.map((u) => (
    <option key={u._id || u.name} value={u.name || u.university || u}>
      {u.name || u.university || u}
    </option>
  ));
}
```

The issue: `|| u` at the end tries to render the entire object if both `u.name` and `u.university` are undefined.

## Solution

Replace lines 580-584 with:

```jsx
{
  Universities?.map((u) => {
    const uniName =
      typeof u === "string"
        ? u
        : u?.name || u?.university || "Unknown University";
    const uniKey = typeof u === "object" && u?._id ? u._id : uniName;
    return (
      <option key={uniKey} value={uniName}>
        {uniName}
      </option>
    );
  });
}
```

This ensures we always render a string, never an object.
