const data = [
    [ 'subscriber', 'first_name' ],
    [ 'subscriber', 'email' ],
    [ 'subscriber', 'email' ]
  ]
  const unique = Array.from(new Set(data.map(item => JSON.stringify(item)))).map(JSON.parse);