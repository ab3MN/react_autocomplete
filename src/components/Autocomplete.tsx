import {
  ChangeEvent,
  FC,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Person } from '../types/Person';

import _debounce from 'lodash/debounce';

interface IProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  selectedPerson: Person | null;
  delay?: number;
}

const Autocomplete: FC<IProps> = ({
  people,
  onSelected,
  selectedPerson,
  delay = 300,
}): ReactNode => {
  const [isActive, setActive] = useState(false);
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');

  const debouncedSetQuery = _debounce(setDebounceQuery, delay);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setActive(true);
    setQuery(value);
    debouncedSetQuery(value);
    onSelected(null);
  };

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setActive(false);
    setQuery('');
  };

  const filtredPeople = useMemo(
    () => people.filter(({ name }) => name.includes(debounceQuery)),
    [debounceQuery, people],
  );

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={selectedPerson ? selectedPerson.name : query}
          onFocus={() => setActive(true)}
          onChange={handleChange}
        />
      </div>

      {isActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filtredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onClick={() => handleSelectPerson(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}

            {filtredPeople.length === 0 && (
              <div
                className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
                role="alert"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
