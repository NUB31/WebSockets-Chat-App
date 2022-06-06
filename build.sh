cd frontend
npm run build
rm -r ../backend/build
mv build ../backend
cd ../backend
npm start