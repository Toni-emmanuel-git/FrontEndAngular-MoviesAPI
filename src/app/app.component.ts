import { Component } from '@angular/core';
import { MovieService } from './movie.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  movies: any[] = [];
  selectedMovie: any = null;
  newMovie: any = { title: '', category: '', year: '' };
  idInput: number = 0;
  updateMovieData: any = { title: '', category: '', year: '' };
  statusMessage: string  = '';
  activeButton: string = '';

  constructor(private movieService: MovieService) {}

  loadMovies() {
    this.movieService.getMovies().subscribe((data) => {
      this.movies = data;
    });
  }

  loadMovieById() {
    if (this.idInput) {
      this.movieService.getMovieById(this.idInput).subscribe((data) => {
        this.movies = [data];
        this.statusMessage = `Filme com ID ${this.idInput} carregado.`;
      }, () => {
        this.statusMessage = `Filme com ID ${this.idInput} não encontrado.`;
        this.movies = [];
      });
    }
  }

  addMovie() {
    this.movieService.addMovie(this.newMovie).subscribe({
      next: () => {
        this.statusMessage = 'O filme foi adicionado com sucesso';
        this.loadMovies();
      },
      error: (err) => {
        this.statusMessage = 'Houve um erro ao adicionar o filme.' + err.message;
      }
    });
  }

  updateMovie() {
    if (this.idInput) {
      this.movieService.updateMovie(this.idInput, this.newMovie).subscribe({
        next: () => {
          this.statusMessage = `Filme com ID ${this.idInput} atualizado com sucesso.`;
          this.loadMovies();
        },
        error: (err) => {
          this.statusMessage = `Erro ao atualizar o filme com ID ${this.idInput}: ${err.message}`;
        }
      });
    } else {
      this.statusMessage = 'Por favor, insira um ID válido para atualizar o filme.';
    }
  }

  deleteMovie() {
    if (this.idInput) {
      this.movieService.deleteMovie(this.idInput).subscribe(() => {
        this.statusMessage = `Filme com ID ${this.idInput} apagado.`;
        this.loadMovies();
      });
    }
  }

  setActiveButton(button: string) {
    if (this.activeButton === button) {
      this.activeButton = '';
    }
    else {
      this.activeButton = button;
    }
    this.statusMessage = '';
    this.selectedMovie = null;
  }

  executeAction() {
    switch (this.activeButton) {
      case 'listAll':
        this.loadMovies();
        break;
      case 'listById':
        this.loadMovieById();
        break;
      case 'add':
        this.addMovie();
        break;
      case 'delete':
        this.deleteMovie();
        break;
      case 'update':
        this.updateMovie();
        break;
      default:
        console.log('Nenhuma ação selecionada');
    }
  }
}
