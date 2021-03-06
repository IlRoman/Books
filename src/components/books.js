import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { setBooks } from '../actions/books';
import { count, price } from '../actions/menu';
import { sortBooks } from '../selectors';
import { AddBookToCard } from '../actions/card';
import { Pagination } from './pagination';
import './books.scss';
import { useLocation } from 'react-router-dom';

function Books({
  books,
  isLoading,
  sort,
  searchTitle,
  AddBookToCard,
  AllCount,
  Price,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(6);
  const location = useLocation();

  const arrRedux = useSelector((state) => state.card.card);

  useEffect(() => {
    const page = location.search
      .split('?')[1]
      .split('&')
      .find((elem) => elem.includes('page='))
      .split('=')[1];
    setCurrentPage(page);
  }, [location]);

  const lastBookIndex = currentPage * perPage;
  const firstBookIndex = lastBookIndex - perPage;
  const currentBook = books.slice(firstBookIndex, lastBookIndex);

  const Func = (book) => {
    AddBook(book);
    AllCount();
    Price(books);
  };

  const AddBook = (book) => {
    if (!book.count) {
      AddBookToCard({ ...book, count: 1 });
    } else {
      AddBookToCard();
    }

    const array = localStorage.getItem('books');
    if (!array) {
      AddBookToCard([...arrRedux, { ...book, count: 1 }]);
      localStorage.setItem(
        'books',
        JSON.stringify([
          {
            id: book.id,
            count: 1,
          },
        ])
      );
    } else {
      const arr = JSON.parse(array);
      const index = arr.findIndex((elem) => elem.id === book.id);
      const indexArr = arrRedux.findIndex((elem) => elem.id === book.id);
      if (index === -1) {
        const arr2 = [...arr, { id: book.id, count: 1 }];
        localStorage.setItem('books', JSON.stringify(arr2));
        AddBookToCard([...arrRedux, { ...book, count: 1 }]);
      } else {
        arr[index] = { id: book.id, count: arr[index].count + 1 };
        localStorage.setItem('books', JSON.stringify(arr));

        arrRedux[indexArr] = { ...book, count: arrRedux[indexArr].count + 1 };
        AddBookToCard(arrRedux);
      }
    }
  };

  return (
    <div className="card_component">
      <div className="container">
        <div className="cards_row">
          {isLoading ? (
            '????????????????...'
          ) : sortBooks(currentBook, sort, searchTitle).length ? (
            sortBooks(currentBook, sort, searchTitle).map((book) => {
              return (
                <div key={book.id} className="cards_item">
                  <div className="card">
                    <div className="card_image">
                      {' '}
                      <img src={book.image} />{' '}
                    </div>
                    <div className="card_title">{book.title}</div>
                    <div className="card_author">{book.author}</div>
                    <div className="card_price">{`??? ${book.price}`}</div>
                    <div className="card_btn" onClick={() => Func(book)}>
                      ???????????????? ?? ??????????????
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="noResult">?????? ??????????????????????</div>
          )}
        </div>
        <Pagination perPage={perPage} totalBooks={books.length} />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  books: state.books.books,
  isLoading: state.books.isLoading,
  searchTitle: state.search.searchTitle,
});

const mapDispatchTopProps = {
  setBooks,
  count,
  price,
  AddBookToCard,
};

export default connect(mapStateToProps, mapDispatchTopProps)(Books);
