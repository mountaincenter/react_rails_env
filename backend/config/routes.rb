Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :test, only: %i[index]
      resources :likes, only: %i[index create]
      resources :chat_rooms, only: %i[index show]
      resources :messages, only: %i[create]
      resources :users, only: %i[index show update]
      mount_devise_token_auth_for 'User', at: 'auth', controller: {
        registrations: 'api/v1/auth/registrations'
      }
      namespace :auth do
        resources :session, only: %i[index]
      end
    end
  end
end
